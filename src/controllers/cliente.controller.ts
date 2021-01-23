import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'

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
        generarQR(response.rows[i].fk_cedula_nat,`http://localhost:3000/api/cliente/${response.rows[i].fk_cedula_nat}`);
    }

    console.log('listo')
}




//cliente natural 

export const getClientesNat = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await LocalPool.query(`SELECT fk_cedula_nat AS cedula, 
                                                                    registrofisico_nat AS registro_fisico, 
                                                                    puntos_nat AS puntos, 
                                                                    fk_sucursal AS sucursal, 
                                                                    qr_path
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
        const fk_cedula_nat = req.params.id
        const response: QueryResult = await LocalPool.query(`SELECT fk_cedula_nat AS cedula, 
                                                                    registrofisico_nat AS registro_fisico, 
                                                                    puntos_nat AS puntos, 
                                                                    fk_sucursal AS sucursal, 
                                                                    qr_path
                                                            FROM cliente_nat
                                                            WHERE fk_cedula_nat = $1`, [fk_cedula_nat]);
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
        const response: QueryResult = await LocalPool.query('UPDATE cliente_nat SET registrofisico_nat = $2, puntos_nat = $3, fk_sucursal = $4  WHERE fk_cedula_nat = $1', [fk_cedula_nat,registrofisico_nat,puntos_nat,fk_sucursal]);
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
        const response: QueryResult = await LocalPool.query('DELETE FROM cliente_nat WHERE fk_cedula_nat = $1', [id]);
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
        generarQR(fk_cedula_nat,`http://localhost:3000/api/clientes/naturales/${fk_cedula_nat}`);
        const QR = `C:\\ImagenesBD\\QR\\${fk_cedula_nat}.png`
        const responseCliente: QueryResult = await LocalPool.query('INSERT INTO cliente_nat VALUES ($1,$2,$3,$4,$5)',[fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal, QR]);
        return res.status(201).json({
            message: "Cliente natural created successfully",
            body: {
                Cliente: {
                    fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal, QR
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
        const response: QueryResult = await LocalPool.query(`SELECT fk_rif_jur AS RIF,
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
        const response: QueryResult = await LocalPool.query(`SELECT fk_rif_jur AS RIF,
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
        const response: QueryResult = await LocalPool.query('UPDATE cliente_jur SET puntos_jur = $2, fk_sucursal = $3  WHERE fk_rif_jur = $1', [fk_rif_jur,puntos_jur,fk_sucursal]);
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
        const response: QueryResult = await LocalPool.query('DELETE FROM cliente_jur WHERE fk_rif_jur = $1', [id]);
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
        const response: QueryResult = await LocalPool.query('INSERT INTO cliente_jur VALUES ($1,$2,$3,$4)',[fk_rif_jur,registrofisico_jur,puntos_jur,fk_sucursal]);
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
