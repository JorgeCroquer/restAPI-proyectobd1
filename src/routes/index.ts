import Router from 'express'
import {/*getCarnet,*/ getUsersById, createUser, updateUser, deleteUser,  
    getLugares,  getEmpleados, createPersonaJur, updatePersonaJur, 
    deletePersonaJur} from '../controllers/index.controller'



import { Request, Response} from 'express'
const router = Router();

//users (Ejemplos)
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);




//lugares
router.get('/lugares/', getLugares);



//empleados
router.get('/empleados/', getEmpleados);
// router.delete('/empleados/:id',deleteTienda);
// router.put('/empleados/:id',updateTienda);
// router.post('/empleados/',createTienda);


//Personas 
// router.get('/personas/naturales', getPersonasNat);
// router.delete('/personas/naturales/:id',deletePersonaNat);
// router.put('/personas/naturales/:id',updatePersonaNat);
// router.post('/personas/naturales/:id',createPersonaNat);
router.post('/personajur', createPersonaJur);
router.put('/personas/juridicas/:id',updatePersonaJur);
router.put('/personas/juridicas',updatePersonaJur);
router.delete('/personas/juridicas/:id', deletePersonaJur);










//router.get('/carnet/:id', getCarnet)
export default router;