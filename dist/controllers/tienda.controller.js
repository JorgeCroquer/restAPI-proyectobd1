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
exports.createTienda = exports.deleteTienda = exports.updateTienda = exports.getTiendas = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//Tiendas
const getTiendas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`
        SELECT su.codigo_suc as codigo, su.nombre_suc as nombre, pa.nombre_lug as direccion, pa.codigo_lug as codigo_dir, 
        es.nombre_lug as estado, es.codigo_lug as codigo_estado 
        FROM sucursal su,lugar pa,lugar mu, lugar es 
        WHERE su.fk_lugar = pa.codigo_lug
        AND pa.fk_lugar_lug = mu.codigo_lug
        AND mu.fk_lugar_lug = es.codigo_lug
        AND mu.tipo_lugar = 'Municipio'
        AND pa.tipo_lugar = 'Parroquia'
        AND es.tipo_lugar = 'Estado'
        ORDER BY su.codigo_suc`);
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
        const response = yield PoolEnUso.query('UPDATE sucursal SET nombre_suc = $1 WHERE codigo_suc = $2', [nombre, id]);
        return res.status(202).json(`Tienda ${id} updated successfully`);
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
        const response = yield PoolEnUso.query('DELETE FROM sucursal WHERE codigo_suc = $1', [id]);
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
        const response = yield PoolEnUso.query('INSERT INTO sucursal(nombre_suc,fk_lugar) VALUES ($1,$2)', [nombre, codigo_dir]);
        return res.status(201).json({
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
