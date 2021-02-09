import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'
import { encryptPassword } from '../controllers/auth.controller';

const PoolEnUso = pool

export class persona_juridica {

    rif: string;
    razonsocial: string;
    denomcomercial: string;
    web: string;
    capital: number;
    fk_direcfisica: string;
    fk_direcfiscal: string

    constructor(rif:string, razonsocial:string, denomcomercial:string, web:string,capital: number,fk_direcfisica:string, fk_direcfiscal:string){
        this.rif = rif;
        this.razonsocial = razonsocial;
        this.denomcomercial = denomcomercial;
        this.web = web;
        this.capital = capital;
        this.fk_direcfisica = fk_direcfisica;
        this.fk_direcfiscal = fk_direcfiscal;
    }

    async existeEnBD(): Promise<boolean> {

        const ValidacionNat: QueryResult = await PoolEnUso.query(`SELECT rif_jur FROM persona_juridica
                                                                      WHERE rif_jur = $1`, [this.rif]);
        

        if (ValidacionNat.rows.length > 0){
            return true;
        }
        else return false;
    } 

    static async llenarUsuarios(){
        const juridicos: QueryResult = await PoolEnUso.query(
            `SELECT SUBSTR(pj.razonsocial_jur,1, POSITION(' ' IN pj.razonsocial_jur))  AS user,
                    REPLACE(CONCAT(SUBSTR(pj.razonsocial_jur,1, POSITION(' ' IN pj.razonsocial_jur)) ,'@ucabmart.com.ve'), ' ', '') AS email,
                    rif_jur as rif
                    FROM persona_juridica pj`);

        for (let i in juridicos.rows){
            const password = await encryptPassword('9876') ;
           
            const usuarios: QueryResult = await PoolEnUso.query(
                `INSERT INTO usuarios (nombre_usu,password_usu,direccion_ema,fk_roles,fk_persona_jur)
                 VALUES ($1,$2,$3,1,$4)`, [juridicos.rows[i].user, password,juridicos.rows[i].email, juridicos.rows[i].rif]);
                 console.log(i);
        }
    console.log('listos')
    }
}