import {Request, Response} from 'express'
import {pool} from '../database'
import {Pool, QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

export const crearOrden = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {puntosA,untosG,fecha,Date,tipo,valorPunto,sucursal,clienteId,direcionTextual, id, rol} = req.body;
        console.log(id);
        const response: QueryResult = await PoolEnUso.query(`
        INSERT 
        INTO ORDEN(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
		   fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_nat,direcciontextual_ord)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING numero_ord`,[puntosA,untosG,fecha,Date,tipo,valorPunto,sucursal,clienteId,direcionTextual]);
        return res.status(201).json({
            message: "orden created successfully",
            body: {
                suministro: {
                    puntosA,untosG,fecha,Date,tipo,valorPunto,sucursal,clienteId,direcionTextual
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
        const {cantidad,precio,producto,orden} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO producto_orden(cantidad_pro_ord,precio_prod_ord,fk_producto_pro_ord,fk_orden_pro_ord)
        VALUES($1,$2,$3,$4)`,[cantidad,precio,producto,orden]);
        return res.status(201).json({
            message: "Relationship Producto_orden created successfully",
            body: {
                Proveedor: {
                    cantidad,precio,producto,orden
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
        const {fecha,orden,estatus} = req.body;
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO status_orden
        VALUES($1,$2,$3)`,[fecha,orden,estatus]);
        return res.status(201).json({
            message: "Relationship Status_orden created successfully",
            body: {
                Proveedor: {
                    fecha,orden
                }
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}