import {Request, Response} from 'express'
import {pool} from '../database'
import {Pool, QueryResult} from 'pg'
import { orden } from '../Clases/orden'

//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

export const getProductosNotimart = async(req: Request, res: Response) => {
    try {
        
        const productos:QueryResult = await PoolEnUso.query(
            `SELECT  d.codigo_des AS id,
                     pro.nombre_pro AS nombre,
                     d.porcentaje_des AS descuento , 
                     pro.pathimagen_pro AS url, 
                     CASE WHEN pro.codigo_pro = pro.codigo_pro THEN false END editar
             FROM promo p JOIN descuento d ON p.codigo_prom = d.fk_promo
                 JOIN producto pro ON d.fk_producto = pro.codigo_pro
             WHERE p.notimart = true AND p.publicada = false`);

        res.status(200).json(productos.rows);     

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const updateDescuento = async(req: Request, res: Response) => {
    try {
        const codigo = req.params.id;
        const {descuento} = req.body;
        const update:QueryResult = await PoolEnUso.query(
            `UPDATE descuento
             SET porcentaje_des = $1
             WHERE codigo_des = $2`, [descuento, codigo]);
        res.status(200).json({message: `El descuento ${codigo} fue actualizado`});     
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const getProximaFecha = async(req: Request, res: Response) => {
    try {
        const fecha:QueryResult = await PoolEnUso.query(
            `SELECT fechainicio_des
             FROM promo
             WHERE notimart = true AND publicada = false`);
        res.status(200).json(fecha.rows[0]);     
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const deleteProducto = async(req: Request, res: Response) => {
    try {
        const codigo = req.params.id
        const borrar:QueryResult = await PoolEnUso.query(
            `DELETE FROM descuento 
             WHERE codigo_des = $1`, [codigo]);
        res.status(200).json({message: `El producto fue eliminado de Noti-Mart`});     
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const agregarDescuentos = async(req: Request, res: Response) => {
    try {
        const productos = req.body
        console.log(productos)

        const NotimartActual:QueryResult = await PoolEnUso.query(
            `SELECT codigo_prom
             FROM promo
             WHERE notimart = true AND publicada = false`);
        
        for (let i in productos){
            await PoolEnUso.query(
                `INSERT INTO descuento (porcentaje_des,fk_producto, fk_promo)
                VALUES ($1,$2,$3)`, [productos[i].descuento, productos[i].id, NotimartActual.rows[0].codigo_prom]
                )
        }
        res.status(201).json({message: 'Productos agregados'})
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error')
        
    }
}

export const publicar = async(req: Request, res: Response) => {
    try {
        const {date} = req.body;
        await PoolEnUso.query(
            `UPDATE promo
             SET fechafin_des = $1,publicada = true
             WHERE notimart = true AND publicada = false`, [new Date()]);
        await PoolEnUso.query(
            `INSERT INTO promo (nombre_prom,notimart,fechainicio_des,fechafin_des,publicada)
             VALUES ('Noti-Mart',true,$1,null,false)`, [date])
        res.status(201).json({message: 'Noti-Mart publicada'})
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error')
    }
}

orden.llenarPagos()