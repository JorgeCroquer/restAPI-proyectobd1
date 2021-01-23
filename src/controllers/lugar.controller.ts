import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'

//Aqui se pone la BD que esta en uso
const PoolEnUso = LocalPool

//Lugares 
export const getLugares = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query('SELECT codigo_lug as codigo, nombre_lug as nombre, tipo_lugar as tipo, fk_lugar_lug as codigo_en FROM  lugar');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getSub_LugaresById = async(req: Request, res: Response): Promise<Response> =>{
    try{

        const codigo_lug = req.params.id;
        const response: QueryResult = await PoolEnUso.query(`SELECT sublug.codigo_lug as codigo, 
                                                                    sublug.nombre_lug as nombre, 
                                                                    sublug.tipo_lugar as tipo, 
                                                                    sublug.fk_lugar_lug as codigo_en 
                                                             FROM  lugar as sublug JOIN lugar as superlug 
                                                                    ON sublug.fk_lugar_lug = superlug.codigo_lug
                                                             WHERE superlug.codigo_lug = $1`, [codigo_lug]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getLugarById = async(req: Request, res: Response): Promise<Response> =>{
    try{

        const codigo_lug = req.params.id;
        const response: QueryResult = await PoolEnUso.query(`SELECT codigo_lug as codigo, 
                                                                    nombre_lug as nombre, 
                                                                    tipo_lugar as tipo, 
                                                                    fk_lugar_lug as codigo_en 
                                                             FROM  lugar
                                                             WHERE codigo_lug = $1`, [codigo_lug]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const createLugar = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {nombre_lug,tipo_lugar,fk_lugar_lug} = req.body;
        const response: QueryResult = await PoolEnUso.query('INSERT INTO lugar (nombre_lug, tipo_lugar, fk_lugar_lug) VALUES ($1,$2,$3)',[nombre_lug,tipo_lugar,fk_lugar_lug]);
        return res.status(201).json({
            message: "Lugar created successfully",
            body: {
                Proveedor: {
                    nombre_lug,tipo_lugar,fk_lugar_lug
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateLugar = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const codigo_lug = req.params.id
        const {nombre_lug,tipo_lugar,fk_lugar_lug} = req.body;
        const response: QueryResult = await PoolEnUso.query(`UPDATE lugar SET nombre_lug = $1, tipo_lugar = $2, fk_lugar_lug = $3 
                                                             WHERE codigo_lug = $4`, [nombre_lug,tipo_lugar,fk_lugar_lug, codigo_lug]);
        return res.status(200).json(`Lugar ${codigo_lug} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteLugar = async(req: Request,res: Response): Promise<Response> => {
    try{
        const codigo_lug = req.params.id;
        const response: QueryResult = await PoolEnUso.query('DELETE FROM lugar WHERE codigo_lug = $1', [codigo_lug]);
        return res.status(200).json(`Lugar ${codigo_lug} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}