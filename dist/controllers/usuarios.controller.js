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
exports.getRoles = exports.deleteUsuario = exports.updateUsuario = exports.getUsuarios = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//Tiendas
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`
        SELECT codigo_usu as codigo, nombre_usu as nombreusu, direccion_ema as email, 
        fk_roles as codigorol, nombre_rol as nombrerol, fk_persona_nat as cedula,fk_persona_jur as rif, primernombre_nat||' '||primerapellido_nat as nombre
        FROM usuarios 
        JOIN roles ON  fk_roles = codigo_rol
        JOIN persona_natural ON fk_persona_nat = cedula_nat
        UNION
        SELECT codigo_usu as codigo, nombre_usu as nombreusu, direccion_ema as email, 
        fk_roles as codigorol,  nombre_rol as nombrerol, fk_persona_nat as cedula, fk_persona_jur as rif, dencomercial_jur as nombre
        FROM usuarios 
        JOIN roles ON  fk_roles = codigo_rol
        JOIN persona_juridica ON fk_persona_jur = rif_jur
        ORDER BY 2`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getUsuarios = getUsuarios;
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { nombreusu, email, codigorol } = req.body;
        const response = yield PoolEnUso.query(`
        UPDATE usuarios
        SET nombre_usu = $1, direccion_ema = $2, fk_roles = $3
        WHERE codigo_usu = $4`, [nombreusu, email, codigorol, id]);
        return res.status(202).json(`Ususario ${id} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateUsuario = updateUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const response = yield PoolEnUso.query('DELETE FROM usuarios WHERE codigo_usu = $1', [id]);
        return res.status(200).json(`Usuario ${id} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteUsuario = deleteUsuario;
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`
        SELECT codigo_rol as codigo, nombre_rol as nombre
        FROM roles`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getRoles = getRoles;
