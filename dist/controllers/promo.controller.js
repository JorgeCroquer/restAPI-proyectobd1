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
exports.updatePromo = exports.createPromo = exports.deletePromo = exports.deleteProducto = exports.getProductosDePromo = exports.getPromosSinNotimart = void 0;
const database_1 = require("../database");
const PoolEnUso = database_1.pool;
const getPromosSinNotimart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promos = yield PoolEnUso.query(`SELECT codigo_prom AS id,
                    nombre_prom AS titulo,
                    fechainicio_des AS fechainicio,
                    fechafin_des AS fechafin,
                    CASE WHEN true THEN false END verdetalles,
                    CASE WHEN true THEN false END formvisible
            FROM promo
            WHERE notimart = false AND current_date BETWEEN fechainicio_des AND fechafin_des`);
        res.status(200).json(promos.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.getPromosSinNotimart = getPromosSinNotimart;
const getProductosDePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promo = req.params.id;
        const productos = yield PoolEnUso.query(`SELECT d.codigo_des AS id_des,
                    p.nombre_pro AS nombre,
                    d.porcentaje_des AS descuento,
                    p.pathimagen_pro AS url
             FROM promo prom JOIN descuento d ON prom.codigo_prom = d.fk_promo
                JOIN producto p on d.fk_producto = p.codigo_pro
             WHERE prom.codigo_prom = $1`, [promo]);
        res.status(200).json(productos.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.getProductosDePromo = getProductosDePromo;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const producto = req.params.id;
        const borrar = yield PoolEnUso.query(`DELETE FROM descuento
             WHERE codigo_des = $1`, [producto]);
        res.status(200).json({ message: `Descuento ${producto} borrado` });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.deleteProducto = deleteProducto;
const deletePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promo = req.params.id;
        const borrarProds = yield PoolEnUso.query(`DELETE FROM descuento
             WHERE fk_promo = $1`, [promo]);
        const borrarProm = yield PoolEnUso.query(`DELETE FROM promo
             WHERE codigo_prom = $1`, [promo]);
        res.status(200).json({ message: `Promo ${promo} borrada` });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.deletePromo = deletePromo;
const createPromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { titulo, fechainicio, fechafin, productos } = req.body;
        const promoIn = yield PoolEnUso.query(`INSERT INTO promo (nombre_prom,notimart,fechainicio_des,fechafin_des,publicada)
             VALUES ($1,false,$2,$3,$4) RETURNING codigo_prom`, [titulo, fechainicio, fechafin, new Date() > new Date(fechainicio)]);
        //Inserto todos los productos
        for (let i in productos) {
            const productosIn = yield PoolEnUso.query(`INSERT INTO descuento (porcentaje_des, fk_producto, fk_promo)
                 VALUES ($1,$2,$3)`, [productos[i].descuento, productos[i].id, promoIn.rows[0].codigo_prom]);
        }
        return res.status(201).json({ message: "Promo creada" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.createPromo = createPromo;
const updatePromo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promo = req.params.id;
        const { titulo, fechainicio, fechafin, productos } = req.body;
        const response = yield PoolEnUso.query(`UPDATE promo 
             SET nombre_prom = $1, fechainicio_des = $2, fechafin_des = $3, publicada = $4
             WHERE codigo_prom = $5`, [titulo, fechainicio, fechafin, new Date() > new Date(fechainicio), promo]);
        return res.status(201).json({
            message: `Promo ${promo} actualizada`
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.updatePromo = updatePromo;
