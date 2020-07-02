import express from 'express';
import {
  signin,
  login,
  changeName,
  changePasswordAct,
  changePassword
} from '../controllers/user';
import * as validation from '../validation/user';
import authUser from '../middleware/authUser';

const router = express.Router();

router.post('/signup', validation.signup, signin);

router.post('/login', validation.login, login);

router.patch('/changeName/:id', authUser, changeName);

router.patch('/changePassword/:id', changePasswordAct);

router.patch('/:id/changePassword/:changeToken', changePassword);

export default router;
