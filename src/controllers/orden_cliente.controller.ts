import {Request, Response} from 'express'
import {pool} from '../database'
import {Pool, QueryResult} from 'pg'

import jwt from 'jsonwebtoken'
import config from '../config/config'

//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

export const crearOrden = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {puntosA,puntosG,fecha,tipo,valorPunto,lugardir,sucursal,direcionTextual} = req.body;
        const userId = req.userId;

        const tipoCli: QueryResult = await PoolEnUso.query(
            `SELECT fk_persona_nat, fk_persona_jur
             FROM usuarios 
             WHERE codigo_usu =$1`,[userId])

        let tipocliente: string
        if (tipoCli.rows[0].fk_persona_nat){
            tipocliente = 'nat'
        }else{
            tipocliente = 'jur'
        }


        const persona: QueryResult = await PoolEnUso.query(
            `SELECT pn.cedula_nat::varchar(12) AS id
             FROM persona_natural pn JOIN usuarios u ON pn.cedula_nat = u.fk_persona_nat
             WHERE codigo_usu = $1
             UNION
             SELECT pj.rif_jur AS id
             FROM persona_juridica pj JOIN usuarios u ON pj.rif_jur = u.fk_persona_jur
             WHERE codigo_usu = $1`,[userId])

        let id = persona.rows[0].id

        let puntos
        if (puntosG == null){
            puntos = 0;
        }else{
            puntos = puntosG
        }
        console.log(id)
        if (tipocliente == 'nat'){
            console.log('natural')
            const response: QueryResult = await PoolEnUso.query(`
            INSERT 
            INTO ORDEN(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
            fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_nat,direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`,[puntosA,puntos,fecha,tipo,valorPunto,lugardir,sucursal,id,direcionTextual]);
            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        puntosA,puntos,fecha,Date,tipo,valorPunto,sucursal,userId,direcionTextual
                    }
                },
                respuesta:response.rows
            });

        }else if (tipocliente == 'jur'){
            console.log('juridico')
            const response: QueryResult = await PoolEnUso.query(`
            INSERT 
            INTO ORDEN(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
            fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_jur,direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`,[puntosA,puntos,fecha,tipo,valorPunto,lugardir,sucursal,id,direcionTextual]);
            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        puntosA,puntos,fecha,Date,tipo,valorPunto,sucursal,userId,direcionTextual
                    }
                },
                respuesta:response.rows
            });
        }
        return res.status(500).json({message: "Error muy raro"})

    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}


export const crearOrdenFisico = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {puntosA,puntosG,valorPunto,sucursal,direcionTextual, id, tipo} = req.body;
        const fecha = new Date().toLocaleDateString('en-US');
        const tipoCompra = 'Compra fisica'
        const lugar: QueryResult = await PoolEnUso.query(
            `SELECT codigo_lug
             FROM lugar JOIN sucursal ON sucursal.fk_lugar = lugar.codigo_lug
             WHERE sucursal.codigo_suc = $1`, [sucursal])

        let parroquia = lugar.rows[0].codigo_lug




        if (tipo == 'nat'){

            const response: QueryResult = await PoolEnUso.query(`
            INSERT 
            INTO orden(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
            fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_nat,direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`,[puntosA,puntosG,fecha,tipoCompra,valorPunto,parroquia,sucursal,id,direcionTextual]);

            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        puntosA,puntosG,fecha,Date,tipoCompra,valorPunto,sucursal,id,direcionTextual
                    }
                },
                respuesta:response.rows
            });
        }else{
            const response: QueryResult = await PoolEnUso.query(`
            INSERT 
            INTO orden(puntosadquiridos_ord,puntosgastados_ord,fecha_ord,tipo_ord,
            fk_valor_punto_ord,fk_lugar_ord,fk_sucursal,fk_cliente_jur,direcciontextual_ord)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING numero_ord`,[puntosA,puntosG,fecha,tipoCompra,valorPunto,parroquia,sucursal,id,direcionTextual]);

            return res.status(201).json({
                message: "orden created successfully",
                body: {
                    suministro: {
                        puntosA,puntosG,fecha,Date,tipoCompra,valorPunto,sucursal,id,direcionTextual
                    }
                },
                respuesta:response.rows
            });


        }
            
   
            

    }catch(error){
        console.error(error)
        return res.status(500).send('Internal server error')
    }
}


export const crearProductoOrden = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {cantidad,precio,producto,orden} = req.body;
        let precio_redondeado = Math.round(precio);
        const response: QueryResult = await PoolEnUso.query(`
        INSERT
        INTO producto_orden(cantidad_pro_ord,precio_prod_ord,fk_producto_pro_ord,fk_orden_pro_ord)
        VALUES($1,$2,$3,$4)`,[cantidad,precio_redondeado,producto,orden]);
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

export const getValorPunto = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const response: QueryResult = await PoolEnUso.query(`
        SELECT codigo_val
        FROM valor_punto
        WHERE fechainicio_val = (SELECT MAX(fechainicio_val) FROM valor_punto)`);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
