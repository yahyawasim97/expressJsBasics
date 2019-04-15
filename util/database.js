const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const MongoConnect=(callback)=>{
    mongoose.connect('mongodb+srv://admin@cluster0-lcmm1.mongodb.net/shop?retryWrites=true', {
    auth: {
      user: 'admin',
      password: 'Humidity123'
    }
    })
    .then(client =>{
        console.log('Connected');
        _db = client.db();
        callback();
    })
    .catch(err=>{
        console.log(err)
        throw err;
    });
};

const getDb=()=>{
    if(_db){
        return _db;
    }
    throw 'No database Found'
}

exports.mongoConnect = MongoConnect;
exports.getDb = getDb;