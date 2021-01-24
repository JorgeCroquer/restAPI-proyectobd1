import Router from 'express'

import {multiPartMiddleware} from '../middlewares/connect-multiparty'
import * as ReportCtrl from '../controllers/reports.controllers'

const router = Router();

router.post('/empreport', multiPartMiddleware, ReportCtrl.compararHorarios);

router.get('/empleadosreport', ReportCtrl.enviarAReporte)
export default router;