import {Request, Response} from 'express'
import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

//Tiendas

export const getUsuarios = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(`
        SELECT codigo_usu as codigo, nombre_usu as nombreusu, direccion_ema as email, 
        fk_roles as codigorol, nombre_rol as nombrerol, fk_persona_nat as cedula,fk_persona_jur as rif, primernombre_nat||' '||primerapellido_nat as nombre
        FROM usuarios 
        JOIN roles ON  fk_roles = codigo_rol
        JOIN persona_natural ON fk_persona_nat = cedula_nat
        UNION
        SELECT codigo_usu as codigo, nombre_usu as nombreusu, direccion_ema as email, 
        fk_roles as codigorol,  nombre_rol as nombrerol, fk_persona_nat as cedula, fk_persona_jur as rif, dencomercial_jur as nombre
        FROM usuarios 
        JOIN roles ON  fk_roles = codigo_rol
        JOIN persona_juridica ON fk_persona_jur = rif_jur
        ORDER BY 2`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updateUsuario = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const id = parseInt(req.params.id);
        const {nombreusu,email,codigorol} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        UPDATE usuarios
        SET nombre_usu = $1, direccion_ema = $2, fk_roles = $3
        WHERE codigo_usu = $4`, [nombreusu,email,codigorol,id]);
        return res.status(202).json(`Ususario ${id} updated successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const deleteUsuario = async(req: Request,res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await PoolEnUso.query('DELETE FROM usuarios WHERE codigo_usu = $1', [id]);
        return res.status(200).json(`Usuario ${id} deleted successfully`);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getRoles = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(`
        SELECT codigo_rol as codigo, nombre_rol as nombre
        FROM roles`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
