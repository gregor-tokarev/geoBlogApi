import User from '../models/User';
import { validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';

export async function signin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  
  const { name, email, password } = req.body;
  const ip = req.ip;
  
  const token = sign({ email }, process.env.JWT_SECRET);
  
  const user = new User(name, email, password, ip);
  const insertedUser = await user.save();
  
  res.status(202).json({
    user: insertedUser,
    token,
    message: 'Success'
  });
}

export async function login(req, res) {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({
  //     errors: errors.array()
  //   });
  // }
  const { email, password } = req.body;
  
  const ok = await User.login(email, password);
  if (ok.ok) {
    const token = sign({ email }, process.env.JWT_SECRET);
    
    res.status(200).json({
      message: 'Success',
      token
    });
  } else {
    res.status(403).json({
      message: 'Not authorize'
    });
  }
}
