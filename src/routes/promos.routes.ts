import Router from 'express'

import * as PromosCtrl from '../controllers/promo.controller'
import {authJWT} from '../middlewares'

const router = Router();

router.get('/promos',[authJWT.verifyToken,authJWT.isGerentePromos], PromosCtrl.getPromosSinNotimart);
router.get('/promos/:id',[authJWT.verifyToken,authJWT.isGerentePromos], PromosCtrl.getProductosDePromo);
router.delete('/promos/:id',[authJWT.verifyToken,authJWT.isGerentePromos], PromosCtrl.deletePromo);
router.delete('/promos/descuentos/:id',[authJWT.verifyToken,authJWT.isGerentePromos], PromosCtrl.deleteProducto);
router.post('/promos',[authJWT.verifyToken,authJWT.isGerentePromos], PromosCtrl.createPromo);
router.put('/promos/:id',[authJWT.verifyToken,authJWT.isGerentePromos], PromosCtrl.updatePromo);

export default router;