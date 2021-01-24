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
const PoolEnUso = database_1.LocalPool;
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
}
exports.persona_natural = persona_natural;
