import Router from 'express'

import * as LugarCtrl from '../controllers/lugar.controller'
import {authJWT} from '../middlewares'

const router = Router();

//lugares
router.get('/lugares/', LugarCtrl.getLugares);
router.get('/lugares/:id', LugarCtrl.getLugarById);
router.get('/lugares/:id/sublugares', LugarCtrl.getSub_LugaresById);
router.get('/lugares/tipo/:id', LugarCtrl.getLugarByTipo)
router.post('/lugares/', [authJWT.verifyToken,authJWT.isAdmin], LugarCtrl.createLugar);
router.put('/lugares/:id',  [authJWT.verifyToken,authJWT.isAdmin], LugarCtrl.updateLugar);
router.delete('/lugares/:id', [authJWT.verifyToken,authJWT.isAdmin] ,LugarCtrl.deleteLugar);

export default router;