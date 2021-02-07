import {LocalPool, pool} from '../database'
import {Pool, QueryResult} from 'pg'
import {encryptPassword} from '../controllers/auth.controller'

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

    static async llenarUsuarios(){
        const empleados: QueryResult = await PoolEnUso.query(
            `SELECT CONCAT(primernombre_nat, '_',primerapellido_nat) AS user,
                    CONCAT(primernombre_nat, '_', primerapellido_nat, '@ucabmart.com.ve') AS email,
                    cedula_nat AS cedula
             FROM persona_natural JOIN empleado e on persona_natural.cedula_nat = e.fk_cedula_nat
             WHERE primernombre_nat NOT LIKE '%prueba%'`);

        for (let i in empleados.rows){
            const password = await encryptPassword('1234') ;
           
            const usuarios: QueryResult = await PoolEnUso.query(
                `INSERT INTO usuarios (nombre_usu,password_usu,direccion_ema,fk_roles,fk_persona_nat)
                 VALUES ($1,$2,$3,12,$4)`, [empleados.rows[i].user, password,empleados.rows[i].email, empleados.rows[i].cedula]);
                 console.log(i);
        }
    console.log('listos')
    }
}