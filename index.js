// required libraries for express and redis
var express = require('express');
var app = express();
var redis = require('redis');
var client = redis.createClient(); // var client = redis.createClient(6379, "127.0.0.1");		

client.on('error', function (err) {
    console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);
});

// add a new location to the set
// For more detials, visit http://www.redis.io/commands/geoadd
// Example: geoadd?set=locations&longitude=-122&latitude=37&city=San%20Francisco2
app.get('/geoadd', function (req, res) {
	var myset = req.query.set; // "locations"
	var mylongitude = req.query.longitude; // "-122"
	var mylatitude = req.query.latitude; // "37"
	var mycity = req.query.city; // "San Francisco"
  	client.geoadd(myset, mylongitude, mylatitude, mycity);
  	res.send("Added " + mycity);
});

// output the geohash
// For more detials, visit http://www.redis.io/commands/geohash
// Example: geohash?set=locations&city=San%20Francisco
app.get('/geohash', function (req, res) {
	var myset = req.query.set; // "locations"
	var mycity = req.query.city; // "San Francisco"
  	client.geohash(myset, mycity, function(err, results) {
	res.send("Geohash: " + results);
	})
});

// output the geopos
// For more detials, visit http://www.redis.io/commands/geopos
// Example: geopos?set=locations&city=San%20Francisco
app.get('/geopos', function (req, res) {
	var myset = req.query.set; // "locations"
	var mycity = req.query.city; // "San Francisco"
  	client.geopos(myset, mycity, function(err, results) {
	res.send("Geopos: " + results);
	})
});

// output the distance between to cities
// For more detials, visit http://www.redis.io/commands/geodist
// Example: 
app.get('/geodist', function (req, res) {
  //$ geodist?set=locations&city1=San%20Francisco&city2=Rome&distance=mi
	var myset = req.query.set; // "locations"
	var mycity1 = req.query.city1; // "San Francisco"
	var mycity2 = req.query.city2; // "Rome"
	var mydistance = req.query.distance; // "mi"
  	client.geodist(myset, mycity1, mycity2, mydistance, function(err, results) {
		res.send("Distance between " + mycity1 + " and " + mycity2 + " is: " + results + " " + mydistance); 
	})
});

// Given a longitude and latitude within a set, output a list of locations within a radius 
// For more detials, visit http://www.redis.io/commands/georadius
// Example: georadius?set=locations&longitude=-122&latitude=37&radius=100&units=mi
app.get('/georadius', function (req, res) {
	var myset = req.query.set; // "locations"
	var longitude = req.query.longitude; // "-122"
	var latitude = req.query.latitude; // "37"
	var radius = req.query.radius;
	var units = req.query.units;
	client.georadius(myset, longitude, latitude, radius, units, function(err, results) {
		res.json({
		locations: results
		});
	});
});

// Given a location within a set, output a list of locations within a radius 
// For more detials, visit http://www.redis.io/commands/georadiusbymember
// Example: georadiusbymember?set=locations&city=San%20Francisco&radius=100&units=mi
app.get('/georadiusbymember', function (req, res) {
	var myset = req.query.set; // "locations"
	var mycity = req.query.city; // "San%20Francisco"
	var myradius = req.query.radius; // "100"
	var myunits = req.query.units; // "mi"
	client.georadiusbymember(myset, mycity, myradius, myunits, function(err, results) {
		res.json({
		locations: results
		});
	});
});

// use zrange to output the list of locations within the sorted set
// For more detials, visit http://www.redis.io/commands/zrange
// Example: 
app.get('/zrange2', function (req, res) {
	client.zrange('locations', '0', '-1', 'withscores', 'asc', function(err, results) {
	res.send("Locations: " + results);
	});
});

app.get('/zrange', function (req, res) {
	var myset = req.query.set; // "locations"
	client.zrange(myset, 0, -1, function(err, results) {
		res.json({
		locations: results
		});
	});
});

// remove one of the cities from the list of locations
// For more detials, visit http://www.redis.io/commands/zrem
// Example: zrem?set=locations&city=San%20Francisco
app.get('/zrem', function (req, res) {
	var myset = req.query.set; // "locations"
	var mycity = req.query.city; // "San%20Francisco"
  	client.zrem(myset, mycity, function(err, results) {
	res.send("Removed " + mycity + " from " + myset); 
	});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});






