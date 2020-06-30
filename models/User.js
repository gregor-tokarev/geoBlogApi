import db from '../core/db';
import { hash, compare } from 'bcrypt';

export default class {
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
}
