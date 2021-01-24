import Router from 'express'

import * as PersonaCtrl from '../controllers/persona.controller'

const router = Router();

//Personas naturales
router.get('/personas/naturales', PersonaCtrl.getPersonasNat);
router.get('/personas/naturales/:id', PersonaCtrl.getPersonaNatById);
router.post('/personas/naturales', PersonaCtrl.createPersonaNat);
router.put('/personas/naturales/:id', PersonaCtrl.updatePersonaNat);
router.delete('/personas/naturales/:id', PersonaCtrl.deletePersonaNat);

//Personas juridicas
router.get('/personas/juridicas', PersonaCtrl.getPersonaJur);
router.get('/personas/juridicas/:id', PersonaCtrl.getPersonaJurById);
router.post('/personas/juridicas', PersonaCtrl.createPersonaJur);
router.put('/personas/juridicas/:id', PersonaCtrl.updatePersonaJur);
router.delete('/personas/juridicas/:id', PersonaCtrl.deletePersonaJur);

export default router;