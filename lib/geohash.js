
var request = require('request');
var md5 = require('md5');

function getChildValueFromLocation(object, location) {
	return location.reduce((o,i) => o[i], object);
}

function makeDateString(dateObj) {
	return [dateObj.getFullYear(),dateObj.getMonth()+1,dateObj.getDate()].join('-');
}

function hashDateAndPrice(dateObject, openPrice) {
	return md5(makeDateString(dateObject)+'-'+openPrice);
}

function generateCoords(dateObject, openPrice) {
	return [17254398181690675000,10539116780270553000];
}

function buildGeoHash(lat, lon, dateObject, openPrice) {
	var generatedCoords = generateCoords(dateObject, openPrice);
	return {lat:Math.floor(lat)+'.'+generatedCoords[0],lon:Math.floor(lon)+'.'+generatedCoords[1]};
}

const yahooDowPriceURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
const yahooAPIOpeningPriceLocation = ['query','results','quote','0','Open']; //This is the location of the Dow Open in the Yahoo response object

function getOpenPriceFromYahooResults(rawStringFromYahooServer) {
	return getChildValueFromLocation(JSON.parse(rawStringFromYahooServer), yahooAPIOpeningPriceLocation);
}

function reportOpenPriceFromYahoo(callback) {
	request(yahooDowPriceURL, function(error, response, body) {
		callback(getOpenPriceFromYahooResults(body));
	});
}

function geoHash(lat, lon, ultimateCallback) {
	reportOpenPriceFromYahoo(function(price) { ultimateCallback(buildGeoHash(lat,lon,new Date(),price)); });
}

module.exports.geoHash = geoHash;
module.exports.buildGeoHash = buildGeoHash;
module.exports.getOpenPriceFromYahooResults = getOpenPriceFromYahooResults;
module.exports.makeDateString = makeDateString;
module.exports.hashDateAndPrice = hashDateAndPrice;