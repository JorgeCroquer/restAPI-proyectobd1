import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = pool

export class producto {

    codigo_pro: number;
    nombre_pro: string;
    pathimagen_pro: string;
    fk_proveedor_pro: string;
    fk_marca_pro: number;


    constructor(codigo_pro:number, nombre_pro:string, pathimagen_pro:string, fk_proveedor_pro:string, fk_marca_pro:number){
        this.codigo_pro = codigo_pro;
        this.nombre_pro = nombre_pro;
        this.pathimagen_pro = pathimagen_pro;
        this.fk_proveedor_pro = fk_proveedor_pro;
        this.fk_marca_pro = fk_marca_pro;
    }

    async existeEnBD(): Promise<boolean> {

        const ValidacionPro: QueryResult = await PoolEnUso.query(`SELECT codigo_pro FROM producto
                                                                      WHERE codigo_pro = $1`, [this.codigo_pro]);
        

        if (ValidacionPro.rows.length > 0){
            return true;
        }
        else return false;
    } 

    static async llenarPath(){
        const productos: QueryResult = await PoolEnUso.query('SELECT codigo_pro FROM producto')
        for (let i in productos.rows){
            const llenado: QueryResult = await PoolEnUso.query(`UPDATE producto 
                                                                SET pathimagen_pro = $1 
                                                                WHERE codigo_pro = $2`, [`assets\\img\\productos\\${productos.rows[i].codigo_pro}.png` , productos.rows[i].codigo_pro])
            console.log(i);
        }
        console.log('listo')
    }

}