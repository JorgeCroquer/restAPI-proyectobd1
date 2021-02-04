import {Request, Response} from 'express'
import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

export const getProductosNotimart = async(req: Request, res: Response) => {
    try {
        
        const productos:QueryResult = await PoolEnUso.query(
            `SELECT  pro.nombre_pro AS nombre,
                     d.porcentaje_des AS descuento , 
                     pro.pathimagen_pro AS url, 
                     CASE WHEN pro.codigo_pro = pro.codigo_pro THEN false END editar
             FROM promo p JOIN descuento d ON p.codigo_prom = d.fk_promo
                 JOIN producto pro ON d.fk_producto = pro.codigo_pro
             WHERE p.notimart = true AND p.publicada = false`);

        res.status(200).json(productos.rows);     

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal servel error')
    }
}