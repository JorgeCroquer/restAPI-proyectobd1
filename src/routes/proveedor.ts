import Router from 'express'

import * as ProovedorCtrl from '../controllers/proveedor.controller'

const router = Router();

//proveedores
router.get('/proveedores/', ProovedorCtrl.getProveedores);
router.put('/proveedores/:id', ProovedorCtrl.updateProveedor);
router.post('/proveedores/',ProovedorCtrl.createProveedor);
router.delete('/proveedores/:id',ProovedorCtrl.deleteProveedor);

export default router;