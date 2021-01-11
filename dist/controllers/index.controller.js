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
exports.getEmpleados = exports.deleteProveedor = exports.updateProveedor = exports.createProveedor = exports.getProveedores = exports.getLugares = exports.createTienda = exports.deleteTienda = exports.updateTienda = exports.getTiendas = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsersById = void 0;
const database_1 = require("../database");
//Funciones de respuesta
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
        const response = yield database_1.pool.query('SELECT codigo_suc as codigo, nombre_suc as nombre, nombre_lug as direccion FROM sucursal,lugar WHERE codigo_lug = fk_lugar ORDER BY codigo_suc');
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
        const response = yield database_1.pool.query('INSERT INTO sucursal(nombre_suc,fk_lugar) VALUES ($1,$2)', [nombre, codigo_dir]);
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
//proveedores
const getProveedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT * FROM proveedor ORDER BY rif_jur');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getProveedores = getProveedores;
const createProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur } = req.body;
        const response = yield database_1.pool.query('INSERT INTO proveedor VALUES ($1,$2,$3,$4,$5,$6,$7)', [rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur]);
        return res.status(200).json({
            message: "Proveedor created successfully",
            body: {
                Proveedor: {
                    rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createProveedor = createProveedor;
const updateProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur } = req.body;
        const response = yield database_1.pool.query('UPDATE proveedor SET razonsocial_jur = $1,dencomercial_jur = $2, web_jur = $3, capital_jur = $4, fecharegistro_jur = $5, registrofisico_jur = $6  WHERE rif_jur = $7', [razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur, rif_jur]);
        return res.status(200).json(`Tienda ${rif_jur} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateProveedor = updateProveedor;
const deleteProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.pool.query('DELETE FROM proveedor WHERE rif_jur = $1', [id]);
        return res.status(200).json(`Proveedor ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteProveedor = deleteProveedor;
//empleados
const getEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT cedula_nat, salario_emp, rif_nat, primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat, fecharegistro_nat,registrofisico_nat, nombre_suc FROM empleado,sucursal WHERE codigo_suc = fk_sucursal ORDER BY cedula_nat');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getEmpleados = getEmpleados;
