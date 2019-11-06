var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("weather_db");
  

  const fs = require('fs');

        fs.readFile('../../data/city.list.json', 'utf8', function (err,data) {
          data = JSON.parse(data);
          console.log( data.length );
          for(var i = 0; i < data.length; i++) {
            
            console.log(data[i].name);
            dbo.collection("city").insertOne(data[i], function(err, res) {
              if (err) throw err;
              console.log("${data[i].name} document inserted");
             
            });
            //client.set(data[i].name, data, redis.print);
          }
          db.close();
});

  


});