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
exports.deletePersonaJur = exports.updatePersonaJur = exports.createPersonaJur = exports.getPersonaJurById = exports.getPersonaJur = exports.deletePersonaNat = exports.updatePersonaNat = exports.createPersonaNat = exports.getPersonaNatById = exports.getPersonasNat = void 0;
const database_1 = require("../database");
const auth_controller_1 = require("./auth.controller");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//personas naturales
const getPersonasNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`SELECT cedula_nat AS cedula,
                                                                    coalesce(rif_nat, 'Sin RIF') AS rif,
                                                                    concat(primernombre_nat,' ',segundonombre_nat) AS nombres,
                                                                    concat(primerapellido_nat,' ', segundoapellido_nat) AS apellidos,
                                                                    fecharegistro_nat AS fecha_registro,
                                                                    coalesce(fk_persona_contacto, 'No es Persona de Contacto') AS persona_contacto,
                                                                    fk_lugar_residencia AS residencia
                                                             FROM persona_natural`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getPersonasNat = getPersonasNat;
const getPersonaNatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cedula_nat = req.params.id;
        const response = yield PoolEnUso.query(`SELECT cedula_nat AS cedula,
                                                                    coalesce(rif_nat, 'Sin RIF') AS rif,
                                                                    concat(primernombre_nat,' ',segundonombre_nat) AS nombres,
                                                                    concat(primerapellido_nat,' ', segundoapellido_nat) AS apellidos,
                                                                    fecharegistro_nat AS fecha_registro,
                                                                    coalesce(fk_persona_contacto, 'No es Persona de Contacto'),
                                                                    fk_lugar_residencia AS residencia
                                                             FROM persona_natural
                                                             WHERE cedula_nat = $1`, [cedula_nat]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getPersonaNatById = getPersonaNatById;
const createPersonaNat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia } = req.body;
        const response = yield PoolEnUso.query(`INSERT INTO persona_natural 
                                                             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia]);
        return res.status(201).json({
            message: "Persona Natural created successfully",
            body: {
                Persona: {
                    cedula, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia
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
        const cedula_nat = req.params.id;
        const { rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia } = req.body;
        const response = yield PoolEnUso.query(`UPDATE persona_natural 
                                                             SET rif_nat = $2,
                                                                 primernombre_nat = $3,
                                                                 segundonombre_nat = $4,
                                                                 primerapellido_nat = $5,
                                                                 segundoapellido_nat = $6,
                                                                 fecharegistro_nat = $7,
                                                                 fk_persona_contacto = $8,
                                                                 fk_lugar_residencia = $9
                                                             WHERE cedula_nat = $1`, [cedula_nat, rif, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_registro, persona_contacto, residencia]);
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
        const cedula_nat = req.params.id;
        const response = yield PoolEnUso.query('DELETE FROM persona_natural WHERE cedula_nat = $1', [cedula_nat]);
        return res.status(200).json(`Persona ${cedula_nat} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deletePersonaNat = deletePersonaNat;
//personas juridicas
const getPersonaJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`SELECT rif_jur AS rif,
                                                                    razonsocial_jur AS razon_social,
                                                                    dencomercial_jur AS denom_comercial,
                                                                    web_jur AS web,
                                                                    capital_jur AS capital,
                                                                    fecharegistro_jur AS fecha_registro,
                                                                    registrofisico_jur AS registro_fisico,
                                                                    fk_direccion_fisica_jur AS direccion_fisica,
                                                                    fk_direccion_fiscal_jur AS direccion_fiscal
                                                             FROM persona_juridica`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getPersonaJur = getPersonaJur;
const getPersonaJurById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rif_jur = req.params.id;
        const response = yield PoolEnUso.query(`SELECT rif_jur AS rif,
                                                                    razonsocial_jur AS razon_social,
                                                                    dencomercial_jur AS denom_comercial,
                                                                    web_jur AS web,
                                                                    capital_jur AS capital,
                                                                    fecharegistro_jur AS fecha_registro,
                                                                    registrofisico_jur AS registro_fisico,
                                                                    fk_direccion_fisica_jur AS direccion_fisica,
                                                                    fk_direccion_fiscal_jur AS direccion_fiscal
                                                             FROM persona_juridica
                                                             WHERE rif_jur = $1`, [rif_jur]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getPersonaJurById = getPersonaJurById;
const createPersonaJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, fk_direccion_fisica, fk_direccion_fiscal, usuario, password, email } = req.body;
        console.log(rif_jur);
        const validacionRif = yield PoolEnUso.query(`SELECT rif_jur
             FROM persona_juridica
             WHERE rif_jur = $1`, [rif_jur]);
        if (validacionRif.rows.length != 0) {
            return res.status(400).json({ message: 'Este RIF ya esta en uso' });
        }
        const validacionUser = yield PoolEnUso.query(`SELECT codigo_usu
             FROM usuarios
             WHERE nombre_usu = $1 OR direccion_ema = $2`, [usuario, email]);
        if (validacionRif.rows.length != 0) {
            return res.status(400).json({ message: 'Este nombre de usuario o email ya esta en uso' });
        }
        const responsePer = yield PoolEnUso.query(`INSERT INTO persona_juridica (rif_jur,razonsocial_jur,dencomercial_jur,web_jur,capital_jur,fecharegistro_jur,fk_direccion_fisica_jur, fk_direccion_fiscal_jur) 
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [rif_jur, razonsocial_jur, dencomercial_jur, web_jur, capital_jur, fecharegistro_jur, fk_direccion_fisica, fk_direccion_fiscal]);
        let encrytedPassword = yield auth_controller_1.encryptPassword(password);
        const responseUsu = yield PoolEnUso.query(`INSERT INTO usuarios (nombre_usu,password_usu,direccion_ema,fk_roles,fk_persona_jur)
             VALUES ($1,$2,$3,$4,$5)`, [usuario, encrytedPassword, email, 1, rif_jur]);
        return res.status(201).json({ message: "Persona Jurídica created successfully" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createPersonaJur = createPersonaJur;
const updatePersonaJur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rif_jur = req.params.id;
        const { razon_social, denom_comercial, web, capital, fecha_registro, direccion_fisica, direccion_fiscal } = req.body;
        const response = yield PoolEnUso.query(`UPDATE persona_juridica 
                                                             SET razonsocial_jur = $2,
                                                                 dencomercial_jur = $3,
                                                                 web_jur = $4,
                                                                 capital_jur = $5,
                                                                 fecharegistro_jur = $6,
                                                                 fk_direccion_fisica_jur = $7,
                                                                 fk_direccion_fiscal_jur = $8
                                                             WHERE rif_jur = $1`, [rif_jur, razon_social, denom_comercial, web, capital, fecha_registro, direccion_fisica, direccion_fiscal]);
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
        const rif_jur = req.params.id;
        const response = yield PoolEnUso.query('DELETE FROM persona_juridica WHERE rif_jur = $1', [rif_jur]);
        return res.status(200).json(`Persona ${rif_jur} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deletePersonaJur = deletePersonaJur;
