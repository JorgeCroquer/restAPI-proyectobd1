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
exports.getPromosSinNotimart = void 0;
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
