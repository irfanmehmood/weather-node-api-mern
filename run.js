/** Package include to read config/.env file */
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

/** Dont know why I need this */
var finalhandler = require('finalhandler');

/** Our http server */
var http         = require('http');

/** Our router */
var router       = require('router')();

/** Mongodb database driver. And connection string */
var mongoClient  = require('mongodb').MongoClient;
var mongoConnectionString = "mongodb://irfan:denied1234@localhost:27017/weather_db";

var apiFuncs = require('./scripts/api/scripts.js');

/* Note. Necessary to allow all routes to pass CORS restriction as without below, route will not work */
router.all('*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  /** By default, we are returning all JSON response for our API */
  res.setHeader('Content-Type', 'application/json');
  next();
});

/* This will handle routes without an Endpoint */
router.get(['/', '/api','/api/city', '/api/city/weather/'] , function (req, res) {
  let msg = "Missing an endpoint. \n\nExamples\n";
  msg += "/api/city/weather/1006984\n";
  msg += "/api/city/find/lon";
  res.end(msg);
});

router.get('/api/city/weather/:countryID', function (req, res) {
  const countryID = req.params.countryID;
  /* This func below will handle the request , once async fucntions are completed */
  apiFuncs.getData(countryID, res);
});

/** City Page  */
router.get('/api/city/find/:name', function (req, res) {

  mongoClient.connect(mongoConnectionString, { 
    useNewUrlParser: true,  
    useUnifiedTopology: true 
  }, function(err, db) {

      if (err) throw err;

      var dbo = db.db("weather_db");
      var name_param = req.params.name;
      var query_regex = {name: new RegExp( name_param, 'i')} ;

      dbo.collection("city")
        .find(query_regex)
        .limit(10)
        .toArray(function(err, result) {
                  if (err) throw err;
                  res.end(JSON.stringify(result));
                  db.close();
                }
        );

    });
});


/**
 * Start our server
 */
var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res));
});
const SERVER_PORT = process.env.SERVER_PORT;
server.listen(SERVER_PORT)
console.log(`Server running on 127.0.0.1:${SERVER_PORT}`)