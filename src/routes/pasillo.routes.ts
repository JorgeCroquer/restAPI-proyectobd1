import Router from 'express'

import * as PasilloCtrl from '../controllers/pasillo.controller'
import {authJWT} from '../middlewares'

const router = Router();

router.get('/pasillo/:id',[authJWT.verifyToken, authJWT.isEncargadoPasillos], PasilloCtrl.getAlertas)
router.put('/pasillo/repo',[authJWT.verifyToken, authJWT.isEncargadoPasillos], PasilloCtrl.reponer)

export default router;