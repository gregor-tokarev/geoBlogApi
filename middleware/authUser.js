import { verify } from 'jsonwebtoken';
import User from '../models/User';

export default async function (req, res, next) {
  try {
    const token = req.get('Authorization').split(' ').splice(1, 1)[0];
    const id = req.params.id;
    const decodedToken = verify(token, process.env.JWT_SECRET);
    
    const targetUser = await User.findById(id);
    if (!targetUser) throw new Error('User not found.');
    if (targetUser.email !== decodedToken.email) throw new Error('No rules to this operation');
    next();
  } catch (err) {
    res.status(403).json({
      error: err
    });
  }
}
