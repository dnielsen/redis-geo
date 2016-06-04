var express = require('express');
var app = express();
var hash;
var pos;
var redis = require('redis');
var client = redis.createClient();
var myobject;	

client.on('error', function (err) {
    console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);
});

function myfunc(text) {
	if (text.state==="C") {
		return text.name; 
	} else {
		return text.x;
	};
}

app.get('/', function (req, res) {
	var x;
	var values1;
	var locations1;
	client.georadiusbymember('locations', 'Romeo', '100', 'm', function(err, values1) {
	x = "Values: " + values1;
	});
	client.zrange('locations', '0', '-1', 'withscores', function(err, locations1) {
 
	res.send(x + "<br>" + "Locations: " + locations1);
	});
});

app.get('/print', function (req, res) {
  myobject = {name: "Dave Nielsen", city: "Mountain View", state: "CA"};
  myobject.x = req.query.x;
  res.send(myfunc(myobject));

});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

client.quit();


