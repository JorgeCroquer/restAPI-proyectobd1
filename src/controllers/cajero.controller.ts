import {Request, Response} from 'express'
import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

//cajero

export const getProductos = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(
					'SELECT producto.codigo_pro as codigo,\
					producto.nombre_pro as nombre,\
					producto.pathimagen_pro as imagen,\
					precio.precio_pre as precio \
					FROM producto inner join precio \
					ON producto.codigo_pro = precio.fk_producto \
					');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


export const getProductosid = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const id = req.params.id;
        const response: QueryResult = await PoolEnUso.query(

            `SELECT producto.codigo_pro as codigo,\
            producto.nombre_pro as nombre,\
            producto.pathimagen_pro as imagen,\
            precio.precio_pre as precio \
            FROM producto inner join precio \
            ON producto.codigo_pro = precio.fk_producto \
            WHERE producto.codigo_pro = $1`, [id]);

        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}