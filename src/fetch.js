(function(){ 
	console.log('hello world');
}());

/*
const weatherAPiKey = '85cce13dd53a70be6281c9a627b6e847';
const http = require("http");
const url = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=" + weatherAPiKey;

http.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(body);
  });
});
*/
const fs = require('fs');
fs.readFile('./city.list.json', 'utf8', function (err,data) {
  data = JSON.parse(data); // you missed that...
  console.log( data.length );
  for(var i = 0; i < data.length; i++) {
   console.log(data[i].name);
   if (i > 10) return;
  }
});
