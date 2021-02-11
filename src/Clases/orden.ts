import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = pool

export class orden {



    static async llenarStatusOrden(){
        const ordenes: QueryResult = await PoolEnUso.query(
            `SELECT numero_ord
             FROM orden`)
        for (let i in ordenes.rows){
            const insert: QueryResult = await PoolEnUso.query(
                `INSERT INTO status_orden (fecha_est_ord, fk_orden, fk_status)
                 VALUES ($1,$2,$3)`, [new Date().toLocaleDateString('en-US'),ordenes.rows[i].numero_ord, 5])
            console.log(i)
        }
        console.log('listo')
    } 
    

}