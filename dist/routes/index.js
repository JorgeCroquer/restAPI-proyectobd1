"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default();
//users
router.get('/users/:id', index_controller_1.getUsersById);
router.post('/users', index_controller_1.createUser);
router.put('/users/:id', index_controller_1.updateUser);
router.delete('/users/:id', index_controller_1.deleteUser);
//personas juridicas
router.post('/personajur/', index_controller_1.createPersonaJur);
router.put('/personajur/', index_controller_1.updatePersonaJur);
//tiendas
router.get('/tiendas/', index_controller_1.getTiendas);
router.delete('/tiendas/:id', index_controller_1.deleteTienda);
router.put('/tiendas/:id', index_controller_1.updateTienda);
router.post('/tiendas/', index_controller_1.createTienda);
//lugares
router.get('/lugares/', index_controller_1.getLugares);
//proveedores
router.get('/proveedores/', index_controller_1.getProveedores);
router.put('/proveedores/:id', index_controller_1.updatePersonaJur);
router.post('/proveedores/', index_controller_1.createProveedor);
router.delete('/proveedores/:id', index_controller_1.deleteProveedor);
//empleados
router.get('/empleados/', index_controller_1.getEmpleados);
router.delete('/empleados/:id', index_controller_1.deleteTienda);
router.put('/empleados/:id', index_controller_1.updateTienda);
router.post('/empleados/', index_controller_1.createTienda);
// router.post('/empreport',multiPartMiddleware,(req: Request,res: Response) =>{
//     res.json({
//         "message": "File received"
//     })
// });
exports.default = router;
