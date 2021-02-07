import Router from 'express'

import * as ProductosCtrl from '../controllers/cajero.controller'
import {authJWT} from '../middlewares'

const router = Router();

//productos
router.get('/productos',ProductosCtrl.getProductos);

router.get('/productos/:id', ProductosCtrl.getProductosid);

export default router;