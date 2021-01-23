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
exports.deleteLugar = exports.updateLugar = exports.createLugar = exports.getLugarById = exports.getSub_LugaresById = exports.getLugares = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.LocalPool;
//Lugares 
const getLugares = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query('SELECT codigo_lug as codigo, nombre_lug as nombre, tipo_lugar as tipo, fk_lugar_lug as codigo_en FROM  lugar');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getLugares = getLugares;
const getSub_LugaresById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codigo_lug = req.params.id;
        const response = yield PoolEnUso.query(`SELECT sublug.codigo_lug as codigo, 
                                                                    sublug.nombre_lug as nombre, 
                                                                    sublug.tipo_lugar as tipo, 
                                                                    sublug.fk_lugar_lug as codigo_en 
                                                             FROM  lugar as sublug JOIN lugar as superlug 
                                                                    ON sublug.fk_lugar_lug = superlug.codigo_lug
                                                             WHERE superlug.codigo_lug = $1`, [codigo_lug]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getSub_LugaresById = getSub_LugaresById;
const getLugarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codigo_lug = req.params.id;
        const response = yield PoolEnUso.query(`SELECT codigo_lug as codigo, 
                                                                    nombre_lug as nombre, 
                                                                    tipo_lugar as tipo, 
                                                                    fk_lugar_lug as codigo_en 
                                                             FROM  lugar
                                                             WHERE codigo_lug = $1`, [codigo_lug]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getLugarById = getLugarById;
const createLugar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre_lug, tipo_lugar, fk_lugar_lug } = req.body;
        const response = yield PoolEnUso.query('INSERT INTO lugar (nombre_lug, tipo_lugar, fk_lugar_lug) VALUES ($1,$2,$3)', [nombre_lug, tipo_lugar, fk_lugar_lug]);
        return res.status(201).json({
            message: "Lugar created successfully",
            body: {
                Proveedor: {
                    nombre_lug, tipo_lugar, fk_lugar_lug
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createLugar = createLugar;
const updateLugar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codigo_lug = req.params.id;
        const { nombre_lug, tipo_lugar, fk_lugar_lug } = req.body;
        const response = yield PoolEnUso.query(`UPDATE lugar SET nombre_lug = $1, tipo_lugar = $2, fk_lugar_lug = $3 
                                                             WHERE codigo_lug = $4`, [nombre_lug, tipo_lugar, fk_lugar_lug, codigo_lug]);
        return res.status(200).json(`Lugar ${codigo_lug} updated successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updateLugar = updateLugar;
const deleteLugar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codigo_lug = req.params.id;
        const response = yield PoolEnUso.query('DELETE FROM lugar WHERE codigo_lug = $1', [codigo_lug]);
        return res.status(200).json(`Lugar ${codigo_lug} deleted successfully`);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.deleteLugar = deleteLugar;
