import {Request, Response} from 'express'
import {pool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = pool;

export const getPromosSinNotimart = async(req: Request, res: Response) => {
    try { 
        
        const promos:QueryResult = await PoolEnUso.query(
            `SELECT codigo_prom AS id,
                    nombre_prom AS titulo,
                    fechainicio_des AS fechainicio,
                    fechafin_des AS fechafin,
                    CASE WHEN true THEN false END verdetalles,
                    CASE WHEN true THEN false END formvisible
            FROM promo
            WHERE notimart = false AND current_date BETWEEN fechainicio_des AND fechafin_des`);

        res.status(200).json(promos.rows);     

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const getProductosDePromo = async(req: Request, res: Response) => {
    try {
        const promo = req.params.id
        const productos:QueryResult = await PoolEnUso.query(
            `SELECT d.codigo_des AS id_des,
                    p.nombre_pro AS nombre,
                    d.porcentaje_des AS descuento,
                    p.pathimagen_pro AS url
             FROM promo prom JOIN descuento d ON prom.codigo_prom = d.fk_promo
                JOIN producto p on d.fk_producto = p.codigo_pro
             WHERE prom.codigo_prom = $1`, [promo]);

        res.status(200).json(productos.rows);     

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const deleteProducto = async(req: Request, res: Response) => {
    try {
        const producto = req.params.id
        const borrar:QueryResult = await PoolEnUso.query(
            `DELETE FROM descuento
             WHERE codigo_des = $1`, [producto]);

        res.status(200).json({message: `Descuento ${producto} borrado`});     

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const deletePromo = async(req: Request, res: Response) => {
    try {
        const promo = req.params.id

        const borrarProds:QueryResult = await PoolEnUso.query(
            `DELETE FROM descuento
             WHERE fk_promo = $1`, [promo]);
        const borrarProm:QueryResult = await PoolEnUso.query(
            `DELETE FROM promo
             WHERE codigo_prom = $1`, [promo]);

        res.status(200).json({message: `Promo ${promo} borrada`});     

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error')
    }
}

export const createPromo = async(req: Request,res: Response): Promise<Response> => {
    try{
        const {titulo, fechainicio, fechafin, productos} = req.body;

        const promoIn: QueryResult = await PoolEnUso.query(
            `INSERT INTO promo (nombre_prom,notimart,fechainicio_des,fechafin_des,publicada)
             VALUES ($1,false,$2,$3,$4) RETURNING codigo_prom`,[titulo, fechainicio,fechafin, new Date() > new Date(fechainicio)]);
        
        //Inserto todos los productos
        for (let i in productos){
            const productosIn: QueryResult = await PoolEnUso.query(
                `INSERT INTO descuento (porcentaje_des, fk_producto, fk_promo)
                 VALUES ($1,$2,$3)`, [productos[i].descuento, productos[i].id, promoIn.rows[0].codigo_prom])
        }
       

        return res.status(201).json({message: "Promo creada"});
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

export const updatePromo = async(req: Request,res: Response): Promise<Response> => {
    try{
        const promo = req.params.id;
        const {titulo, fechainicio, fechafin, productos} = req.body;

        const response: QueryResult = await PoolEnUso.query(
            `UPDATE promo 
             SET nombre_prom = $1, fechainicio_des = $2, fechafin_des = $3, publicada = $4
             WHERE codigo_prom = $5`,
             [titulo,fechainicio,fechafin, new Date() > new Date(fechainicio), promo ]);
        return res.status(201).json({
            message: `Promo ${promo} actualizada`});
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}