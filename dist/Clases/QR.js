"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QR = void 0;
const database_1 = require("../database");
const PoolEnUso = database_1.LocalPool;
const qrcode = require('qrcode');
const fs = require('fs');
class QR {
    //Esta funcion genera el QR para un 
    static generarQR(id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const QRgenerado = yield qrcode.toDataURL(url);
            fs.writeFile(`C:\\ImagenesBD\\QR\\${id}.png`, QRgenerado.split(',')[1], 'base64', (err) => {
                // throws an error, you could also catch it here
                if (err)
                    throw err;
                console.log('QR salvado');
            });
        });
    }
    static llenarQRNat() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield database_1.LocalPool.query(`SELECT fk_cedula_nat
        FROM cliente_nat`);
            for (let i = 0; i <= response.rows.length; i++) {
                this.generarQR(response.rows[i].fk_cedula_nat, `http://localhost:3000/api/clientes/naturales/${response.rows[i].fk_cedula_nat}`);
                const escritura = yield database_1.LocalPool.query(`UPDATE cliente_nat SET qr_path = $1 WHERE fk_cedula_nat = $2`, [`C:\\ImagenesBD\\QR\\${response.rows[i].fk_cedula_nat}.png`, response.rows[i].fk_cedula_nat]);
            }
            console.log('listo');
        });
    }
}
exports.QR = QR;
