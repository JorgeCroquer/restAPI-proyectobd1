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
exports.crearPago = exports.crearPunto = exports.crearEfectivo = exports.crearCuenta = exports.crearTarjeta = exports.crearDineroEle = exports.crearCripto = exports.crearMedio = void 0;
const database_1 = require("../database");
//Aqui se pone la BD que esta en uso
const PoolEnUso = database_1.pool;
//PRIMERO CREAMOS EL MEDIO AL QUE SE VAN A RELACIONAR LAS SUBENTIDADES
const crearMedio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield PoolEnUso.query(`
        INSERT
        INTO medio_pago
        VALUES(nextval('medio_pago_codigo_med_seq'))
        RETURNING codigo_med`);
        return res.status(201).json({
            message: "Medio de pago successfully created",
            body: {
                Proveedor: {}
            },
            respuesta: response.rows //Aquí reguresa el ID que acaba de insertar
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearMedio = crearMedio;
//LUEGO CREAMOS UNA DE ESTAS QUE SE VAN A RELACIONAR AL MEDIO DE PAGO RECIEN CREADO
const crearCripto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, wallet, tipo } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO criptomoneda
        VALUES ($1,$2,$3)`, [medio, wallet, tipo]);
        return res.status(201).json({
            message: "Medio de pago cripto created successfully",
            body: {
                Proveedor: {
                    medio, wallet, tipo
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearCripto = crearCripto;
const crearDineroEle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, usuario, servicio } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO dinero_electronico
        VALUES($1,$2,$3)`, [medio, usuario, servicio]);
        return res.status(201).json({
            message: "Relationship Status_orden  created successfully",
            body: {
                Proveedor: {
                    medio, usuario, servicio
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearDineroEle = crearDineroEle;
const crearTarjeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, numero, banco, tarjetahabiente, cedula, vencimiento, tipo } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO tarjeta
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [medio, numero, banco, tarjetahabiente, cedula, vencimiento, tipo]);
        return res.status(201).json({
            message: "Tarjeta medio created successfully",
            body: {
                Proveedor: {
                    medio, numero, banco, tarjetahabiente, cedula, vencimiento, tipo
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearTarjeta = crearTarjeta;
const crearCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, numero, banco, cedula } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO cuenta_bancaria
        VALUES($1,$2,$3,$4,null)`, [medio, numero, banco, cedula]);
        return res.status(201).json({
            message: "Medio Cuenta created successfully",
            body: {
                Proveedor: {
                    medio, numero, banco, cedula
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearCuenta = crearCuenta;
const crearEfectivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio, divisa } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO efectivo
        VALUES($1,$2);`, [medio, divisa]);
        return res.status(201).json({
            message: "Medio Efectivo created successfully",
            body: {
                Proveedor: {
                    medio, divisa
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearEfectivo = crearEfectivo;
const crearPunto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { medio } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO punto
        VALUES($1,(SELECT MAX(codigo_val)FROM valor_punto))`, [medio]);
        return res.status(201).json({
            message: "Medio Punto created successfully",
            body: {
                Proveedor: {
                    medio
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearPunto = crearPunto;
//POR ULTIMO RELACIONAMOS EL PAGO AL MEDIO DE PAGO CREADO PREVIAMENTE Y A LA ORDEN A LA QUE PAGA 
const crearPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { importe, medio, orden } = req.body;
        const response = yield PoolEnUso.query(`
        INSERT
        INTO pago
        VALUES(default,$1,$2,$3)`, [importe, medio, orden]);
        return res.status(201).json({
            message: "Pago created successfully",
            body: {
                Proveedor: {
                    importe, orden, medio
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
});
exports.crearPago = crearPago;
