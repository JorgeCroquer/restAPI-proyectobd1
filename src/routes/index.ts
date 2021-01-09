import Router from 'express'
import {getEmpleados, getUsersById, createUser, updateUser, deleteUser, getTiendas} from '../controllers/index.controller'



import { Request, Response} from 'express'
const router = Router();

router.get('/empleados', getEmpleados);
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/tiendas', getTiendas);


export default router;