import {Request, Response} from 'express'
import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

//Tiendas

export const getTiendas = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(`
        SELECT su.codigo_suc as codigo, su.nombre_suc as nombre, pa.nombre_lug as direccion, pa.codigo_lug as codigo_dir, 
        es.nombre_lug as estado, es.codigo_lug as codigo_estado 
        FROM sucursal su,lugar pa,lugar mu, lugar es 
        WHERE su.fk_lugar = pa.codigo_lug
        AND pa.fk_lugar_lug = mu.codigo_lug
        AND mu.fk_lugar_lug = es.codigo_lug
        AND mu.tipo_lugar = 'Municipio'
        AND pa.tipo_lugar = 'Parroquia'
        AND es.tipo_lugar = 'Estado'
        ORDER BY su.codigo_suc`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateTienda = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const id = parseInt(req.params.id);
        const {nombre} = req.body;
        const response: QueryResult = await PoolEnUso.query('UPDATE sucursal SET nombre_suc = $1 WHERE codigo_suc = $2', [nombre,id]);
        return res.status(202).json(`Tienda ${id} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteTienda = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await PoolEnUso.query('DELETE FROM sucursal WHERE codigo_suc = $1', [id]);
        return res.status(200).json(`tienda ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createTienda = async(req: Request,res: Response): Promise<Response> => {
    try{
        const{nombre,codigo_dir} = req.body
        const response: QueryResult = await PoolEnUso.query('INSERT INTO sucursal(nombre_suc,fk_lugar) VALUES ($1,$2)', [nombre,codigo_dir]);
        return res.status(201).json({
            message: "Sucursal created successfully",
            body: {
                sucursal: {
                    nombre,
                    codigo_dir
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}