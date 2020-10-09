var getTotalCitiesList = (jsonFilePath) => {
  return new Promise((resolve, reject) => {
      if (jsonFilePath === '') {
          /** Promise reject as json file required*/
          reject(new Error('Invalid file path'));
      } else {
          const fs = require("fs");
          var totalCities = 0;
          fs.readFile(jsonFilePath, "utf8", (err, data) => {
            if (err) reject(err);
            citiesList = JSON.parse(data);
            //console.log(citiesList.length);
            resolve(citiesList);
          });
      }
  });
}

var getTotalCities = (jsonFilePath) => {
  return new Promise((resolve, reject) => {
      if (jsonFilePath === '') {
          /** Promise reject as json file required*/
          reject(new Error('Invalid file path'));
      } else {
          const fs = require("fs");
          var totalCities = 0;
          fs.readFile(jsonFilePath, "utf8", (err, data) => {
            if (err) reject(err);
            citiesList = JSON.parse(data);
            //console.log(citiesList.length);
            resolve(citiesList.length);
          });
      }
  });
}

  /** Json file path from root folder */
  const citiesJsonFileLocation = "scripts/cities/city.list.json";

  const citiesTotal = getTotalCities(citiesJsonFileLocation);

  /** Call the get Total Cities promise and wait */
  citiesTotal.then((total) => { 
      console.log("Total cities=" + total); 
  }).catch((err) => {
      console.log("Probably file does not exist"); }
  );

