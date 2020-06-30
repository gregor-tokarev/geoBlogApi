import express from 'express';
import { signin, login } from '../controllers/user';
import { signup } from '../validation/user';

const router = express.Router();

router.post('/signin', signup, signin);

router.post('/login', login);

export default router;
