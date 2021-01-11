import Router from 'express'
import {getEmpleados, getUsersById, createUser, updateUser, deleteUser, getTiendas,createTienda, deleteTienda, updateTienda, getLugares} from '../controllers/index.controller'
//import {getTiendas} from '../controllers/tiendas.controller'


import { Request, Response} from 'express'
const router = Router();

router.get('/empleados', getEmpleados);
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/tiendas/', getTiendas);
router.delete('/tiendas/:id',deleteTienda);
router.put('/tiendas/:id',updateTienda);
router.post('/tiendas/',createTienda);

router.get('/lugares/', getLugares);

// router.post('/empreport',multiPartMiddleware,(req: Request,res: Response) =>{
//     res.json({
//         "message": "File received"
//     })
// });


export default router;