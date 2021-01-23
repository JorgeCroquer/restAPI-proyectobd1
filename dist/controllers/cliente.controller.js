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
exports.createClienteJur = exports.deleteClientesJur = exports.updateClientesJur = exports.getClientesJurById = exports.getClientesJur = exports.createClienteNat = exports.deleteClientesNat = exports.updateClientesNat = exports.getClientesNatById = exports.getClientesNat = void 0;
const database_1 = require("../database");
const qrcode = require('qrcode');
const fs = require('fs');
//Esta funcion genera el QR para un 
function generarQR(cedula, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const QRgenerado = yield qrcode.toDataURL(url);
        fs.writeFile(`C:\\ImagenesBD\\QR\\${cedula}.png`, QRgenerado.split(',')[1], 'base64', (err) => {
            // throws an error, you could also catch it here
            if (err)
                throw err;
            console.log('QR salvado');
        });
    });
}
function llenarQR() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield database_1.LocalPool.query(`SELECT fk_cedula_nat
    FROM cliente_nat`);
        for (let i = 0; i <= response.rows.length; i++) {
            generarQR(response.rows[i].fk_cedula_nat, `http://localhost:3000/api/cliente/${response.rows[i].fk_cedula_nat}`);
        }
        console.log('listo');
    });
}
//cliente natural 
const getClientesNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.LocalPool.query(`SELECT fk_cedula_nat AS cedula, 
                                                                    registrofisico_nat AS registro_fisico, 
                                                                    puntos_nat AS puntos, 
                                                                    fk_sucursal AS sucursal, 
                                                                    qr_path
                                                            FROM cliente_nat`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesNat = getClientesNat;
const getClientesNatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fk_cedula_nat = req.params.id;
        const response = yield database_1.LocalPool.query(`SELECT fk_cedula_nat AS cedula, 
                                                                    registrofisico_nat AS registro_fisico, 
                                                                    puntos_nat AS puntos, 
                                                                    fk_sucursal AS sucursal, 
                                                                    qr_path
                                                            FROM cliente_nat
                                                            WHERE fk_cedula_nat = $1`, [fk_cedula_nat]);
        return res.status(200).json(response.rows[0]);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesNatById = getClientesNatById;
const updateClientesNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fk_cedula_nat = req.params.id;
        const { registrofisico_nat, puntos_nat, fk_sucursal } = req.body;
        const response = yield database_1.LocalPool.query('UPDATE cliente_nat SET registrofisico_nat = $2, puntos_nat = $3, fk_sucursal = $4  WHERE fk_cedula_nat = $1', [fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal]);
        return res.status(200).json(`Persona ${fk_cedula_nat} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateClientesNat = updateClientesNat;
const deleteClientesNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.LocalPool.query('DELETE FROM cliente_nat WHERE fk_cedula_nat = $1', [id]);
        return res.status(200).json(`Cliente ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteClientesNat = deleteClientesNat;
const createClienteNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Falta comprobar que exista una persona con esa cedula
        const { fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal } = req.body;
        generarQR(fk_cedula_nat, `http://localhost:3000/api/clientes/naturales/${fk_cedula_nat}`);
        const QR = `C:\\ImagenesBD\\QR\\${fk_cedula_nat}.png`;
        const responseCliente = yield database_1.LocalPool.query('INSERT INTO cliente_nat VALUES ($1,$2,$3,$4,$5)', [fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal, QR]);
        return res.status(201).json({
            message: "Cliente natural created successfully",
            body: {
                Cliente: {
                    fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal, QR
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createClienteNat = createClienteNat;
//Clientes juridicos
const getClientesJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.LocalPool.query(`SELECT fk_rif_jur AS RIF,
                                                                    puntos_jur AS puntos,
                                                                    fk_sucursal AS sucursal 
                                                             FROM cliente_jur`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesJur = getClientesJur;
const getClientesJurById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fk_rif_jur = req.params.id;
        const response = yield database_1.LocalPool.query(`SELECT fk_rif_jur AS RIF,
                                                                    puntos_jur AS puntos,
                                                                    fk_sucursal AS sucursal 
                                                             FROM cliente_jur
                                                            WHERE fk_rif_jur = $1`, [fk_rif_jur]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesJurById = getClientesJurById;
const updateClientesJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fk_rif_jur = req.params.id;
        const { puntos_jur, fk_sucursal } = req.body;
        const response = yield database_1.LocalPool.query('UPDATE cliente_jur SET puntos_jur = $2, fk_sucursal = $3  WHERE fk_rif_jur = $1', [fk_rif_jur, puntos_jur, fk_sucursal]);
        return res.status(200).json(`Cliente ${fk_rif_jur} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateClientesJur = updateClientesJur;
const deleteClientesJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.LocalPool.query('DELETE FROM cliente_jur WHERE fk_rif_jur = $1', [id]);
        return res.status(200).json(`Cliente ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteClientesJur = deleteClientesJur;
const createClienteJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fk_rif_jur, registrofisico_jur, puntos_jur, fk_sucursal } = req.body;
        const response = yield database_1.LocalPool.query('INSERT INTO cliente_jur VALUES ($1,$2,$3,$4)', [fk_rif_jur, registrofisico_jur, puntos_jur, fk_sucursal]);
        return res.status(200).json({
            message: "Cliente Jurídico created successfully",
            body: {
                Persona: {
                    fk_rif_jur, registrofisico_jur, puntos_jur, fk_sucursal
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createClienteJur = createClienteJur;
