import {LocalPool, pool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = pool

export class persona_natural {

    cedula: number;
    rif: string;
    primernombre: string;
    segundonombre: string;
    primerapellido: string;
    segundoapellido: string;
    fk_personacontacto: string;
    fk_residencia: number

    constructor(cedula:number, rif:string, primernombre:string, segundonombre:string, primerapellido:string,segundoapellido:string,fk_personacontacto:string, fk_residencia:number){
        this.cedula = cedula;
        this.rif = rif;
        this.primernombre = primernombre;
        this.segundonombre = segundonombre;
        this.primerapellido = primerapellido;
        this.segundoapellido = segundoapellido;
        this.fk_personacontacto = fk_personacontacto;
        this.fk_residencia = fk_residencia;
    }

    async existeEnBD(): Promise<boolean> {

        const ValidacionNat: QueryResult = await PoolEnUso.query(`SELECT cedula_nat FROM persona_natural
                                                                      WHERE cedula_nat = $1`, [this.cedula]);
        

        if (ValidacionNat.rows.length > 0){
            return true;
        }
        else return false;
    } 

}