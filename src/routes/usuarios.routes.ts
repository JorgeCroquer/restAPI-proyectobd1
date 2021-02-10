import Router from 'express'

import * as UsuarioCtrl from '../controllers/usuarios.controller'
import {authJWT} from '../middlewares'

const router = Router();

  
router.get('/Usuarios',UsuarioCtrl.getUsuarios); 
router.delete('/Usuarios/:id',UsuarioCtrl.deleteUsuario);
router.put('/Usuarios/:id',UsuarioCtrl.updateUsuario);
router.get('/Usuarios/roles',UsuarioCtrl.getRoles);

export default router;