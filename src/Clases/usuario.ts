import {LocalPool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = LocalPool

export class usuario {

    username: string;
    password: string;
    email:string;
    roles: number[];
    fk_persona_nat: number = 0;
    fk_persona_jur: string = '';

    constructor(username:string, password:string, email:string, roles: number[]){
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
    }
 

    async existeEnBD(): Promise<boolean> {

        const ValidacionUsername: QueryResult = await PoolEnUso.query(`SELECT nombre_usu FROM usuarios
                                                                      WHERE nombre_usu = $1`, [this.username]);
        const ValidacionEmail: QueryResult = await PoolEnUso.query(`SELECT direccion_ema FROM usuarios
                                                                      WHERE direccion_ema = $1`, [this.email]);

        if (ValidacionUsername.rows.length > 0 || ValidacionEmail.rows.length > 0){
            return true;
        }
        else return false;
    } 

}