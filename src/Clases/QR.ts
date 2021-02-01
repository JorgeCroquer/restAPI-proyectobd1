import {LocalPool,pool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = pool
const qrcode = require('qrcode')
const fs = require('fs')

export class QR {



    //Esta funcion genera el QR para un 
    static async generarQR (id:string, url:string){
    
        const QRgenerado = await qrcode.toDataURL(url);


        fs.writeFile(`C:\\ImagenesBD\\QR\\${id}.png`, QRgenerado.split(',')[1] ,'base64', (err: Error) => {
            // throws an error, you could also catch it here
            if (err) throw err;

            console.log('QR salvado');
        });
    }
    static async llenarQRNat(){
        const response: QueryResult = await PoolEnUso.query(`SELECT cedula_nat
        FROM persona_natural`);

        for(let i = 0; i<= response.rows.length-1; i++){
            this.generarQR(response.rows[i].cedula_nat,`http://localhost:3000/api/clientes/naturales/${response.rows[i].cedula_nat}`);
            const escritura: QueryResult = await PoolEnUso.query(`UPDATE persona_natural SET qr_path = $1 WHERE cedula_nat = $2`, [`C:\\ImagenesBD\\QR\\${response.rows[i].cedula_nat}.png`,response.rows[i].cedula_nat ]);
        }

        console.log('listo')
    }
    static async llenarQRJur(){
        const response: QueryResult = await PoolEnUso.query(`SELECT rif_jur
        FROM persona_juridica`);

        for(let i = 0; i<= response.rows.length-1; i++){
            this.generarQR(response.rows[i].rif_jur,`http://localhost:3000/api/clientes/juridicos/${response.rows[i].rif_jur}`);
            const escritura: QueryResult = await PoolEnUso.query(`UPDATE persona_juridica SET qr_path = $1 WHERE rif_jur = $2`, [`C:\\ImagenesBD\\QR\\${response.rows[i].rif_jur}.png`,response.rows[i].rif_jur]);
        }

        console.log('listo')
    }
}