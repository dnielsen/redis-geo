// required libraries for express and redis
var express = require('express');
var app = express();
var redis = require('redis');
var client = redis.createClient(); // var client = redis.createClient(6379, "127.0.0.1");		

client.on('error', function (err) {
    console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);
});

//add a new location to the set
// For more detials, visit http://www.redis.io/commands/geoadd
app.get('/geoadd', function (req, res) {
  // geoadd?set=locations&longitude=-122&latitude=37&city=San%20Francisco2
  myset = req.query.set; // "locations"
  mylongitude = req.query.longitude; // "-122"
  mylatitude = req.query.latitude; // "37"
  mycity = req.query.city; // "San Francisco"
  client.geoadd(myset, mylongitude, mylatitude, mycity);
  res.send("Added " + mycity);

});

//output the geohash
// For more detials, visit http://www.redis.io/commands/geohash
app.get('/geohash', function (req, res) {
  // geohash?set=locations&city=San%20Francisco
  myset = req.query.set; // "locations"
  mycity = req.query.city; // "San Francisco"
  client.geohash(myset, mycity, function(err, results) {
	res.send("Geohash: " + results);
	})
});

//output the geopos
// For more detials, visit http://www.redis.io/commands/geopos
app.get('/geopos', function (req, res) {
  // geopos?set=locations&city=San%20Francisco
  myset = req.query.set; // "locations"
  mycity = req.query.city; // "San Francisco"
  client.geopos(myset, mycity, function(err, results) {
	res.send("Geopos: " + results);
	})
});

// output the distance between to cities
// For more detials, visit http://www.redis.io/commands/geodist
app.get('/geodist', function (req, res) {
  //$ geodist?set=locations&city1=San%20Francisco&city2=Rome&distance=mi
  myset = req.query.set; // "locations"
  mycity1 = req.query.city1; // "San Francisco"
  mycity2 = req.query.city2; // "Rome"
  mydistance = req.query.distance; // "mi"
  client.geodist(myset, mycity1, mycity2, mydistance, function(err, results) {
	res.send("Distance between " + mycity1 + " and " + mycity2 + " is: " + results + " " + mydistance); 
	})
});

// Given a longitude and latitude, output a list of locations within a radius 
// For more detials, visit http://www.redis.io/commands/georadius
app.get('/georadius', function (req, res) {
	// client.georadius('locations', 'Romeo', '-122', '32', 'mi', function(err, results) {
	client.georadius('locations', '-122', '32', '100', 'mi', function(err, results) {
  //$ geodist?set=locations&city1=San%20Francisco&city2=Rome&units=mi
  myset = req.query.set; // "locations"
  longitude = req.query.longitude; // "San%20Francisco"
  latitude = req.query.latitude; // "Rome"
  myunits = req.query.units; // "mi"
  client.georadius(myset, longitude, latitude, mydistance, function(err, results) {
	res.send("Distance between " + mycity1 + " and " + mycity2 + " is: " + results + " " + myunits); 
	})
	});
});

// output the list of locations within the radius of a member of the set
// For more detials, visit http://www.redis.io/commands/georadiusbymember
app.get('/georadiusbymember', function (req, res) {
	// client.georadiusbymember('locations', 'Romeo', '100', 'mi', function(err, results) {
	client.georadiusbymember('locations', 'Romeo', '100', 'mi', function(err, results) {
	res.send("Locations: " + results);
	});

});

// use zrange to output the list of locations within the sorted set
app.get('/zrange', function (req, res) {
	client.zrange('locations', '0', '-1', 'withscores', 'asc', function(err, results) {
	res.send("Locations: " + results);
	});
});

// remove one of the cities from the list of locations
app.get('/zrem', function (req, res) {
	// zrem?set=locations&city=San%20Francisco
	myset = req.query.set; // "locations"
	mycity = req.query.name; // "San%20Francisco"
  	client.zrem(myset, mycity);
	res.send("Removed " + mycity + " from " + myset); 
	})
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});






