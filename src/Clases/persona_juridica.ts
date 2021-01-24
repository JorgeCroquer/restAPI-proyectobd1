import {LocalPool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = LocalPool

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

}