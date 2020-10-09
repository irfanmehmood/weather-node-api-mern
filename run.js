/** Package include to read config/.env file */
require('dotenv').config();

/** Dont know why I need this */
var finalhandler = require('finalhandler');

/** Our http server */
var http         = require('http');

/** Our router */
var router       = require('router')();

var apiFuncs = require('./scripts/api/scripts.js');

/* Note. Necessary to allow all routes to pass CORS restriction as without below, route will not work */
router.all('*', function(request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  /** By default, we are returning all JSON response for our API */
  response.setHeader('Content-Type', 'application/json');
  next();
});

/* This will handle routes without an Endpoint */
router.get(['/', '/api','/api/city', '/api/city/weather/'] , function (request, response) {
  let msg = "Missing an endpoint. \n\nExamples\n";
  msg += "/api/city/weather/1006984\n";
  msg += "/api/city/find/lon";
  response.end(msg);
});

/**
 * Get city daily and forecast weather 
 */
router.get('/api/city/weather/:countryID', function (request, response) {
  apiFuncs.getCityWeatherData(request.params.countryID, response);
});

/**
 * Get list of cities 
 */
router.get('/api/city/find/:name', function (request, response) {
  apiFuncs.getMatchedCities(request.params.name, response);
});


/**
 * Start our server
 */
var server = http.createServer(function(request, response) {
  router(request, response, finalhandler(request, response));
});
const SERVER_PORT = process.env.SERVER_PORT;
server.listen(SERVER_PORT)
console.log(`Server running on 127.0.0.1:${SERVER_PORT}`)