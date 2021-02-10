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
            `SELECT producto.codigo_pro as codigo,
            producto.nombre_pro as nombre,
            producto.pathimagen_pro as imagen,
            precio.precio_pre as precio 
            FROM producto inner join precio 
            ON producto.codigo_pro = precio.fk_producto 
            `);
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

            `SELECT producto.codigo_pro as codigo,
            producto.nombre_pro as nombre,
            producto.pathimagen_pro as imagen,
            precio.precio_pre as precio 
            FROM producto inner join precio 
            ON producto.codigo_pro = precio.fk_producto 
            WHERE producto.codigo_pro = $1`, [id]);

        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getTablaMonedas = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(
            `SELECT tipo_moneda.nombre_tip as moneda,
            historico_moneda.valor_his as valor
            FROM tipo_moneda join historico_moneda 
            ON tipo_moneda.codigo_tip = historico_moneda.fk_tipo_moneda 
            WHERE historico_moneda.fechafin_his is null`);

        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getClientesNat = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(
            `select persona_natural.cedula_nat,
            persona_natural.primernombre_nat,
            persona_natural.primerapellido_nat,
            cliente_nat.puntos_nat
            from cliente_nat join persona_natural
            on persona_natural.cedula_nat=cliente_nat.fk_cedula_nat`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getClientesJur = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(
            `select persona_juridica.rif_jur,
            persona_juridica.razonsocial_jur,
            cliente_jur.puntos_jur
            from cliente_jur join persona_juridica
            on persona_juridica.rif_jur=cliente_jur.fk_rif_jur`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getValorPunto = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(
            `select * from valor_punto
            where fechafin_val is null`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const getDescuentos = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(
            `
            select 
            codigo_des as codigo,
            porcentaje_des as porcentaje,
            fk_producto as producto
            from descuento
            join promo
            on promo.codigo_prom=descuento.fk_promo
            where promo.fechafin_des is null`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}



