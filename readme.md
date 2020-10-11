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

#Creates databse and Import city.list.json into City collection
cd scripts/setup
sudo mongoimport --db weather_db --collection City --jsonArray --file city.list.json

#run webserver in the background
sudo node run.js &

#Find list of all node process ids
ps aux | grep node

#Kil single node process
sudo kill -9 24396

#Kill all node process
sudo killall -9 node

#Test api example
EastLondonID=1006984
https://api.openweathermap.org/data/2.5/weather?id=1006984&appid=API_KEY