import Router from 'express'
import * as EmpleadoCtrl from '../controllers/empleado.controller'
import {authJWT} from '../middlewares/index'

const router = Router();

router.get('/empleados',[authJWT.verifyToken, authJWT.isGerenteTalentoHumano] ,EmpleadoCtrl.getEmpleados);
router.get('/empleados/sucursal/:id',[authJWT.verifyToken, authJWT.isGerenteTalentoHumano], EmpleadoCtrl.getEmpleadosBySucursal);
router.delete('/empleados/:id',[authJWT.verifyToken, authJWT.isGerenteTalentoHumano], EmpleadoCtrl.despedir);
router.get('/empleados/:id/beneficios',[authJWT.verifyToken, authJWT.isGerenteTalentoHumano] ,EmpleadoCtrl.getBeneficios);
router.put('/empleados/:id',[authJWT.verifyToken, authJWT.isGerenteTalentoHumano] ,EmpleadoCtrl.updateEmpleado);
router.post('/empleados/sucursal/:id',[authJWT.verifyToken, authJWT.isGerenteTalentoHumano] ,EmpleadoCtrl.createEmpleado);
router.post('/empleados/asistencias',[authJWT.verifyToken, authJWT.isGerenteTalentoHumano] ,EmpleadoCtrl.asistencias);

export default router;