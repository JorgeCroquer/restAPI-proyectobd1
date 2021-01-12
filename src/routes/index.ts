import Router from 'express'
import {getCarnet, getUsersById, createUser, updateUser, deleteUser, getTiendas,createTienda, deleteTienda, updateTienda, 
    getLugares, getProveedores, createProveedor, deleteProveedor, getEmpleados, createPersonaJur, updatePersonaJur, 
    deletePersonaJur, getClientesNat,updateClientesNat, getPersonasNat, deletePersonaNat,  updatePersonaNat, createPersonaNat,
deleteClientesNat, createClienteNat, getClientesJur, updateClientesJur, deleteClientesJur, createClienteJur } from '../controllers/index.controller'



import { Request, Response} from 'express'
const router = Router();

//users (Ejemplos)
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);



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


//Personas 
router.get('/personas/naturales', getPersonasNat);
router.delete('/personas/naturales/:id',deletePersonaNat);
router.put('/personas/naturales/:id',updatePersonaNat);
router.post('/personas/naturales/:id',createPersonaNat);
router.post('/personas/juridicas', createPersonaJur);
router.put('/personas/juridicas/:id',updatePersonaJur);
router.put('/personas/juridicas',updatePersonaJur);
router.delete('/personas/juridicas/:id', deletePersonaJur);


//clientes
router.get('/clientes/naturales', getClientesNat);
router.put('/clientes/naturales/:id',updateClientesNat);
router.delete('/clientes/naturales/:id', deleteClientesNat);
router.post('/clientes/naturales/:id',createClienteNat);
router.post('/clientes/juridicos', createClienteJur);
router.put('/clientes/juridicos/:id',updateClientesJur);
router.put('/clientes/juridicos',updateClientesJur);
router.delete('/clientes/juridicos/:id', deleteClientesJur);



// router.post('/empreport',multiPartMiddleware,(req: Request,res: Response) =>{
//     res.json({
//         "message": "File received"
//     })
// });



router.get('/carnet/:id', getCarnet)
export default router;