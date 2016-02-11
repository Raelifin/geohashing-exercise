express = require('express');
app     = express();

geoHash = require('./lib/geohash').geoHash;

var geoHashResponse = (req, res, next) => geoHash(req.query.lat, req.query.lon).then(data => res.json(data));

app.get('/geohash', geoHashResponse);
app.post('/geohash', geoHashResponse);

app.listen(8000, function() {
	console.log("api listening on 8000");
});

module.exports = app;
