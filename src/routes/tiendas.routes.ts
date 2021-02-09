import Router from 'express'

import * as TiendaCtrl from '../controllers/tienda.controller'
import {authJWT} from '../middlewares'

const router = Router();

//tiendas  
router.get('/tiendas',TiendaCtrl.getTiendas); 
router.delete('/tiendas/:id',TiendaCtrl.deleteTienda);
router.put('/tiendas/:id',TiendaCtrl.updateTienda);
router.post('/tiendas',TiendaCtrl.createTienda);

export default router;
 