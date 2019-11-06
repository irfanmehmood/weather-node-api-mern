var finalhandler = require('finalhandler');
const axios = require('axios');
var http         = require('http');
var Router       = require('router');
var MongoClient  = require('mongodb').MongoClient;
var url = "mongodb://irfan:denied1234@localhost:27017/weather_db";
const weatherApiKey = '85cce13dd53a70be6281c9a627b6e847';
var redis = require("redis"), client = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

/** Needed for typescript */
declare var require: any;

var router = Router();
 
var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res));
});


server.listen(3000)