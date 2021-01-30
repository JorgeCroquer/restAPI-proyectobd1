import Router from 'express';
const router = Router();

import * as AuthCtrl from '../controllers/auth.controller'
import {authJWT} from '../middlewares/index'


router.post('/signup', AuthCtrl.signUp)

router.post('/login', AuthCtrl.logIn)


export default router;
 