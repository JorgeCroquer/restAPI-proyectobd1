import {Request, Response} from 'express'
import {pool} from '../database'
import {Pool, QueryResult} from 'pg'
import {producto} from '../Clases/producto'
import jwt from 'jsonwebtoken'
import config from '../config/config'


//Aqui se pone la BD que esta en uso
const PoolEnUso = pool

//Tiendas

export const getFaltantes = async(req: Request, res: Response): Promise<Response> =>{
    try{
        const id = parseInt(req.params.id);
        const response: QueryResult = await PoolEnUso.query(`
        SELECT  pr.nombre_pro as Producto, pr.codigo_pro as Producto_codigo, (pz.cantidad_pro_zon + ps.cantidad_pro_sec) as Existencia,jur.rif_jur as Rif_proveedor, jur.dencomercial_jur as Proveedor,
        CASE 
            WHEN EXISTS (SELECT pr.nombre_pro, su.numero_sum 
                        FROM  producto_suministro psu, suministro su, suministro_estatus ss 
                        WHERE pr.codigo_pro = psu.fk_producto_pro_sum 
                        AND psu.fk_pedido_pro_sum = su.numero_sum 
                        AND su.numero_sum = ss.fk_suministro 
                        AND ss.fk_estatus = 2 AND su.fk_sucursal_sum = $1) THEN TRUE 
            ELSE FALSE 
        END AS Orden_Realizada 
        FROM producto pr, producto_zona pz,zona_almacen za,sucursal s, producto_seccion ps, seccion se, pasillo pa, proveedor pro, persona_juridica jur 
        WHERE pr.codigo_pro = pz.fk_producto 
        AND pz.fk_zona_pro = za.codigo_zon 
        AND za.fk_sucursal = s.codigo_suc 
        AND pr.codigo_pro = ps.fk_producto 
        AND ps.fk_seccion = se.codigo_sec 
        AND se.fk_pasillo = pa.codigo_pas 
        AND pa.fk_sucursal = s.codigo_suc 
        AND pr.fk_proveedor_pro = pro.fk_rif_jur 
        AND pro.fk_rif_jur = jur.rif_jur 
        AND s.codigo_suc = $1 
        AND (pz.cantidad_pro_zon + ps.cantidad_pro_sec) <= 100;`,[id]);
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}
