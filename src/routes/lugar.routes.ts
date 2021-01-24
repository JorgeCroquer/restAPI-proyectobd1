import Router from 'express'

import * as LugarCtrl from '../controllers/lugar.controller'

const router = Router();

//lugares
router.get('/lugares/', LugarCtrl.getLugares);
router.get('/lugares/:id', LugarCtrl.getLugarById);
router.get('/lugares/:id/sublugares', LugarCtrl.getSub_LugaresById);
router.post('/lugares/', LugarCtrl.createLugar);
router.put('/lugares/:id', LugarCtrl.updateLugar);
router.delete('/lugares/:id', LugarCtrl.deleteLugar);

export default router;