/** Package include to read config/.env file */
require('dotenv').config();

/** Env variables */
const API_KEY = process.env.WEATHER_API_KEY;
const API_URL ='https://api.openweathermap.org/data/2.5'

/** Redis driver */
var redis  = require("redis");
var redisClient = redis.createClient();
/**
Promises
* Node Redis currently doesn't natively support promises (this is coming in v4), however you 
* can wrap the methods you want to use with promises using the built-in Node.js util.promisify 
* method on Node.js >= v8;
*/
const {promisify} = require('util');
const redisGetAsync = promisify(redisClient.get).bind(redisClient);

/** 
 * Promised Async await, Exported externally 
 * Either gets data from Redis cacahe or if not available gets it from External API via getCountryDataFromExternalAPIPromised*/
module.exports = {
    getMatchedCities: (country, browserResponse) => {

        /* Mongo client to connect to our DB */
        var mongoClient = require('mongodb').MongoClient;

        /** Table/Collection name */
        var tableCollection = 'City';

        mongoClient.connect(process.env.MONGO_CONNECTION_STRING, { 
            useNewUrlParser: true,  
            useUnifiedTopology: true 
          }, function(err, db) {
        
              if (err) throw err;
        
              /* Database */
              let dbo = db.db(process.env.MONGO_DB_NAME);

              var query_regex = {name: new RegExp( country , 'i')} ;
        
              dbo.collection(tableCollection)
                .find(query_regex)
                .limit(10)
                .toArray(function(err, result) {
                          if (err) throw err;
                          browserResponse.end(JSON.stringify(result));
                          db.close();
                        }
                );
        
            });
    },
    getCityWeatherData: async (countryID, browserResponse) => {
        try {

            //console.log(`${API_URL}weather?id=${countryID}&appid=${API_KEY}`);
            //process.exit();
    
            /** Redis - Check if data exists */
            const daily = await redisGetAsync(`weather-${countryID}`);
            const weekly = await redisGetAsync(`forecast-${countryID}`);
        
            /** Redis - data does not exists. Get it from the External API */
            if ( daily == null || weekly == null) {
        
                console.log(`CountryID:${countryID}: Weather data From API`);

                /** Promised async await to get data from External API */
                getCountryDataFromExternalAPIPromised(countryID, browserResponse).then((json) => { 
                    console.log(json); }
                ).catch((err) => {
                    console.log(err); }
                );
                
            } else {
        
                /** Redis - Data is available */
                console.log(`CountryID:${countryID}: Weather data from Cache`);
        
                /** Create our daily and weekly weather array for the specified country */
                let weatherData = [];
    
                weatherData.push(JSON.parse(daily));
                weatherData.push(JSON.parse(weekly));
    
                /** Returns data to browser and ends response */
                browserResponse.end(JSON.stringify(weatherData));
    
                return;
    
            }
        } catch(err) {
            console.log('Error caught' + err);
        }
    },
  };

/** Promised Async await, Function not exported */
const getCountryDataFromExternalAPIPromised = async (countryID, browserResponse) => {

    /** Need this to make API calls to get weather */
    const axios      = require('axios');

    let weatherData = [];

    /** API call to fetch country daily data */
    let response = await axios(`${API_URL}/weather?id=${countryID}&appid=${API_KEY}`);
    weatherData.push(response.data);

    /** Save response in Redis cache */
    redisClient.set(`weather-${countryID}`, JSON.stringify(response.data));
    redisClient.expire(`weather-${countryID}`, 60*60);

    /** API call to fetch country forecast data */
    response = await axios(`${API_URL}/forecast?id=${countryID}&appid=${API_KEY}`);
    weatherData.push(response.data);

    /** Save response in Redis cache */
    redisClient.set(`forecast-${countryID}`, JSON.stringify(response.data));
    redisClient.expire(`forecast-${countryID}`, 60*60);

    /** Returns data to browser and ends response */
    browserResponse.end(JSON.stringify(weatherData));
}

