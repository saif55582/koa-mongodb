const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "polygot_ninja";

const client = new MongoClient(MONGO_URL, {useNewUrlParser: true});

module.exports = (app) => {

    client.connect( (err) => {
        console.log("Database connection established");
        const db = client.db(DB_NAME);
        app.db = db;
        app.people  = db.collection("people");
    });
};