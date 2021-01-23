import {Request, Response} from 'express'
import {LocalPool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = LocalPool

//Luagares 
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