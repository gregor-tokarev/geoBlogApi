import db from '../core/db';
import { hash, compare } from 'bcrypt';
import { ObjectId } from 'mongodb';

class User {
  constructor(name, email, password, ip) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.ip = ip;
  }
  
  static async canCreate(email) {
    const user = await db.getDb().collection('users').findOne({ email });
    if (user) {
      throw new Error('User already exists.');
    } else {
      return true;
    }
  }
  
  async save() {
    const hashPassword = await hash(this.password, 5);
    const collection = db.getDb().collection('users');
    
    const user = await collection.insertOne({
      name: this.name,
      email: this.email,
      ip: this.ip,
      password: hashPassword
    });
    
    return user.ops[0];
  }
  
  static async changePassword(id, newPassword, changeToken) {
    const collection = db.getDb().collection('users');
    const user = await collection.findOne({ _id: ObjectId(id) });
  
    if (user.changeToken === changeToken) {
      const password = await hash(newPassword, 5);
      await collection.updateOne({ _id: ObjectId(id) }, {
        $set: { password },
        $unset: { changeToken: '' }
      });
      return user;
    } else {
      throw new Error('Can\'t update password');
    }
  }
  
  static async findById(id) {
    const res = await db.getDb().collection('users').findOne({ _id: ObjectId(id) });
    const user = new User(res.name, res.email, res.password, res.ip);
    user._id = ObjectId(res._id);
    user.save = async function () {
      await db.getDb().collection('users').replaceOne({ _id: user._id }, user);
    };
    
    Object.defineProperty(user, '_doc', {
      get() {
        return {
          name: this.name,
          password: this.password,
          email: this.email,
          ip: this.ip
        };
      }
    });
    return user;
  }
  
  static async findOne(obj) {
    const res = await db.getDb().collection('users').findOne(obj);
    return res;
  }
  
  static async login(email, password) {
    const user = await db.getDb().collection('users').findOne({ email });
    
    if (!user) {
      return {
        message: 'No email exists',
        ok: false
      };
    }
    
    const passwordUser = user.password;
    const rightPassword = await compare(password, passwordUser);
    
    return {
      ok: rightPassword
    };
  }
  
  static async changeName(id, name) {
    const what = await db.getDb().collection('users').updateOne({ _id: ObjectId(id) }, { $set: { name } });
    return what;
  }
}

export default User;
