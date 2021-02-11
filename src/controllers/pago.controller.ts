import {Request, Response} from 'express'
import {pool} from '../database'
import {Pool, QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

//PRIMERO CREAMOS EL MEDIO AL QUE SE VAN A RELACIONAR LAS SUBENTIDADES

export const crearMedio = async(req: Request,res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO medio_pago
        VALUES(nextval('medio_pago_codigo_med_seq'))
        RETURNING codigo_med`);
        return res.status(201).json({
            message: "Medio de pago successfully created",
            body: {
                Proveedor: {
                }
            },
            respuesta:response.rows //Aquí reguresa el ID que acaba de insertar
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//LUEGO CREAMOS UNA DE ESTAS QUE SE VAN A RELACIONAR AL MEDIO DE PAGO RECIEN CREADO

export const crearCripto = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {medio,wallet,tipo} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO criptomoneda
        VALUES ($1,$2,$3)`,[medio,wallet,tipo]);
        return res.status(201).json({
            message: "Medio de pago cripto created successfully",
            body: {
                Proveedor: {
                    medio,wallet,tipo
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


export const crearDineroEle = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {medio,usuario,servicio} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO dinero_electronico
        VALUES($1,$2,$3)`,[medio,usuario,servicio]);
        return res.status(201).json({
            message: "Relationship Status_orden  created successfully",
            body: {
                Proveedor: {
                    medio,usuario,servicio
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const crearTarjeta = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {medio,numero,banco,tarjetahabiente,cedula,vencimiento,tipo} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO tarjeta
        VALUES($1,$2,$3,$4,$5,$6,$7)`,[medio,numero,banco,tarjetahabiente,cedula,vencimiento,tipo]);
        return res.status(201).json({
            message: "Tarjeta medio created successfully",
            body: {
                Proveedor: {
                    medio,numero,banco,tarjetahabiente,cedula,vencimiento,tipo
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


export const crearCuenta = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {medio,numero,banco,cedula} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO cuenta_bancaria
        VALUES($1,$2,$3,$4,null)`,[medio,numero,banco,cedula]);
        return res.status(201).json({
            message: "Medio Cuenta created successfully",
            body: {
                Proveedor: {
                    medio,numero,banco,cedula
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const crearEfectivo = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {medio,divisa} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO efectivo
        VALUES($1,$2);`,[medio,divisa]);
        return res.status(201).json({
            message: "Medio Efectivo created successfully",
            body: {
                Proveedor: {
                    medio,divisa
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const crearPunto = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {medio} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO punto
        VALUES($1,(SELECT MAX(codigo_val)FROM valor_punto))`,[medio]);
        return res.status(201).json({
            message: "Medio Punto created successfully",
            body: {
                Proveedor: {
                    medio
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

//POR ULTIMO RELACIONAMOS EL PAGO AL MEDIO DE PAGO CREADO PREVIAMENTE Y A LA ORDEN A LA QUE PAGA 

export const crearPago = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {importe,medio,orden} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO pago
        VALUES(default,$1,$2,$3)`,[importe,medio,orden]);
        return res.status(201).json({
            message: "Pago created successfully",
            body: {
                Proveedor: {
                    importe,orden,medio
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
