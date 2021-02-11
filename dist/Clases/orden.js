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
exports.orden = void 0;
const database_1 = require("../database");
const auth_controller_1 = require("../controllers/auth.controller");
const PoolEnUso = database_1.pool;
class orden {
    static llenarStatusOrden() {
        return __awaiter(this, void 0, void 0, function* () {
            const ordenes = yield PoolEnUso.query(`SELECT numero_ord
             FROM orden
             WHERE tipo_ord <> 'compra fisica' AND tipo_ord <> 'Compra Fisica'`);
            for (let i in ordenes.rows) {
                const insert = yield PoolEnUso.query(`INSERT INTO status_orden (fecha_est_ord, fk_orden, fk_status)
                 VALUES ($1,$2,$3)`, [new Date().toLocaleDateString('en-US'), ordenes.rows[i].numero_ord, 5]);
                console.log(i);
            }
            console.log('listo');
        });
    }
    static llenarProductoOrden() {
        return __awaiter(this, void 0, void 0, function* () {
            const ordenes = yield PoolEnUso.query(`SELECT numero_ord
             FROM orden
             WHERE tipo_ord <> 'compra fisica' AND tipo_ord <> 'Compra Fisica'`);
            const productos = yield PoolEnUso.query(`SELECT codigo_pro,
                CASE
                     WHEN codigo_des is not null THEN precio_pre-precio_pre*codigo_des*0.01
                     ELSE precio_pre
                END precio,
                CASE
                     WHEN MOD(codigo_pro, 2)= 1 THEN 2
                     ELSE 1
                END cantidad
         
                FROM producto p JOIN precio p2 on p.codigo_pro = p2.fk_producto
                        FULL JOIN descuento d on p.codigo_pro = d.fk_producto
                        FULL JOIN promo p3 on d.fk_promo = p3.codigo_prom
                WHERE publicada = true AND current_date < fechafin_des
                UNION
                SELECT codigo_pro,
                CASE
                        WHEN codigo_des is not null THEN precio_pre-precio_pre*codigo_des*0.01
                        ELSE precio_pre
                END precio,
                CASE
                        WHEN MOD(codigo_pro, 2)= 1 THEN 2
                        ELSE 1
                END cantidad

                FROM producto p JOIN precio p2 on p.codigo_pro = p2.fk_producto
                        FULL JOIN descuento d on p.codigo_pro = d.fk_producto

                WHERE codigo_des is null`);
            for (let i in ordenes.rows) {
                let prod = auth_controller_1.getRandomInt(0, productos.rows.length);
                let precio = Math.round(productos.rows[prod].precio);
                const Insert = yield PoolEnUso.query(`INSERT INTO producto_orden
                 VALUES ($1,$2,$3,$4)`, [productos.rows[prod].cantidad, precio, productos.rows[prod].codigo_pro, ordenes.rows[i].numero_ord]);
                console.log(i);
            }
            console.log('listo');
        });
    }
}
exports.orden = orden;
