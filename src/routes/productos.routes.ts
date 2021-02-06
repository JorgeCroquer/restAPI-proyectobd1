import Router from 'express'

import * as ProductoCtrl from '../controllers/producto.controller'
import {authJWT} from '../middlewares'

const router = Router();

//Productos
//router.get('/Productos/faltantes/:id',[authJWT.verifyToken,authJWT.isGerenteGeneral], ProductoCtrl.getFaltantes);
router.get('/Productos/faltantes/:id', ProductoCtrl.getFaltantes); 
<<<<<<< HEAD
router.get('/Productos/Busqueda/:sucursal/:busqueda',ProductoCtrl.getBusqueda);
=======
router.get('/Productos/basic',ProductoCtrl.getProductosBasic) 
>>>>>>> 8c526314a34542a0326d8cb18093ae24d2aa4d25

export default router;
