/** Package include to read config/.env file */
require('dotenv').config();

/* Mongo client to connect to our DB */
var MongoClient = require('mongodb').MongoClient;

/** Table/Collection name */
var tableCollection = 'City';

/** Json file path from root folder */
const citiesJsonFileLocation = "./scripts/setup/city.list.json";

    const createSchema = () => {
        MongoClient.connect(process.env.MONGO_CONNECTION_STRING, function(err, db) {

            if (err) throw err.MongoError;
        
            /* Create Database */
            var dbo = db.db(process.env.MONGO_DB_NAME);
        
            console.log(process.env.MONGO_DB_NAME + ":  created!");
        
            /* Create Table i.e Collection */
            dbo.createCollection(tableCollection, function(err, res) {
        
                if (err) throw err;
        
                console.log(`${tableCollection}Collection/Table created!`);
                db.close();
            });
        });
    }

/** Creates the Database and Table */
createSchema();