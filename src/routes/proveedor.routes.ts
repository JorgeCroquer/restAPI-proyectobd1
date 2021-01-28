import Router from 'express'

import * as ProovedorCtrl from '../controllers/proveedor.controller'

import {authJWT} from '../middlewares'

const router = Router();

//proveedores
router.get('/proveedores/',[authJWT.verifyToken,authJWT.isGerenteReabastecimiento], ProovedorCtrl.getProveedores);
router.put('/proveedores/:id',[authJWT.verifyToken,authJWT.isGerenteReabastecimiento], ProovedorCtrl.updateProveedor);
router.post('/proveedores/',[authJWT.verifyToken,authJWT.isGerenteReabastecimiento],ProovedorCtrl.createProveedor);
router.delete('/proveedores/:id',[authJWT.verifyToken,authJWT.isGerenteReabastecimiento],ProovedorCtrl.deleteProveedor);

export default router;