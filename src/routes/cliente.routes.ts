import Router from 'express'

import * as ClienteCtrl from '../controllers/cliente.controller'

const router = Router();


//clientes
router.get('/clientes/naturales', ClienteCtrl.getClientesNat);
router.get('/clientes/naturales/:id', ClienteCtrl.getClientesNatById);
router.put('/clientes/naturales/:id',ClienteCtrl.updateClientesNat);
router.post('/clientes/naturales/',ClienteCtrl.createClienteNat);
router.delete('/clientes/naturales/:id', ClienteCtrl.deleteClientesNat);

router.get('/clientes/juridicos/',ClienteCtrl.getClientesJur);
router.get('/clientes/juridicos/:id', ClienteCtrl.getClientesJurById);
router.post('/clientes/juridicos', ClienteCtrl.createClienteJur);
router.put('/clientes/juridicos/:id',ClienteCtrl.updateClientesJur);
router.delete('/clientes/juridicos/:id', ClienteCtrl.deleteClientesJur);

export default router;