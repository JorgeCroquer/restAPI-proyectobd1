import Router from 'express'

import * as ordenCtrl from '../controllers/orden.controller'
import {authJWT} from '../middlewares'

const router = Router();

//Productos
//router.get('/Productos/faltantes/:id',[authJWT.verifyToken,authJWT.isGerenteGeneral], ProductoCtrl.getFaltantes);
router.post('/Orden',ordenCtrl.crearOrden);
router.post('/Orden/Producto_Orden',ordenCtrl.crearProductoOrden);
router.post('/Orden/Orden_estatus',ordenCtrl.crearOrdenEstatus);  

export default router;