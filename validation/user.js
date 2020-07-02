import { body } from 'express-validator';
import User from '../models/User';

const general = [
  body('password')
    .isLength({ max: 30 }).withMessage('Password is toot long')
    .isString(),
  body('email', 'Email is incorrect')
    .notEmpty()
    .isEmail()
];

export const signup = [
  ...general,
  body('name')
    .notEmpty()
    .isLength({ min: 1 }).withMessage('Name is too short')
    .isLength({ max: 40 }).withMessage('Name is too long')
    .isString()
    .trim(),
  body('email')
    .custom((value, { req }) => {
      return User.canCreate(value)
        .catch(error => {
          throw new Error(error);
        });
    })
];

export const login = [
  ...general
];
