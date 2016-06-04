var express = require('express');
var app = express();
var redis = require('redis');
var client = redis.createClient();	

client.on('error', function (err) {
    console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);
});

app.get('/', function (req, res) {
	var x;
	client.georadiusbymember('locations', 'Romeo', '100', 'm', function(err, results1) {
	x = "Locations 1: " + results1;
		});
	client.zrange('locations', '0', '-1', 'withscores', function(err, results2) {
	res.send(x + "<br>" + "Locations 2: " + results2);
		});
});

app.get('/add', function (req, res) {
  //mylocation = {set: "locations", longitude: "32", latitude: "-122", name: "San Francisco"};
  mylocation.set = req.query.set;
  mylocation.longitude = req.query.longitude;
  mylocation.latitude = req.query.latitude;
  mylocation.name = req.query.name;
  res.send(addLocation(mylocation));

});

function addLocation(loc) {
	client.geoadd(loc.set, loc.longitude, loc.latitude, loc.name);
	if (loc.set!="") {
		return "Location Added Successfully"; 
	} else {
		return "Location NOT added";
	};
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

client.quit();




