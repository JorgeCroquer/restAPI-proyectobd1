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
exports.producto = void 0;
const database_1 = require("../database");
const PoolEnUso = database_1.pool;
class producto {
    constructor(codigo_pro, nombre_pro, pathimagen_pro, fk_proveedor_pro, fk_marca_pro) {
        this.codigo_pro = codigo_pro;
        this.nombre_pro = nombre_pro;
        this.pathimagen_pro = pathimagen_pro;
        this.fk_proveedor_pro = fk_proveedor_pro;
        this.fk_marca_pro = fk_marca_pro;
    }
    existeEnBD() {
        return __awaiter(this, void 0, void 0, function* () {
            const ValidacionPro = yield PoolEnUso.query(`SELECT codigo_pro FROM producto
                                                                      WHERE codigo_pro = $1`, [this.codigo_pro]);
            if (ValidacionPro.rows.length > 0) {
                return true;
            }
            else
                return false;
        });
    }
    static llenarPath() {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = yield PoolEnUso.query('SELECT codigo_pro FROM producto');
            for (let i in productos.rows) {
                const llenado = yield PoolEnUso.query(`UPDATE producto 
                                                                SET pathimagen_pro = $1 
                                                                WHERE codigo_pro = $2`, [`assets\\img\\productos\\${productos.rows[i].codigo_pro}.png`, productos.rows[i].codigo_pro]);
                console.log(i);
            }
            console.log('listo');
        });
    }
}
exports.producto = producto;
