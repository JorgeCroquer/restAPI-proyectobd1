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
    static llenarStatusOrden() {
        return __awaiter(this, void 0, void 0, function* () {
            const ordenes = yield PoolEnUso.query(`SELECT codigo_ord
             FROM orden`);
            for (let i in ordenes.rows) {
                const insert = yield PoolEnUso.query(`INSERT INTO status_orden
                 VALUES ($1,$2,$3)`, [new Date().toLocaleDateString('en-US'), ordenes.rows[i].codigo_ord, 5]);
                console.log(i);
            }
            console.log('listo');
        });
    }
}
exports.producto = producto;
