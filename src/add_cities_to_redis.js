var redis = require('redis');
var client = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected');
    client.get('Hurzuf', function (error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('GET result ->' + result);
        const fs = require('fs');
        fs.readFile('../data/city.list.json', 'utf8', function (err,data) {

          data = JSON.parse(data);
          console.log( data.length );
          for(var i = 0; i < data.length; i++) {
          //for(var i = 0; i < 20; i++) {
            console.log(data[i].name);
            //client.set(data[i].name, data, redis.print);
          }
          
        });
    });
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});
