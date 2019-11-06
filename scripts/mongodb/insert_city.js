var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("weather_db");
  var city_obj = {
    "id": 707860,
    "name": "Hurzuf",
    "country": "UA",
    "coord": {
      "lon": 34.283333,
      "lat": 44.549999
    }
  };
  dbo.collection("city").insertOne(city_obj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});