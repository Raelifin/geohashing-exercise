
var request = require('request');

function getChildValueFromLocation(object, location) {
	return location.reduce((o,i) => o[i], object);
}

function makeDateString(dateObj) {
	return [dateObj.getFullYear(),dateObj.getMonth()+1,dateObj.getDate()].join('-');
}

const yahooDowPriceURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
const yahooAPIOpeningPriceLocation = ['query','results','quote','0','Open']; //This is the location of the Dow Open in the Yahoo response object

function buildGeoHash(lat, lon, dateObject, openPrice) {
	makeDateString(dateObject);
	return {lat:lat,lon:lon};
}

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