import {LocalPool} from '../database'
import {QueryResult} from 'pg'

const PoolEnUso = LocalPool
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
        const response: QueryResult = await LocalPool.query(`SELECT fk_cedula_nat
        FROM cliente_nat`);

        for(let i = 0; i<= response.rows.length; i++){
            this.generarQR(response.rows[i].fk_cedula_nat,`http://localhost:3000/api/clientes/naturales/${response.rows[i].fk_cedula_nat}`);
            const escritura: QueryResult = await LocalPool.query(`UPDATE cliente_nat SET qr_path = $1 WHERE fk_cedula_nat = $2`, [`C:\\ImagenesBD\\QR\\${response.rows[i].fk_cedula_nat}.png`,response.rows[i].fk_cedula_nat ]);
        }

        console.log('listo')
    }

}