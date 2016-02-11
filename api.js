express = require('express');
app     = express();

geoHash = require('./lib/geohash').geoHash;

app.get('/geohash', function(req, res, next) {
	res.json(geoHash(req.query.lat, req.query.lon));
});
app.post('/geohash', function(req, res, next) {
	res.json(geoHash(req.query.lat, req.query.lon));
});

app.listen(8000, function() {
	console.log("api listening on 8000");
});

module.exports = app;
