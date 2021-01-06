import Router from 'express'
import {getEmpleados, getUsersById, createUser, updateUser, deleteUser} from '../controllers/index.controller'
const router = Router();

router.get('/empleados', getEmpleados);
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);




export default router;