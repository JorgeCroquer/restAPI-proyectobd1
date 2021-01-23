"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../controllers/index.controller");
const router = express_1.default();
//users (Ejemplos)
router.get('/users/:id', index_controller_1.getUsersById);
router.post('/users', index_controller_1.createUser);
router.put('/users/:id', index_controller_1.updateUser);
router.delete('/users/:id', index_controller_1.deleteUser);
//lugares
router.get('/lugares/', index_controller_1.getLugares);
//empleados
router.get('/empleados/', index_controller_1.getEmpleados);
// router.delete('/empleados/:id',deleteTienda);
// router.put('/empleados/:id',updateTienda);
// router.post('/empleados/',createTienda);
//Personas 
// router.get('/personas/naturales', getPersonasNat);
// router.delete('/personas/naturales/:id',deletePersonaNat);
// router.put('/personas/naturales/:id',updatePersonaNat);
// router.post('/personas/naturales/:id',createPersonaNat);
router.post('/personajur', index_controller_1.createPersonaJur);
router.put('/personas/juridicas/:id', index_controller_1.updatePersonaJur);
router.put('/personas/juridicas', index_controller_1.updatePersonaJur);
router.delete('/personas/juridicas/:id', index_controller_1.deletePersonaJur);
//router.get('/carnet/:id', getCarnet)
exports.default = router;
