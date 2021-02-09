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
exports.persona_juridica = void 0;
const database_1 = require("../database");
const auth_controller_1 = require("../controllers/auth.controller");
const PoolEnUso = database_1.pool;
class persona_juridica {
    constructor(rif, razonsocial, denomcomercial, web, capital, fk_direcfisica, fk_direcfiscal) {
        this.rif = rif;
        this.razonsocial = razonsocial;
        this.denomcomercial = denomcomercial;
        this.web = web;
        this.capital = capital;
        this.fk_direcfisica = fk_direcfisica;
        this.fk_direcfiscal = fk_direcfiscal;
    }
    existeEnBD() {
        return __awaiter(this, void 0, void 0, function* () {
            const ValidacionNat = yield PoolEnUso.query(`SELECT rif_jur FROM persona_juridica
                                                                      WHERE rif_jur = $1`, [this.rif]);
            if (ValidacionNat.rows.length > 0) {
                return true;
            }
            else
                return false;
        });
    }
    static llenarUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            const juridicos = yield PoolEnUso.query(`SELECT SUBSTR(pj.razonsocial_jur,1, POSITION(' ' IN pj.razonsocial_jur))  AS user,
                    REPLACE(CONCAT(SUBSTR(pj.razonsocial_jur,1, POSITION(' ' IN pj.razonsocial_jur)) ,'@ucabmart.com.ve'), ' ', '') AS email,
                    rif_jur as rif
                    FROM persona_juridica pj`);
            for (let i in juridicos.rows) {
                const password = yield auth_controller_1.encryptPassword('9876');
                const usuarios = yield PoolEnUso.query(`INSERT INTO usuarios (nombre_usu,password_usu,direccion_ema,fk_roles,fk_persona_jur)
                 VALUES ($1,$2,$3,1,$4)`, [juridicos.rows[i].user, password, juridicos.rows[i].email, juridicos.rows[i].rif]);
                console.log(i);
            }
            console.log('listos');
        });
    }
}
exports.persona_juridica = persona_juridica;
