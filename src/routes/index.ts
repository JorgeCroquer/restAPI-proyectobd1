import Router from 'express'
import {getCarnet, getEmpleados, getUsersById, createUser, updateUser, deleteUser, getTiendas, createTienda, deleteTienda, updateTienda, getLugares, getProveedores, updateProveedor, createProveedor, deleteProveedor} from '../controllers/index.controller'
//import {getTiendas} from '../controllers/tiendas.controller'


import { Request, Response} from 'express'
const router = Router();

router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/tiendas/', getTiendas);
router.delete('/tiendas/:id',deleteTienda);
router.put('/tiendas/:id',updateTienda);
router.post('/tiendas/',createTienda);

router.get('/lugares/', getLugares);

router.get('/proveedores/', getProveedores);
router.put('/proveedores/:id', updateProveedor);
router.post('/proveedores/',createProveedor);
router.delete('/proveedores/:id',deleteProveedor);

router.get('/empleados/', getEmpleados);
router.delete('/empleados/:id',deleteTienda);
router.put('/empleados/:id',updateTienda);
router.post('/empleados/',createTienda);


router.get('/carnet/:id', getCarnet)
export default router;