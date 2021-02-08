"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pagoCtrl = __importStar(require("../controllers/pago.controller"));
const router = express_1.default();
//Productos
//router.get('/Productos/faltantes/:id',[authJWT.verifyToken,authJWT.isGerenteGeneral], ProductoCtrl.getFaltantes);
router.post('/pago/medio', pagoCtrl.crearMedio);
router.post('/pago/cripto', pagoCtrl.crearCripto);
router.post('/pago/dineroele', pagoCtrl.crearDineroEle);
router.post('/pago/tarjeta', pagoCtrl.crearTarjeta);
router.post('/pago/cuenta', pagoCtrl.crearCuenta);
router.post('/pago/efectivo', pagoCtrl.crearEfectivo);
router.post('/pago/efectivo', pagoCtrl.crearPunto);
router.post('/pago', pagoCtrl.crearPago);
exports.default = router;
