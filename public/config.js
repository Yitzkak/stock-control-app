

var db = null;
var collection = null;

// Create connection to mongoDb
var mongoConnect = function (){
    const mongo = require('mongodb').MongoClient;
    const url = 'mongodb://127.0.0.1';
    mongo.connect(url)
    .then((conn) => {
        db = conn.db('stockcontrol');   
    })
    .catch((err) => {
        throw err;
    });
}

//Return the Connection Object
var getDbObj = function(){
    return db;
}
 module.exports.db = {
    mongoConnect: mongoConnect,
    getDbObj: getDbObj
}
