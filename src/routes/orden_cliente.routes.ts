import Router from 'express'

import * as ordenClienteCtrl from '../controllers/orden_cliente.controller'
import {authJWT} from '../middlewares'

const router = Router();

//Productos
//router.get('/Productos/faltantes/:id',[authJWT.verifyToken,authJWT.isGerenteGeneral], ProductoCtrl.getFaltantes);
router.post('/OrdenC',ordenClienteCtrl.crearOrden);
router.post('/OrdenC/Producto_Orden',ordenClienteCtrl.crearProductoOrden);
router.post('/OrdenC/Orden_estatus',ordenClienteCtrl.crearOrdenEstatus);  
router.get('/OrdenC/valorpunto',ordenClienteCtrl.getValorPunto)

export default router;
