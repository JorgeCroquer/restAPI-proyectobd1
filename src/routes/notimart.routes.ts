import Router from 'express'

import * as NotimartCtrl from '../controllers/notimart.controller'
import {authJWT} from '../middlewares'

const router = Router();

router.get('/notimart/productos', [authJWT.verifyToken, authJWT.isGerentePromos], NotimartCtrl.getProductosNotimart);


export default router;