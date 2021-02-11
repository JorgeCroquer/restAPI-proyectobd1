import Router from 'express'

import * as ProductosCtrl from '../controllers/cajero.controller'
import {authJWT} from '../middlewares'

const router = Router();

//productos
router.get('/productos',ProductosCtrl.getProductos);
router.get('/productos/monedas', ProductosCtrl.getTablaMonedas); 
router.get('/productos/clientesNat',ProductosCtrl.getClientesNat);
router.get('/productos/clientesJur', ProductosCtrl.getClientesJur); 
router.get('/productos/ValorPunto', ProductosCtrl.getValorPunto); 
router.get('/productos/Descuentos', ProductosCtrl.getDescuentos);

router.post('/productos/Orden',ProductosCtrl.crearOrdenFisico);
router.post('/productos/Orden/Producto_Orden',ProductosCtrl.crearProductoOrden);
router.post('/productos/Orden/Orden_estatus',ProductosCtrl.crearOrdenEstatus);  
router.post('/productos/pago/medio',ProductosCtrl.crearMedio);
router.post('/productos/pago/cripto',ProductosCtrl.crearCripto);
router.post('/productos/pago/dineroele',ProductosCtrl.crearDineroEle);
router.post('/productos/pago/tarjeta',ProductosCtrl.crearTarjeta);
router.post('/productos/pago/cuenta',ProductosCtrl.crearCuenta);
router.post('/productos/pago/efectivo',ProductosCtrl.crearEfectivo);
router.post('/productos/pago/punto',ProductosCtrl.crearPunto);
router.post('/productos/pago',ProductosCtrl.crearPago); 

router.put('/productos/agregarPuntosNat',ProductosCtrl.AgregarPuntosNat);
router.put('/productos/agregarPuntosJur',ProductosCtrl.AgregarPuntosJur);
router.put('/productos/RestarPuntosNat',ProductosCtrl.QuitarPuntosNat);
router.put('/productos/RestarPuntosJur',ProductosCtrl.QuitarPuntosJur); 

router.put('/productos/descontarInventario',ProductosCtrl.DescontarInventario); 

router.get('/productos/:id', ProductosCtrl.getProductosid);


export default router;
