/** Creates a local copy of DB call "weather" & creates a table/collecion called city */

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("weather_db");
  console.log("'weather_db' created!");
  dbo.createCollection("city", function(err, res) {
    if (err) throw err;
    console.log("'city' Collection/Table created!");
    db.close();
  });
});