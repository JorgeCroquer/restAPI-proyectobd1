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
exports.updateClientesNat = exports.getClientesNat = exports.updatePersonaNat = exports.createPersonaNat = exports.deletePersonaJur = exports.updatePersonaJur = exports.createPersonaJur = exports.getEmpleados = exports.deleteProveedor = exports.createProveedor = exports.getProveedores = exports.getLugares = exports.createTienda = exports.deleteTienda = exports.updateTienda = exports.getTiendas = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsersById = void 0;
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
        // const response: QueryResult = await pool.query('SELECT * FROM proveedor ORDER BY rif_jur');
        const response = yield database_1.pool.query('SELECT * FROM persona_juridica WHERE rif_jur IN (SELECT fk_rif_jur FROM proveedor)');
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
        const { fk_rif_jur, marca_propia } = req.body;
        const response = yield database_1.pool.query('INSERT INTO proveedor VALUES ($1,$2)', [fk_rif_jur, marca_propia]);
        return res.status(200).json({
            message: "Proveedor created successfully",
            body: {
                Proveedor: {
                    fk_rif_jur, marca_propia
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
const deleteProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.pool.query('DELETE FROM proveedor WHERE fk_rif_jur = $1', [id]);
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
//personas juridicas
const createPersonaJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur } = req.body;
        const response = yield database_1.pool.query('INSERT INTO persona_juridica VALUES ($1,$2,$3,$4,$5,$6,$7,1,1,1)', [rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur]);
        return res.status(200).json({
            message: "Persona Jurídica created successfully",
            body: {
                Persona: {
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
exports.createPersonaJur = createPersonaJur;
const updatePersonaJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur } = req.body;
        const response = yield database_1.pool.query('UPDATE persona_juridica SET razonsocial_jur = $1,dencomercial_jur = $2, web_jur = $3, capital_jur = $4, fecharegistro_jur = $5, registrofisico_jur = $6  WHERE rif_jur = $7', [razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, registrofisico_jur, rif_jur]);
        return res.status(200).json(`Persona ${rif_jur} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updatePersonaJur = updatePersonaJur;
const deletePersonaJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.pool.query('DELETE FROM persona_juridica WHERE rif_jur = $1', [id]);
        return res.status(200).json(`Persona ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deletePersonaJur = deletePersonaJur;
//persona_natural
const createPersonaNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia } = req.body;
        const response = yield database_1.pool.query('INSERT INTO persona_natural VALUES ($1,$2,$3,$4,$5,$6,$7,1,null,1)', [cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia]);
        return res.status(200).json({
            message: "Persona Jurídica created successfully",
            body: {
                Persona: {
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
exports.createPersonaNat = createPersonaNat;
const updatePersonaNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia } = req.body;
        const response = yield database_1.pool.query('UPDATE persona_natural SET rif_nat = $2, primernombre_nat = $3, segundonombre_nat = $4, primerapellido_nat = $5, segundoapellido_nat = $6, fecharegistro_nat = $7, qr_path=$8,fk_persona_contacto = $9,fk_lugar_residencia =$10 WHERE cedula_nat = $1', [cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia]);
        return res.status(200).json(`Persona ${cedula_nat} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updatePersonaNat = updatePersonaNat;
//cliente natural 
const getClientesNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query(' Select cedula_nat,rif_nat as rif,primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat,fecharegistro_nat as fecharegistro,qr_path,fk_persona_contacto,fk_lugar_residencia,fk_cedula_nat,registrofisico_nat as registrofisico,puntos_nat as puntos,fk_sucursal from persona_natural,cliente_nat where cedula_nat = fk_cedula_nat');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesNat = getClientesNat;
const updateClientesNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fk_cedula_nat, registrofisico, puntos, fk_sucursal } = req.body;
        const response = yield database_1.pool.query('UPDATE cliente_nat SET registrofisico_nat = $2, puntos_nat = $3, fk_sucursal = $4  WHERE fk_cedula_nat = $1', [fk_cedula_nat, registrofisico, puntos, fk_sucursal]);
        return res.status(200).json(`Persona ${fk_cedula_nat} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateClientesNat = updateClientesNat;
