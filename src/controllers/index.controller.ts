import {Request, Response} from 'express'
import {pool, pool2} from '../database'
import {QueryResult} from 'pg'


const qrcode = require('qrcode')
const fs = require('fs')



//Funciones de respuesta
// export const getCarnet = async(req: Request,res: Response): Promise<Response> => {
//     try{
//         const cedula = req.params.id;
//         let urlQR = `http://localhost:3000/api/cliente/${cedula}`;

//         //Se genera el QR
//         generarQR(cedula, urlQR);
        
//         //consultamos por la persona con esa cedula
//         const response: QueryResult = await pool2.query(`SELECT persona_nat.cedula_nat,  fk_sucursal,  persona_nat.primernombre_nat,   persona_nat.segundonombre_nat,  persona_nat.primerapellido_nat,   persona_nat.segundoapellido_nat, numero_tel,  cliente_nat.qrpath
//         FROM cliente_nat, persona_nat, telefono
//         WHERE persona_nat.cedula_nat = $1 AND cliente_nat.cedula_nat = $1 AND telefono.fk_persona = $1`, [cedula]);

//         //Armamos el nombre
//         let nombre:string = response.rows[0].primernombre_nat;
//         if (response.rows[0].segundonombre_nat != null) nombre = `${nombre} ${response.rows[0].segundonombre_nat}`;
//         nombre = `${nombre} ${response.rows[0].primerapellido_nat}`;
//         if (response.rows[0].segundoapellido_nat != null) nombre = `${nombre} ${response.rows[0].segundoapellido_nat}`;
        
//         //Se envia el JSON
//         return res.status(200).json({
//             cliente: {
//                 'cedula': response.rows[0].cedula_nat.toString(),
//                 'nombre': nombre,
//                 'telefono': response.rows[0].numero_tel,
//                 'id': `${response.rows[0].fk_sucursal} - ${response.rows[0].cedula_nat.toString()}`,
//                 'qrpath': response.rows[0].qrpath
//             }
//         });
//     }
//     catch(e){
//         console.log(e);
//         return res.status(500).send('Internal Server Error');
//     }
// }

export const getUsersById = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createUser = async(req: Request,res: Response): Promise<Response> => {
    try{
        const{nombre,email} = req.body
        const response: QueryResult = await pool.query('INSERT INTO users (nombre,email) VALUES ($1,$2)', [nombre,email]);
        return res.status(200).json({
            message: "User created successfully",
            body: {
                user: {
                    nombre,
                    email
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


export const updateUser = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const {nombre,email} = req.body
        const response: QueryResult = await pool.query('UPDATE users SET nombre = $1, email = $2 WHERE id = $3', [nombre,email,id]);
        return res.status(200).json(`User ${id} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteUser = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return res.status(200).json(`User ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


//Luagares 
export const getLugares = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await pool.query('SELECT codigo_lug as codigo, nombre_lug as nombre, tipo_lugar as tipo, fk_lugar_lug as codigo_en FROM  lugar');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


//empleados

export const getEmpleados = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await pool.query(`SELECT cedula_nat, salario_emp, rif_nat, primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat, nombre_suc, horaentrada_hor, horasalida_hor, nombre_ben
        FROM persona_natural,empleado,sucursal,horario_empleado, horario, beneficio_empleado, beneficio
        WHERE cedula_nat = fk_empleado AND fk_cedula_nat = horario_empleado.fk_empleado AND  codigo_hor = horario_empleado.fk_horario AND codigo_suc = empleado.fk_sucursal AND fk_empleado_ben_emp = cedula_nat AND codigo_ben = beneficio_empleado.fk_beneficio_ben_emp`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//personas juridicas

export const createPersonaJur = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur} = req.body;
        const response: QueryResult = await pool.query('INSERT INTO persona_juridica VALUES ($1,$2,$3,$4,$5,$6,$7,1,1,1)',[rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur]);
        return res.status(200).json({
            message: "Persona Jurídica created successfully",
            body: {
                Persona: {
                    rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updatePersonaJur = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const {rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur} = req.body;
        const response: QueryResult = await pool.query('UPDATE persona_juridica SET razonsocial_jur = $1,dencomercial_jur = $2, web_jur = $3, capital_jur = $4, fecharegistro_jur = $5, registrofisico_jur = $6  WHERE rif_jur = $7', [razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,registrofisico_jur,rif_jur]);
        return res.status(200).json(`Persona ${rif_jur} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deletePersonaJur = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = req.params.id;
        const response: QueryResult = await pool.query('DELETE FROM persona_juridica WHERE rif_jur = $1', [id]);
        return res.status(200).json(`Persona ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


