import { MongoClient } from 'mongodb';

const _db = {};

class DbConnect {
  initDb(name = 'main', uri = process.env.MONGO_URI) {
    if (uri.includes('?')) {
      uri = uri.split('?');
      uri = `${uri[0]}${name}?${uri[1]}`;
    }
    if (name in _db) throw new Error('Database had been already initialize');
  
    return new Promise((resolve, reject) => {
      const client = new MongoClient(uri, { useNewUrlParser: true });
      
      client.connect(mongoError => {
        mongoError && reject(mongoError);
        
        _db[name] = client.db();
        resolve(_db[name]);
      });
    });
  }
  
  getDb(name = 'main') {
    if (!_db[name]) throw new Error('Called Database isn\'t initialize');
    return _db[name];
  }
  
  allDbs() {
    if (!Object.keys(_db).length) throw new Error('No databases');
    return _db;
  }
};

const singleTone = new DbConnect();

export default singleTone;
