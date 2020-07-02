import User from '../models/User';
import { validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import uniqid from 'uniqid';

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  
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

export async function changeName(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  
  const { name } = req.body;
  const id = req.params.id;
  
  const user = await User.findById(id);
  user.name = name;
  await user.save();
  
  res.status(202).json({
    message: 'Success'
  });
}

export async function changePasswordAct(req, res) {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({
  //     errors: errors.array()
  //   });
  // }
  
  const transfer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zipper123915.edu@gmail.com',
      pass: 'zipper.TV4'
    }
  });
  
  const changeToken = uniqid('id-');
  const userId = req.params.id;
  
  const user = await User.findById(userId);
  user.changeToken = changeToken;
  await user.save();
  
  transfer.sendMail({
    from: 'send@server',
    to: user.email,
    subject: 'change password',
    html: `<a href="${process.env.BASE_URL}:${process.env.PORT}/user/${userId}/changePassword/${changeToken}">
      изменить пароль
</a>`
  });
  
  res.status(202).json({
    message: 'Success'
  });
}

export async function changePassword(req, res) {
  const { id: userId, changeToken } = req.params;
  const newPassword = req.body.newPassword;
  
  await User.changePassword(userId, newPassword, changeToken);
  
  res.status(202).json({
    message: 'Success',
    newPassword
  });
}
