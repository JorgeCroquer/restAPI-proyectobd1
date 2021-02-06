import {Request, Response} from 'express'
import {pool} from '../database'
import {Pool, QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

export const crearOrden = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {fecha,sucursal,proveedor} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT 
        INTO suministro(fecha_sum,fk_sucursal_sum,fk_proveedor_sum)
        VALUES($1,$2,$3)
        RETURNING numero_sum;`,[fecha,sucursal,proveedor]);
        return res.status(201).json({
            message: "orden created successfully",
            body: {
                suministro: {
                    fecha,sucursal,proveedor,
                }
            },
            respuesta:response.rows
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const crearProductoOrden = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {cantidad,pedido,producto} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT 
        INTO producto_suministro
        VALUES($1,$2,$3)`,[cantidad,pedido,producto]);
        return res.status(201).json({
            message: "Relationship Producto_orden created successfully",
            body: {
                Proveedor: {
                    cantidad,pedido,producto
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const crearOrdenEstatus = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {fecha,pedido} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT 
        INTO suministro_estatus
        VALUES($1,2,$2)`,[fecha,pedido]);
        return res.status(201).json({
            message: "Relationship Status_orden  created successfully",
            body: {
                Proveedor: {
                    fecha,pedido
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}