import Router from 'express'

import * as ProductoCtrl from '../controllers/producto.controller'
import {authJWT} from '../middlewares'

const router = Router();

//Productos
//router.get('/Productos/faltantes/:id',[authJWT.verifyToken,authJWT.isGerenteGeneral], ProductoCtrl.getFaltantes);
router.get('/Productos/faltantes/:id', ProductoCtrl.getFaltantes); 
router.get('/Productos/Busqueda/:sucursal/:busqueda',ProductoCtrl.getBusqueda);

export default router;
