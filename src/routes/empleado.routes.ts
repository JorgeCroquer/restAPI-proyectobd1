import Router from 'express'
import * as EmpleadoCtrl from '../controllers/empleado.controller'

const router = Router();

router.get('/empleados', EmpleadoCtrl.getEmpleados)

export default router;