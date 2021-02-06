import Router from 'express'

import * as NotimartCtrl from '../controllers/notimart.controller'
import {authJWT} from '../middlewares'

const router = Router();

router.get('/notimart/productos', [authJWT.verifyToken, authJWT.isGerentePromos], NotimartCtrl.getProductosNotimart);
router.put('/notimart/descuento/:id',[authJWT.verifyToken, authJWT.isGerentePromos], NotimartCtrl.updateDescuento);
router.get('/notimart/fecha',[authJWT.verifyToken, authJWT.isGerentePromos], NotimartCtrl.getProximaFecha);
router .delete('/notimart/productos/:id',[authJWT.verifyToken, authJWT.isGerentePromos], NotimartCtrl.deleteProducto);
router.post('/notimart/productos',[authJWT.verifyToken, authJWT.isGerentePromos], NotimartCtrl.agregarDescuentos);
router.post('/notimart',[authJWT.verifyToken, authJWT.isGerentePromos], NotimartCtrl.publicar)

export default router;