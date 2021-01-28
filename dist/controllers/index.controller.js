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
exports.getEmpleados = void 0;
const database_1 = require("../database");
const qrcode = require('qrcode');
const fs = require('fs');
//Funciones de respuesta
// export const getCarnet = async(req: Request,res: Response): Promise<Response> => {
//     try{
//         const cedula = req.params.id;
//         let urlQR = `http://localhost:3000/api/cliente/${cedula}`;
//         //Se genera el QR
//         generarQR(cedula, urlQR);
//         //consultamos por la persona con esa cedula
//         const response: QueryResult = await pool2.query(`SELECT persona_nat.cedula_nat,  fk_sucursal,  persona_nat.primernombre_nat,   persona_nat.segundonombre_nat,  persona_nat.primerapellido_nat,   persona_nat.segundoapellido_nat, numero_tel,  cliente_nat.qrpath
//         FROM cliente_nat, persona_nat, telefono
//         WHERE persona_nat.cedula_nat = $1 AND cliente_nat.cedula_nat = $1 AND telefono.fk_persona = $1`, [cedula]);
//         //Armamos el nombre
//         let nombre:string = response.rows[0].primernombre_nat;
//         if (response.rows[0].segundonombre_nat != null) nombre = `${nombre} ${response.rows[0].segundonombre_nat}`;
//         nombre = `${nombre} ${response.rows[0].primerapellido_nat}`;
//         if (response.rows[0].segundoapellido_nat != null) nombre = `${nombre} ${response.rows[0].segundoapellido_nat}`;
//         //Se envia el JSON
//         return res.status(200).json({
//             cliente: {
//                 'cedula': response.rows[0].cedula_nat.toString(),
//                 'nombre': nombre,
//                 'telefono': response.rows[0].numero_tel,
//                 'id': `${response.rows[0].fk_sucursal} - ${response.rows[0].cedula_nat.toString()}`,
//                 'qrpath': response.rows[0].qrpath
//             }
//         });
//     }
//     catch(e){
//         console.log(e);
//         return res.status(500).send('Internal Server Error');
//     }
// }
//empleados
const getEmpleados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query(`SELECT cedula_nat, salario_emp, rif_nat, primernombre_nat,segundonombre_nat,primerapellido_nat,segundoapellido_nat, nombre_suc, horaentrada_hor, horasalida_hor, nombre_ben
        FROM persona_natural,empleado,sucursal,horario_empleado, horario, beneficio_empleado, beneficio
        WHERE cedula_nat = fk_empleado AND fk_cedula_nat = horario_empleado.fk_empleado AND  codigo_hor = horario_empleado.fk_horario AND codigo_suc = empleado.fk_sucursal AND fk_empleado_ben_emp = cedula_nat AND codigo_ben = beneficio_empleado.fk_beneficio_ben_emp`);
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.getEmpleados = getEmpleados;
