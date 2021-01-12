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
exports.createClienteJur = exports.deleteClientesJur = exports.updateClientesJur = exports.getClientesJur = exports.createClienteNat = exports.deleteClientesNat = exports.updateClientesNat = exports.getClientesNat = exports.deletePersonaNat = exports.updatePersonaNat = exports.getPersonasNat = exports.createPersonaNat = exports.deletePersonaJur = exports.updatePersonaJur = exports.createPersonaJur = exports.getEmpleados = exports.deleteProveedor = exports.createProveedor = exports.getProveedores = exports.getLugares = exports.createTienda = exports.deleteTienda = exports.updateTienda = exports.getTiendas = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsersById = exports.getCarnet = void 0;
const database_1 = require("../database");
const qrcode = require('qrcode');
const fs = require('fs');
function generarQR(cedula, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const QR = yield qrcode.toDataURL(url);
        fs.writeFile(`C:\\ImagenesBD\\QR\\${cedula}.png`, QR.split(',')[1], 'base64', (err) => {
            // throws an error, you could also catch it here
            if (err)
                throw err;
            console.log('QR salvado');
        });
    });
}
function llenarQR() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield database_1.pool.query(`SELECT fk_cedula_nat
    FROM cliente_nat`);
        for (let i = 0; i <= response.rows.length; i++) {
            generarQR(response.rows[i].fk_cedula_nat, `http://localhost:3000/api/cliente/${response.rows[i].fk_cedula_nat}`);
        }
        console.log('listo');
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
        const response = yield database_1.pool.query(`SELECT cedula_nat, salario_emp, rif_nat, primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat, nombre_suc, horaentrada_hor, horasalida_hor, nombre_ben
        FROM persona_natural,empleado,sucursal,horario_empleado, horario, beneficio_empleado, beneficio
        WHERE cedula_nat = fk_empleado AND fk_cedula_nat = horario_empleado.fk_empleado AND  codigo_hor = horario_empleado.fk_horario AND codigo_suc = empleado.fk_sucursal AND fk_empleado_ben_emp = cedula_nat AND codigo_ben = beneficio_empleado.fk_beneficio_ben_emp`);
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
                    cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia
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
const getPersonasNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT cedula_nat, rif_nat, primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat, fecharegistro_nat FROM persona_natural');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getPersonasNat = getPersonasNat;
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
const deletePersonaNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield database_1.pool.query('DELETE FROM persona_natural WHERE cedula_nat = $1', [id]);
        return res.status(200).json(`Persona ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deletePersonaNat = deletePersonaNat;
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
        const { fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal } = req.body;
        const response = yield database_1.pool.query('UPDATE cliente_nat SET registrofisico_nat = $2, puntos_nat = $3, fk_sucursal = $4  WHERE fk_cedula_nat = $1', [fk_cedula_nat, registrofisico_nat, puntos_nat, fk_sucursal]);
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
        const response = yield database_1.pool.query('DELETE FROM cliente_natural WHERE cedula_nat = $1', [id]);
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
        const { cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia } = req.body;
        const response = yield database_1.pool.query('INSERT INTO persona_natural VALUES ($1,$2,$3,$4,$5,$6,$7,1,null,1)', [cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia]);
        return res.status(200).json({
            message: "Persona Jurídica created successfully",
            body: {
                Persona: {
                    cedula_nat, rif, primernombre_nat, segundonombre_nat, primerapellido_nat, segundoapellido_nat, fecharegistro, qr_path, fk_persona_contacto, fk_lugar_residencia
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
        const response = yield database_1.pool.query(' Select * from cliente_jur');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getClientesJur = getClientesJur;
const updateClientesJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fk_rif_jur, registrofisico_jur, puntos_jur, fk_sucursal } = req.body;
        const response = yield database_1.pool.query('UPDATE cliente_jur SET registrofisico_jur = $2, puntos_jur = $3, fk_sucursal = $4  WHERE fk_cedula_nat = $1', [fk_rif_jur, registrofisico_jur, puntos_jur, fk_sucursal]);
        return res.status(200).json(`Persona ${fk_rif_jur} updated successfully`);
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
        const response = yield database_1.pool.query('DELETE FROM cliente_jur WHERE fk_rif_jur = $1', [id]);
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
        const response = yield database_1.pool.query('INSERT INTO cliente_jur VALUES ($1,$2,$3,$4)', [fk_rif_jur, registrofisico_jur, puntos_jur, fk_sucursal]);
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
