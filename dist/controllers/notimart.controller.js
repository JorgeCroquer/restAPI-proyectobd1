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
exports.getProductosNotimart = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
const getProductosNotimart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield PoolEnUso.query(`SELECT  pro.nombre_pro AS nombre,
                     d.porcentaje_des AS descuento , 
                     pro.pathimagen_pro AS url, 
                     CASE WHEN pro.codigo_pro = pro.codigo_pro THEN false END editar
             FROM promo p JOIN descuento d ON p.codigo_prom = d.fk_promo
                 JOIN producto pro ON d.fk_producto = pro.codigo_pro
             WHERE p.notimart = true AND p.publicada = false`);
        res.status(200).json(productos.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal servel error');
    }
});
exports.getProductosNotimart = getProductosNotimart;
