var finalhandler = require('finalhandler');
const axios      = require('axios');
var http         = require('http');
var Router       = require('router');
var MongoClient  = require('mongodb').MongoClient;
var url          = "mongodb://irfan:denied1234@localhost:27017/weather_db";
const weatherApiKey = '85cce13dd53a70be6281c9a627b6e847';
var redis  = require("redis"), 
    client = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
var router = Router();

/** 
 * Note 
 * This was necessary to allow all routes to pass CORS restriction as without below, route will not work 
 * */
router.all('*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  /** 
  By default, we are returning all JSON response for our API 
  */
  res.setHeader('Content-Type', 'application/json');
  next();
});

// respond with "hello world" when a GET request is made to the homepage
router.get(['/api','/api/city'] , function (req, res) {
  res.end('Hello. Are you missing an endpoint ?');
});

router.get('/api/city/weather/:countryID', function (req, res) {
  const countryID = req.params.countryID;
  /* This func below will handle the request , once async fucntions are completed */
  getApiDataAsync(countryID, res);
});

async function getApiDataAsync(countryID, res) {
  try {
    const daily = await getAsync(`weather-${countryID}`);
    const weekly = await getAsync(`forecast-${countryID}`);

    if ( daily == null || weekly == null) {

      //console.log(`${countryID}: Weather data From API`);
      /** Response will be firedy by the ASNC func below */
      getWeatherAndForecastAsync(countryID, res);
      
    } else {

      //console.log(`${countryID}:Weather data from Cache`);

      let weatherData = [];
      weatherData.push(JSON.parse(daily));
      weatherData.push(JSON.parse(weekly));
      res.end(JSON.stringify(weatherData));
    }
  } catch(e) {
    console.log('Error caught');
  }
}

const getWeatherAndForecastAsync = async (countryID, res) => {

      let weatherData = [];
      let response = await axios(`https://api.openweathermap.org/data/2.5/weather?id=${countryID}&appid=${weatherApiKey}`);
      weatherData.push(response.data);
      client.set(`weather-${countryID}`, JSON.stringify(response.data));
      client.expire(`weather-${countryID}`, 60*60);

      response = await axios(`https://api.openweathermap.org/data/2.5/forecast?id=${countryID}&appid=${weatherApiKey}`);
      weatherData.push(response.data);
      client.set(`forecast-${countryID}`, JSON.stringify(response.data));
      client.expire(`forecast-${countryID}`, 60*60);

      res.end(JSON.stringify(weatherData));
}


/** City Page  */
router.get('/api/city/find/:name', function (req, res) {

  MongoClient.connect(url, { 
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

/** City Page  */
router.get('/api/news/channel/:slug', function (req, res) {

  getNewsData(res, req.params.slug)

});


async function getNewsData(res, slug) {
  try {
    const newsFeedItems = await getAsync(`news-${slug}`);
    res.end(newsFeedItems);
  } catch(e) {
    res.end('Error caught');
  }
}


var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res));
});


server.listen(3000)