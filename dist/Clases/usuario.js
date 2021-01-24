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
exports.usuario = void 0;
const database_1 = require("../database");
const PoolEnUso = database_1.LocalPool;
class usuario {
    constructor(username, password, email, roles) {
        this.fk_persona_nat = 0;
        this.fk_persona_jur = '';
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
    }
    existeEnBD() {
        return __awaiter(this, void 0, void 0, function* () {
            const ValidacionUsername = yield PoolEnUso.query(`SELECT nombre_usu FROM usuarios
                                                                      WHERE nombre_usu = $1`, [this.username]);
            const ValidacionEmail = yield PoolEnUso.query(`SELECT direccion_ema FROM usuarios
                                                                      WHERE direccion_ema = $1`, [this.email]);
            if (ValidacionUsername.rows.length > 0 || ValidacionEmail.rows.length > 0) {
                return true;
            }
            else
                return false;
        });
    }
}
exports.usuario = usuario;
