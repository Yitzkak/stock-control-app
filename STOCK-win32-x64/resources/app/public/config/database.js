const mongo = require('mongodb').MongoClient;
mongo.connect('mongodb://127.0.0.1',(err,client)=>{
    if (err) {
        throw err;
    } 

    var db = client.db('stkc');

    console.log("db Connected");
    db.collection('hang').insert({name:"Yitzkak"},(err,res)=>{
        if (err) {
            throw err;
        }
        console.log("one doc inserted");
        client.close();
    });
});
