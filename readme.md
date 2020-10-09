#Make sure these are installed
-Redis
-Mongo
-city.list.json 

#Install dependencies
npm install

#Create .env file
WEATHER_API_KEY=
MONGO_CONNECTION_STRING=mongodb://localhost:27017/
MONGO_CONNECTION_STRING_WITH_AUTH=mongodb://user:pass@localhost:27017/weather_db
MONGO_DB_NAME=weather_db
SERVER_PORT=3000

#Setup database script
node ./scripts/setup/setup.js

#Import city.list.json

#run webserver
node run.js

#Automates running the script/server
sudo npm install -g forever
forever start run.js

#Test api example
EastLondonID=1006984
https://api.openweathermap.org/data/2.5/weather?id=1006984&appid=API_KEY