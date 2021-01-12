import Router from 'express'
import {getUsersById, createUser, updateUser, deleteUser, getTiendas,createTienda, deleteTienda, updateTienda, getLugares, getProveedores, createProveedor, deleteProveedor, getEmpleados, createPersonaJur, updatePersonaJur} from '../controllers/index.controller'
//import {getTiendas} from '../controllers/tiendas.controller'


import { Request, Response} from 'express'
const router = Router();

//users
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
//personas juridicas
router.post('/personajur/', createPersonaJur);
router.put('/personajur/',updatePersonaJur);
//tiendas
router.get('/tiendas/', getTiendas);
router.delete('/tiendas/:id',deleteTienda);
router.put('/tiendas/:id',updateTienda);
router.post('/tiendas/',createTienda);
//lugares
router.get('/lugares/', getLugares);
//proveedores
router.get('/proveedores/', getProveedores);
router.put('/proveedores/:id', updatePersonaJur);
router.post('/proveedores/',createProveedor);
router.delete('/proveedores/:id',deleteProveedor);
//empleados
router.get('/empleados/', getEmpleados);
router.delete('/empleados/:id',deleteTienda);
router.put('/empleados/:id',updateTienda);
router.post('/empleados/',createTienda);

// router.post('/empreport',multiPartMiddleware,(req: Request,res: Response) =>{
//     res.json({
//         "message": "File received"
//     })
// });


export default router;