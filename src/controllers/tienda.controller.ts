import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = LocalPool

//Tiendas

export const getTiendas = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query('SELECT codigo_suc as codigo, nombre_suc as nombre, nombre_lug as direccion FROM sucursal,lugar WHERE codigo_lug = fk_lugar ORDER BY codigo_suc');
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