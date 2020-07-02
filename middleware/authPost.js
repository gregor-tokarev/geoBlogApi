import { verify } from 'jsonwebtoken';
import Post from '../models/Post';

export default async function (req, res, next) {
  try {
    const token = req.get('Authorization').split(' ').splice(1, 1)[0];
    const id = req.params.id;
    const { email } = verify(token, process.env.JWT_SECRET);
    
    const targetPost = await Post.findById(id);
    if (!targetPost) throw new Error('User not found.');
    if (targetPost.email !== email) throw new Error('No rules to this operation');
    next();
  } catch (err) {
    res.status(403).json({
      error: err
    });
  }
}
