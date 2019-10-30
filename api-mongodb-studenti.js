const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require('config');
const cfg = config.get('MongoDB');
const dbColl = "studenti";
let dbo;

mongoClient.connect(cfg.url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    dbo = db.db(cfg.database);
    dbo.createCollection(dbColl, function(err, res) {
        if (err) throw err;
        console.log(`Collection ${dbColl} created!`);
    });
});

const list = function (req, res, resObj) {
    console.log("###");
    dbo.collection(dbColl).find().toArray(function (err, result) {
        console.log("### 1");
        if (err) throw err;
        // console.log(result);
        console.log("### "+result);
        resObj.studenti = result;
        res.end(JSON.stringify(resObj));
    });
};

exports.apiStudenti = function (req, res, resObj) {
    console.log(req.pathname);
    if (req.pathname.endsWith("/list")) {
        list(req, res, resObj);
    } else if (req.pathname.endsWith("/add")) {
        dbo.collection(dbColl).insertOne(req.parameters, function(err, result) {
            if (err) throw err;
            // console.log(result);
            list(req, res, resObj);
        });
    } else if (req.pathname.endsWith("/update")) {
        let select = { _id : ObjectID(req.parameters._id) };
        delete(req.parameters._id); //nelze modifikovat _id!
        dbo.collection(dbColl).updateOne(select, { $set: req.parameters  }, function(err, result) {
            if (err) throw err;
            // console.log(result);
            list(req, res, resObj);
        });
    } else if (req.pathname.endsWith("/delete")) {
        let select = { _id : ObjectID(req.parameters._id) };
        dbo.collection(dbColl).deleteOne(select, function(err, result) {
            if (err) throw err;
            // console.log(result);
            list(req, res, resObj);
        });
    }

};
