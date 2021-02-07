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
exports.getProductosid = exports.getProductos = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//cajero
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query('SELECT producto.codigo_pro as codigo,\
					producto.nombre_pro as nombre,\
					producto.pathimagen_pro as imagen,\
					precio.precio_pre as precio \
					FROM producto inner join precio \
					ON producto.codigo_pro = precio.fk_producto \
					');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getProductos = getProductos;
const getProductosid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const response = yield PoolEnUso.query(`SELECT producto.codigo_pro as codigo,\
            producto.nombre_pro as nombre,\
            producto.pathimagen_pro as imagen,\
            precio.precio_pre as precio \
            FROM producto inner join precio \
            ON producto.codigo_pro = precio.fk_producto \
            WHERE producto.codigo_pro = $1`, [id]);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getProductosid = getProductosid;
