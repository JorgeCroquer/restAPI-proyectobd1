import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'
import { getRandomInt } from '../controllers/auth.controller'

const PoolEnUso = pool

export class orden {



    static async llenarStatusOrden(){
        const ordenes: QueryResult = await PoolEnUso.query(
            `SELECT numero_ord
             FROM orden
             WHERE tipo_ord <> 'compra fisica' AND tipo_ord <> 'Compra Fisica'`)
        for (let i in ordenes.rows){
            const insert: QueryResult = await PoolEnUso.query(
                `INSERT INTO status_orden (fecha_est_ord, fk_orden, fk_status)
                 VALUES ($1,$2,$3)`, [new Date().toLocaleDateString('en-US'),ordenes.rows[i].numero_ord, 5])
            console.log(i)
        }
        console.log('listo')
    } 
    
    static async llenarProductoOrden(){
        const ordenes: QueryResult = await PoolEnUso.query(
            `SELECT numero_ord
             FROM orden
             WHERE tipo_ord <> 'compra fisica' AND tipo_ord <> 'Compra Fisica'`)
        const productos: QueryResult = await PoolEnUso.query(
                `SELECT codigo_pro,
                CASE
                     WHEN codigo_des is not null THEN precio_pre-precio_pre*codigo_des*0.01
                     ELSE precio_pre
                END precio,
                CASE
                     WHEN MOD(codigo_pro, 2)= 1 THEN 2
                     ELSE 1
                END cantidad
         
                FROM producto p JOIN precio p2 on p.codigo_pro = p2.fk_producto
                        FULL JOIN descuento d on p.codigo_pro = d.fk_producto
                        FULL JOIN promo p3 on d.fk_promo = p3.codigo_prom
                WHERE publicada = true AND current_date < fechafin_des
                UNION
                SELECT codigo_pro,
                CASE
                        WHEN codigo_des is not null THEN precio_pre-precio_pre*codigo_des*0.01
                        ELSE precio_pre
                END precio,
                CASE
                        WHEN MOD(codigo_pro, 2)= 1 THEN 2
                        ELSE 1
                END cantidad

                FROM producto p JOIN precio p2 on p.codigo_pro = p2.fk_producto
                        FULL JOIN descuento d on p.codigo_pro = d.fk_producto

                WHERE codigo_des is null`)
        
        for (let i in ordenes.rows){
            let prod = getRandomInt(0,productos.rows.length)
            let precio = Math.round(productos.rows[prod].precio)
            const Insert:QueryResult = await PoolEnUso.query(
            
                `INSERT INTO producto_orden
                 VALUES ($1,$2,$3,$4)`, 
                 [productos.rows[prod].cantidad,precio, productos.rows[prod].codigo_pro, ordenes.rows[i].numero_ord])
                 console.log(i)

        }
        console.log('listo')
    }

}
