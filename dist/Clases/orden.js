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
    static llenarPagos() {
        return __awaiter(this, void 0, void 0, function* () {
            var tiposTarjeta = ['Debito', 'Credito'];
            var vencimiento = ['01/01/2025', '01/01/2026', '01/01/2027'];
            var bancos = ['Banco Banesco', 'Banco Nacional De Credito', 'Banco de Venezuela', 'Banco Mercantil'];
            var wallet = ['Coinbase', 'Trezor', 'Green Address', 'Electrum'];
            var criptomonedas = ['BitCoin', 'Ethereum', 'DodgeCoin'];
            var servicios = ['Paypal', 'UpHold', 'Skrill', 'Pyoneer'];
            const ordenes2 = yield PoolEnUso.query(`SELECT numero_ord
             FROM orden`);
            for (let i in ordenes2.rows) {
                const insert2 = yield PoolEnUso.query(`INSERT
                INTO medio_pago
                VALUES(nextval('medio_pago_codigo_med_seq'))`);
            }
            const medios_pago = yield PoolEnUso.query(`SELECT codigo_med
             FROM medio_pago`);
            const nombres = yield PoolEnUso.query(`SELECT DISTINCT(primernombre_nat||' '||primerapellido_nat) as nombre
            FROM persona_natural`);
            for (let i in medios_pago.rows) {
                if (parseInt(i) <= 53) { //insertamos las tarjetas
                    const insert2 = yield PoolEnUso.query(`
                INSERT
                INTO tarjeta
                VALUES($1,$2,$3,$4,$5,$6,$7)`, [medios_pago.rows[i].codigo_med, auth_controller_1.getRandomInt(10000000000, 30000000000), 'Banco Mercantil', nombres.rows[auth_controller_1.getRandomInt(1, 984)].nombre, auth_controller_1.getRandomInt(8000000, 30000000), vencimiento[auth_controller_1.getRandomInt(1, 3)], tiposTarjeta[auth_controller_1.getRandomInt(1, 2)]]);
                    console.log('tarjetas ' + i);
                }
                if (parseInt(i) > 53 && parseInt(i) <= 108) { //insertamos las cuentas
                    const insert2 = yield PoolEnUso.query(`
                INSERT
                INTO cuenta_bancaria
                VALUES($1,$2,$3,$4,null)`, [medios_pago.rows[i].codigo_med, auth_controller_1.getRandomInt(10000000000000000000, 500000000000000000000), bancos[auth_controller_1.getRandomInt(1, 4)], auth_controller_1.getRandomInt(8000000, 30000000)]);
                    console.log('cuentas ' + i);
                }
                if (parseInt(i) > 108 && parseInt(i) <= 162) { //insertamos las criptomonedas
                    const insert2 = yield PoolEnUso.query(`
                INSERT
                INTO criptomoneda
                VALUES ($1,$2,$3)`, [medios_pago.rows[i].codigo_med, wallet[auth_controller_1.getRandomInt(1, 4)], criptomonedas[auth_controller_1.getRandomInt(1, 3)]]);
                    console.log('criptomonedas ' + i);
                }
                if (parseInt(i) > 162 && parseInt(i) <= 215) { //insertamos los pagos con dinero electronico
                    const insert2 = yield PoolEnUso.query(`
                INSERT
                INTO dinero_electronico
                VALUES($1,$2,$3)`, [medios_pago.rows[i].codigo_med, nombres.rows[auth_controller_1.getRandomInt(1, 984)].nombre, servicios[auth_controller_1.getRandomInt(1, 4)]]);
                    console.log('dineroElectronico ' + i);
                }
                if (parseInt(i) > 215 && parseInt(i) <= 268) { //insertamos los pagos en efectivo
                    const insert2 = yield PoolEnUso.query(`
                INSERT
                INTO efectivo
                VALUES($1,$2);`, [medios_pago.rows[i].codigo_med, auth_controller_1.getRandomInt(1, 5)]);
                    console.log('efectivo ' + i);
                }
                if (parseInt(i) > 268 && parseInt(i) <= 322) { //insertamos los pagos con puntos
                    const insert2 = yield PoolEnUso.query(`
                INSERT
                INTO punto
                VALUES($1,(SELECT MAX(codigo_val)FROM valor_punto))`, [medios_pago.rows[i].codigo_med]);
                    console.log('puntos ' + i);
                }
            }
            const ordenes3 = yield PoolEnUso.query(`SELECT numero_ord, SUM (precio_prod_ord * cantidad_pro_ord ) as importe
            FROM producto_orden JOIN orden ON numero_ord = fk_orden_pro_ord
            GROUP BY 1
            ORDER BY 1`);
            for (let i in ordenes3.rows) {
                const insert3 = yield PoolEnUso.query(`
            INSERT
            INTO pago
            VALUES(default,$1,$2,$3)`, [ordenes3.rows[i].importe, medios_pago.rows[i].codigo_med, ordenes3.rows[i].numero_ord]);
                console.log('pagos ' + i);
            }
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
