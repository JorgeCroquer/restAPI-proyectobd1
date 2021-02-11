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
exports.publicar = exports.agregarDescuentos = exports.deleteProducto = exports.getProximaFecha = exports.updateDescuento = exports.getProductosNotimart = void 0;
const database_1 = require("../database");
const orden_1 = require("../Clases/orden");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
const getProductosNotimart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield PoolEnUso.query(`SELECT  d.codigo_des AS id,
                     pro.nombre_pro AS nombre,
                     d.porcentaje_des AS descuento , 
                     pro.pathimagen_pro AS url, 
                     CASE WHEN pro.codigo_pro = pro.codigo_pro THEN false END editar
             FROM promo p JOIN descuento d ON p.codigo_prom = d.fk_promo
                 JOIN producto pro ON d.fk_producto = pro.codigo_pro
             WHERE p.notimart = true AND p.publicada = false`);
        res.status(200).json(productos.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.getProductosNotimart = getProductosNotimart;
const updateDescuento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codigo = req.params.id;
        const { descuento } = req.body;
        const update = yield PoolEnUso.query(`UPDATE descuento
             SET porcentaje_des = $1
             WHERE codigo_des = $2`, [descuento, codigo]);
        res.status(200).json({ message: `El descuento ${codigo} fue actualizado` });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.updateDescuento = updateDescuento;
const getProximaFecha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fecha = yield PoolEnUso.query(`SELECT fechainicio_des
             FROM promo
             WHERE notimart = true AND publicada = false`);
        res.status(200).json(fecha.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.getProximaFecha = getProximaFecha;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codigo = req.params.id;
        const borrar = yield PoolEnUso.query(`DELETE FROM descuento 
             WHERE codigo_des = $1`, [codigo]);
        res.status(200).json({ message: `El producto fue eliminado de Noti-Mart` });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal servel error');
    }
});
exports.deleteProducto = deleteProducto;
const agregarDescuentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = req.body;
        console.log(productos);
        const NotimartActual = yield PoolEnUso.query(`SELECT codigo_prom
             FROM promo
             WHERE notimart = true AND publicada = false`);
        for (let i in productos) {
            yield PoolEnUso.query(`INSERT INTO descuento (porcentaje_des,fk_producto, fk_promo)
                VALUES ($1,$2,$3)`, [productos[i].descuento, productos[i].id, NotimartActual.rows[0].codigo_prom]);
        }
        res.status(201).json({ message: 'Productos agregados' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
exports.agregarDescuentos = agregarDescuentos;
const publicar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.body;
        yield PoolEnUso.query(`UPDATE promo
             SET fechafin_des = $1,publicada = true
             WHERE notimart = true AND publicada = false`, [new Date()]);
        yield PoolEnUso.query(`INSERT INTO promo (nombre_prom,notimart,fechainicio_des,fechafin_des,publicada)
             VALUES ('Noti-Mart',true,$1,null,false)`, [date]);
        res.status(201).json({ message: 'Noti-Mart publicada' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
exports.publicar = publicar;
orden_1.orden.llenarProductoOrden();
