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
exports.persona_natural = void 0;
const database_1 = require("../database");
const auth_controller_1 = require("../controllers/auth.controller");
const PoolEnUso = database_1.pool;
class persona_natural {
    constructor(cedula, rif, primernombre, segundonombre, primerapellido, segundoapellido, fk_personacontacto, fk_residencia) {
        this.cedula = cedula;
        this.rif = rif;
        this.primernombre = primernombre;
        this.segundonombre = segundonombre;
        this.primerapellido = primerapellido;
        this.segundoapellido = segundoapellido;
        this.fk_personacontacto = fk_personacontacto;
        this.fk_residencia = fk_residencia;
    }
    existeEnBD() {
        return __awaiter(this, void 0, void 0, function* () {
            const ValidacionNat = yield PoolEnUso.query(`SELECT cedula_nat FROM persona_natural
                                                                      WHERE cedula_nat = $1`, [this.cedula]);
            if (ValidacionNat.rows.length > 0) {
                return true;
            }
            else
                return false;
        });
    }
    static llenarUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            const empleados = yield PoolEnUso.query(`SELECT CONCAT(primernombre_nat, '_',primerapellido_nat) AS user,
                    CONCAT(primernombre_nat, '_', primerapellido_nat, '@ucabmart.com.ve') AS email,
                    cedula_nat AS cedula
             FROM persona_natural JOIN empleado e on persona_natural.cedula_nat = e.fk_cedula_nat
             WHERE primernombre_nat NOT LIKE '%prueba%'`);
            for (let i in empleados.rows) {
                const password = yield auth_controller_1.encryptPassword('1234');
                const usuarios = yield PoolEnUso.query(`INSERT INTO usuarios (nombre_usu,password_usu,direccion_ema,fk_roles,fk_persona_nat)
                 VALUES ($1,$2,$3,12,$4)`, [empleados.rows[i].user, password, empleados.rows[i].email, empleados.rows[i].cedula]);
                console.log(i);
            }
            console.log('listos');
        });
    }
}
exports.persona_natural = persona_natural;
