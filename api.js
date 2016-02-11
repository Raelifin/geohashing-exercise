express = require('express');
app     = express();

geoHash = require('./lib/geohash').geoHash;

app.get('/geohash', function(req, res, next) {
	geoHash(req.query.lat, req.query.lon).then(data => res.json(data));
});
app.post('/geohash', function(req, res, next) {
	geoHash(req.query.lat, req.query.lon).then(data => res.json(data));
});

app.listen(8000, function() {
	console.log("api listening on 8000");
});

module.exports = app;
