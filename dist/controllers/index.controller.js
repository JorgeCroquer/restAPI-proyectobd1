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
exports.getLugares = exports.createTienda = exports.deleteTienda = exports.updateTienda = exports.getTiendas = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsersById = exports.getEmpleados = exports.getCarnet = void 0;
const database_1 = require("../database");
const qrcode = require('qrcode');
const fs = require('fs');
function generarQR(cedula, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const QR = yield qrcode.toDataURL(url);
        fs.writeFile(`C:\\ImagenesDB\\QR\\${cedula}.png`, QR.split(',')[1], 'base64', (err) => {
            // throws an error, you could also catch it here
            if (err)
                throw err;
            console.log('QR salvado');
        });
    });
}
//Funciones de respuesta
const getCarnet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cedula = req.params.id;
        let urlQR = `http://localhost:3000/api/cliente/${cedula}`;
        //Se genera el QR
        generarQR(cedula, urlQR);
        //consultamos por la persona con esa cedula
        const response = yield database_1.pool2.query(`SELECT persona_nat.cedula_nat,  fk_sucursal,  persona_nat.primernombre_nat,   persona_nat.segundonombre_nat,  persona_nat.primerapellido_nat,   persona_nat.segundoapellido_nat, numero_tel,  cliente_nat.qrpath
        FROM cliente_nat, persona_nat, telefono
        WHERE persona_nat.cedula_nat = $1 AND cliente_nat.cedula_nat = $1 AND telefono.fk_persona = $1`, [cedula]);
        //Armamos el nombre
        let nombre = response.rows[0].primernombre_nat;
        if (response.rows[0].segundonombre_nat != null)
            nombre = `${nombre} ${response.rows[0].segundonombre_nat}`;
        nombre = `${nombre} ${response.rows[0].primerapellido_nat}`;
        if (response.rows[0].segundoapellido_nat != null)
            nombre = `${nombre} ${response.rows[0].segundoapellido_nat}`;
        //Se envia el JSON
        return res.status(200).json({
            cliente: {
                'cedula': response.rows[0].cedula_nat.toString(),
                'nombre': nombre,
                'telefono': response.rows[0].numero_tel,
                'id': `${response.rows[0].fk_sucursal} - ${response.rows[0].cedula_nat.toString()}`,
                'qrpath': response.rows[0].qrpath
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getCarnet = getCarnet;
const getEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT cedula, nombre, salario_emp, horarioent, horariosal FROM pruebaemp');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getEmpleados = getEmpleados;
const getUsersById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getUsersById = getUsersById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, email } = req.body;
        const response = yield database_1.pool.query('INSERT INTO users (nombre,email) VALUES ($1,$2)', [nombre, email]);
        return res.status(200).json({
            message: "User created successfully",
            body: {
                user: {
                    nombre,
                    email
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { nombre, email } = req.body;
        const response = yield database_1.pool.query('UPDATE users SET nombre = $1, email = $2 WHERE id = $3', [nombre, email, id]);
        return res.status(200).json(`User ${id} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('DELETE FROM users WHERE id = $1', [id]);
        return res.status(200).json(`User ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteUser = deleteUser;
//Tiendas
const getTiendas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT codigo_suc as codigo, nombre_suc as nombre, nombre_lug as direccion  FROM sucursal,lugar WHERE codigo_lug = fk_lugar ORDER BY codigo_suc');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getTiendas = getTiendas;
const updateTienda = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { nombre } = req.body;
        const response = yield database_1.pool.query('UPDATE sucursal SET nombre_suc = $1 WHERE codigo_suc = $2', [nombre, id]);
        return res.status(200).json(`Tienda ${id} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateTienda = updateTienda;
const deleteTienda = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield database_1.pool.query('DELETE FROM sucursal WHERE codigo_suc = $1', [id]);
        return res.status(200).json(`tienda ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteTienda = deleteTienda;
const createTienda = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, codigo_dir } = req.body;
        const response = yield database_1.pool.query('INSERT INTO sucursal(codigo_suc,nombre_suc,fk_lugar) VALUES (4,$1,$2)', [nombre, codigo_dir]);
        return res.status(200).json({
            message: "Sucursal created successfully",
            body: {
                sucursal: {
                    nombre,
                    codigo_dir
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createTienda = createTienda;
//Luagares 
const getLugares = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT codigo_lug as codigo, nombre_lug as nombre, tipo_lugar as tipo, fk_lugar_lug as codigo_en FROM  lugar');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getLugares = getLugares;
