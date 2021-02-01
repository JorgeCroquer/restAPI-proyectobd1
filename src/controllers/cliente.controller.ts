import {Request, Response} from 'express'
import {LocalPool,pool} from '../database'
import {QueryResult} from 'pg'

//Aqui se cambia la BD que esta en uso
const PoolEnUso = pool


const qrcode = require('qrcode')
const fs = require('fs')

//Esta funcion genera el QR para un 
async function generarQR (cedula:string, url:string){
   
    const QRgenerado = await qrcode.toDataURL(url);


    fs.writeFile(`C:\\ImagenesBD\\QR\\${cedula}.png`, QRgenerado.split(',')[1] ,'base64', (err: Error) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        console.log('QR salvado');
    });
}
async function llenarQR(){
    const response: QueryResult = await LocalPool.query(`SELECT fk_cedula_nat
    FROM cliente_nat`);

    for(let i = 0; i<= response.rows.length; i++){
        generarQR(response.rows[i].fk_cedula_nat,`http://localhost:3000/api/clientes/naturales/${response.rows[i].fk_cedula_nat}`);
        const escritura: QueryResult = await LocalPool.query(`UPDATE cliente_nat SET qr_path = $1 WHERE fk_cedula_nat = $2`, [`C:\\ImagenesBD\\QR\\${response.rows[i].fk_cedula_nat}.png`,response.rows[i].fk_cedula_nat ]);
    }

    console.log('listo')
}

//Funciones de respuesta
 export const getCarnet = async(req: Request,res: Response): Promise<Response> => {
     try{
         const cedula = req.params.id;
         let urlQR = `http://localhost:3000/api/cliente/${cedula}`;

         //Se genera el QR
         generarQR(cedula, urlQR);
        
         //consultamos por la persona con esa cedula
         const response: QueryResult = await LocalPool.query(`SELECT persona_nat.cedula_nat,  fk_sucursal,  persona_nat.primernombre_nat,   persona_nat.segundonombre_nat,  persona_nat.primerapellido_nat,   persona_nat.segundoapellido_nat, numero_tel,  cliente_nat.qrpath
         FROM cliente_nat, persona_nat, telefono
         WHERE persona_nat.cedula_nat = $1 AND cliente_nat.cedula_nat = $1 AND telefono.fk_persona = $1`, [cedula]);

         //Armamos el nombre
         let nombre:string = response.rows[0].primernombre_nat;
         if (response.rows[0].segundonombre_nat != null) nombre = `${nombre} ${response.rows[0].segundonombre_nat}`;
         nombre = `${nombre} ${response.rows[0].primerapellido_nat}`;
         if (response.rows[0].segundoapellido_nat != null) nombre = `${nombre} ${response.rows[0].segundoapellido_nat}`;
        
         //Se envia el JSON
         return res.status(200).json({
            cliente: {
                'cedula': response.rows[0].cedula_nat.toString(),
                'nombre': nombre,
                'telefono': response.rows[0].numero_tel,
                'id': `${response.rows[0].fk_sucursal} - ${response.rows[0].cedula_nat.toString()}`,
                'qrpath': response.rows[0].qrpath
            }
        });
    }
    catch(e){
         console.log(e);
         return res.status(500).send('Internal Server Error');
    }
}



//cliente natural 
export const getClientesNat = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(`SELECT fk_cedula_nat AS cedula, 
                                                                    registrofisico_nat AS registro_fisico, 
                                                                    puntos_nat AS puntos, 
                                                                    fk_sucursal AS sucursal 
                                                            FROM cliente_nat`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getClientesNatById = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const cedula = req.params.id
        const response: QueryResult = await PoolEnUso.query(`SELECT fk_cedula_nat AS cedula, 
                                                                    registrofisico_nat AS registro_fisico, 
                                                                    puntos_nat AS puntos, 
                                                                    fk_sucursal AS sucursal
                                                            FROM cliente_nat
                                                            WHERE fk_cedula_nat = $1`, [cedula]);
        return res.status(200).json(response.rows[0]);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateClientesNat = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const fk_cedula_nat = req.params.id
        const {registrofisico_nat,puntos_nat,fk_sucursal} = req.body;
        const response: QueryResult = await PoolEnUso.query('UPDATE cliente_nat SET registrofisico_nat = $2, puntos_nat = $3, fk_sucursal = $4  WHERE fk_cedula_nat = $1', [fk_cedula_nat,registrofisico_nat,puntos_nat,fk_sucursal]);
        return res.status(200).json(`Persona ${fk_cedula_nat} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteClientesNat = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const id = req.params.id;
        const response: QueryResult = await PoolEnUso.query('DELETE FROM cliente_nat WHERE fk_cedula_nat = $1', [id]);
        return res.status(200).json(`Cliente ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createClienteNat = async(req: Request,res: Response): Promise<Response> => {
    try{
        //Falta comprobar que exista una persona con esa cedula
        const {fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal} = req.body;

        const QR = `C:\\ImagenesBD\\QR\\${fk_cedula_nat}.png`

        const responseCliente: QueryResult = await PoolEnUso.query('INSERT INTO cliente_nat VALUES ($1,$2,$3,$4)',[fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal]);
        return res.status(201).json({
            message: "Cliente natural created successfully",
            body: {
                Cliente: {
                    fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//Clientes juridicos
export const getClientesJur = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(`SELECT fk_rif_jur AS RIF,
                                                                    puntos_jur AS puntos,
                                                                    fk_sucursal AS sucursal 
                                                             FROM cliente_jur`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getClientesJurById = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const fk_rif_jur = req.params.id;
        const response: QueryResult = await PoolEnUso.query(`SELECT fk_rif_jur AS RIF,
                                                                    puntos_jur AS puntos,
                                                                    fk_sucursal AS sucursal 
                                                             FROM cliente_jur
                                                            WHERE fk_rif_jur = $1`, [fk_rif_jur]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateClientesJur = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const fk_rif_jur = req.params.id
        const {puntos_jur,fk_sucursal} = req.body;
        const response: QueryResult = await PoolEnUso.query('UPDATE cliente_jur SET puntos_jur = $2, fk_sucursal = $3  WHERE fk_rif_jur = $1', [fk_rif_jur,puntos_jur,fk_sucursal]);
        return res.status(200).json(`Cliente ${fk_rif_jur} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteClientesJur = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const id = req.params.id;
        const response: QueryResult = await PoolEnUso.query('DELETE FROM cliente_jur WHERE fk_rif_jur = $1', [id]);
        return res.status(200).json(`Cliente ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createClienteJur = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {fk_rif_jur,registrofisico_jur,puntos_jur,fk_sucursal} = req.body;
        const response: QueryResult = await PoolEnUso.query('INSERT INTO cliente_jur VALUES ($1,$2,$3,$4)',[fk_rif_jur,registrofisico_jur,puntos_jur,fk_sucursal]);
        return res.status(200).json({
            message: "Cliente Jurídico created successfully",
            body: {
                Persona: {
                    fk_rif_jur,registrofisico_jur,puntos_jur,fk_sucursal
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
