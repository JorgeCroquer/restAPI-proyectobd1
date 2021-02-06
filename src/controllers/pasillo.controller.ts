import {Request, Response} from 'express'
import {pool} from '../database'
import {QueryResult} from 'pg'

//Aqui se pone la BD que esta en uso
const PoolEnUso = pool;


export const getAlertas = async(req: Request, res: Response) => {
    try {
        const sucursal = req.params.id
        const alertas: QueryResult = await PoolEnUso.query(
            `SELECT pr.codigo_pro AS id_prod,ps.fk_seccion AS id_sec , pr.nombre_pro AS nombre, current_date AS fecha, p.numero_pas AS pasillo, split_part(s.nombre_sec, ' ', 2) AS seccion
             FROM producto pr JOIN producto_seccion ps ON pr.codigo_pro = ps.fk_producto
                JOIN seccion s ON ps.fk_seccion = s.codigo_sec
                JOIN pasillo p ON s.fk_pasillo = p.codigo_pas
                JOIN sucursal s2 on p.fk_sucursal = s2.codigo_suc
            WHERE codigo_suc = $1 AND ps.cantidad_pro_sec <= 10;`, [sucursal])
        return res.status(200).json(alertas.rows)
    } catch (error) {
        console.error(error)
        return res.status(500).send('Internal Server Error');
    }
}

export const reponer = async(req: Request, res: Response) => {
    try {
        
        const {cantidad, id_prod, id_sec} = req.body
        console.log(cantidad);
        console.log(id_prod);
        console.log(id_sec);
        const DescuentoAlmacen: QueryResult = await PoolEnUso.query(
            `UPDATE producto_zona SET cantidad_pro_zon = cantidad_pro_zon-($1)
            WHERE fk_producto = $2
                  AND fk_zona_pro IN (SELECT za.codigo_zon
                                      FROM zona_almacen za JOIN sucursal s ON za.fk_sucursal = s.codigo_suc
                                            JOIN pasillo p ON s.codigo_suc = p.fk_sucursal
                                            JOIN seccion sec on p.codigo_pas = sec.fk_pasillo
                                      WHERE sec.codigo_sec = $3)`, [cantidad, id_prod, id_sec])

        const SumaSeccion: QueryResult = await PoolEnUso.query(
            `UPDATE producto_seccion SET cantidad_pro_sec = cantidad_pro_sec+($1)
            WHERE fk_producto = $2 AND fk_seccion = $3`,[cantidad, id_prod, id_sec]);
        return res.status(200).json({message: 'Reposicion confirmada'})
    } catch (error) {
        console.error(error)
        return res.status(500).send('Internal Server Error');
    }
}