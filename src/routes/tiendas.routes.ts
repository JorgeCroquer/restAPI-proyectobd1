import Router from 'express'

import * as TiendaCtrl from '../controllers/tienda.controller'
import {verifyToken} from '../middlewares'

const router = Router();

//tiendas
router.get('/tiendas',verifyToken, TiendaCtrl.getTiendas); //@ts - ignore
router.delete('/tiendas/:id',TiendaCtrl.deleteTienda);
router.put('/tiendas/:id',TiendaCtrl.updateTienda);
router.post('/tiendas',TiendaCtrl.createTienda);

export default router;
