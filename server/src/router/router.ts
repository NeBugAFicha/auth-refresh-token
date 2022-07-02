import {Router} from 'express';
import userController from '../controller/userController';
import {body} from 'express-validator';
import authMiddleware from '../middleware/authMiddleware';

const router = new Router();

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:2,max:32}),
    userController.registration);
router.post('/login',userController.login);
router.post('/logout',userController.logout);
router.get('/activate/:link',userController.activate);
router.get('/refresh',userController.refresh);
router.get('/users',authMiddleware,userController.getUsers);

export default router;