import Router from 'express'

import * as pagoCtrl from '../controllers/pago.controller'
import {authJWT} from '../middlewares'

const router = Router();

//Productos
//router.get('/Productos/faltantes/:id',[authJWT.verifyToken,authJWT.isGerenteGeneral], ProductoCtrl.getFaltantes);
router.post('/pago/medio',pagoCtrl.crearMedio);
router.post('/pago/cripto',pagoCtrl.crearCripto);
router.post('/pago/dineroele',pagoCtrl.crearDineroEle);
router.post('/pago/tarjeta',pagoCtrl.crearTarjeta);
router.post('/pago/cuenta',pagoCtrl.crearCuenta);
router.post('/pago/efectivo',pagoCtrl.crearEfectivo);
router.post('/pago/efectivo',pagoCtrl.crearPunto);
router.post('/pago',pagoCtrl.crearPago);     


export default router;