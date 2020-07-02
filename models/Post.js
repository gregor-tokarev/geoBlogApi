import db from '../core/db';
import { ObjectId } from 'mongodb';

class Post {
  constructor(title, body, location, owner, likes, comments) {
    this.title = title;
    this.body = body;
    this.location = location;
    this.owner = owner;
    this.likes = likes;
    this.comments = comments;
  }
  
  static async findById(id) {
    const res = await db.getDb().collection('posts').findOne({ _id: ObjectId(id) });
    const post = new Post(...res);
    post._id = ObjectId(res._id);
    post.save = async function () {
      await db.getDb().collection('users').replaceOne({ _id: post._id }, post);
    };
    
    return post;
  }
}

export default Post;
