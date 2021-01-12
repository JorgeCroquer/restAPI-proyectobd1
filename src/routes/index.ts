import Router from 'express'
<<<<<<< HEAD
import {getUsersById, createUser, updateUser, deleteUser, getTiendas,createTienda, deleteTienda, updateTienda, getLugares, getProveedores, createProveedor, deleteProveedor, getEmpleados, createPersonaJur, updatePersonaJur, deletePersonaJur, getClientesNat, updatePersonaNat,updateClientesNat } from '../controllers/index.controller'
=======
import {getCarnet, getEmpleados, getUsersById, createUser, updateUser, deleteUser, getTiendas, createTienda, deleteTienda, updateTienda, getLugares, getProveedores, createProveedor, deleteProveedor, createPersonaJur, updatePersonaJur} from '../controllers/index.controller'
>>>>>>> 5bc4f9768b35ca6293f6925a87d1a7862533a22a
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
router.put('/personajur/:id',updatePersonaJur);
router.put('/personajur/',updatePersonaJur);
router.delete('/personajur/:id', deletePersonaJur);
//personas naturales
router.put('/personanat/:id',updatePersonaNat);
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

//clientes
router.get('/clientes/naturales', getClientesNat);
router.put('/clientes/naturales/:id',updateClientesNat);

// router.post('/empreport',multiPartMiddleware,(req: Request,res: Response) =>{
//     res.json({
//         "message": "File received"
//     })
// });

router.get('/carnet/:id', getCarnet)
export default router;