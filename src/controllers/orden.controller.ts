import {Request, Response} from 'express'
import {pool} from '../database'
import {Pool, QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

//Tiendas

export const getOrdenRecien = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const {fecha,sucursal,proveedor} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        SELECT numero_sum
        FROM suministro
        WHERE fecha_sum = $1
        AND fk_sucursal_sum = $2
        AND fk_proveedor_sum = $3`,[fecha,sucursal,proveedor]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const crearOrden = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {fecha,sucursal,proveedor} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT 
        INTO suministro(fecha_sum,fk_sucursal_sum,fk_proveedor_sum)
        VALUES($1,$2,$3)`,[fecha,sucursal,proveedor]);
        return res.status(201).json({
            message: "orden created successfully",
            body: {
                Proveedor: {
                    fecha,sucursal,proveedor
                }
            }
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
        const {fecha,estatus,pedido} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT 
        INTO suministro_estatus
        VALUES($1,$2,$3)`,[fecha,estatus,pedido]);
        return res.status(201).json({
            message: "Relationship Status_orden  created successfully",
            body: {
                Proveedor: {
                    fecha,estatus,pedido
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}