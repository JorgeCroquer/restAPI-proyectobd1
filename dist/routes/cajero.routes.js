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
const ProductosCtrl = __importStar(require("../controllers/cajero.controller"));
const router = express_1.default();
//productos
router.get('/productos', ProductosCtrl.getProductos);
router.get('/productos/monedas', ProductosCtrl.getTablaMonedas);
router.get('/productos/clientesNat', ProductosCtrl.getClientesNat);
router.get('/productos/clientesJur', ProductosCtrl.getClientesJur);
router.get('/productos/ValorPunto', ProductosCtrl.getValorPunto);
router.get('/productos/Descuentos', ProductosCtrl.getDescuentos);
router.post('/productos/Orden', ProductosCtrl.crearOrdenFisico);
router.post('/productos/Orden/Producto_Orden', ProductosCtrl.crearProductoOrden);
router.post('/productos/Orden/Orden_estatus', ProductosCtrl.crearOrdenEstatus);
router.post('/productos/pago/medio', ProductosCtrl.crearMedio);
router.post('/productos/pago/cripto', ProductosCtrl.crearCripto);
router.post('/productos/pago/dineroele', ProductosCtrl.crearDineroEle);
router.post('/productos/pago/tarjeta', ProductosCtrl.crearTarjeta);
router.post('/productos/pago/cuenta', ProductosCtrl.crearCuenta);
router.post('/productos/pago/efectivo', ProductosCtrl.crearEfectivo);
router.post('/productos/pago/punto', ProductosCtrl.crearPunto);
router.post('/productos/pago', ProductosCtrl.crearPago);
router.put('/productos/agregarPuntosNat', ProductosCtrl.AgregarPuntosNat);
router.put('/productos/agregarPuntosJur', ProductosCtrl.AgregarPuntosJur);
router.put('/productos/RestarPuntosNat', ProductosCtrl.QuitarPuntosNat);
router.put('/productos/RestarPuntosJur', ProductosCtrl.QuitarPuntosJur);
router.put('/productos/descontarInventario', ProductosCtrl.DescontarInventario);
router.get('/productos/:id', ProductosCtrl.getProductosid);
exports.default = router;
