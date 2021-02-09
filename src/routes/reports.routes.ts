import Router from 'express'

import {multiPartMiddleware} from '../middlewares/connect-multiparty'
import * as ReportCtrl from '../controllers/reports.controllers'
import {authJWT} from '../middlewares'

const router = Router();

router.post('/empreport', [multiPartMiddleware, authJWT.verifyToken,authJWT.isGerenteTalentoHumano], ReportCtrl.compararHorarios);


export default router;