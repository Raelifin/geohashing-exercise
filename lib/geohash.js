
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
	var hash = hashDateAndPrice(dateObject, openPrice);
	return [hash.substring(0,16),hash.substring(16)].map(s => parseInt('0x'+s));
}

function buildGeoHash(lat, lon, dateObject, openPrice) {
	var generatedCoords = generateCoords(dateObject, openPrice);
	return {lat:parseInt(lat)+'.'+generatedCoords[0],lon:parseInt(lon)+'.'+generatedCoords[1]};
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
	reportOpenPriceFromYahoo(function(price) {
		var coords = buildGeoHash(lat,lon,new Date(),price);
		ultimateCallback({lat: Math.round(parseFloat(coords.lat)*1000000)/1000000, lon: Math.round(parseFloat(coords.lon)*1000000)/1000000});
	});
}

/**
 * Max's learning note:
 * This seems wrong. This file should be producing one, or maybe two functions (geoHash and maybe buildGeoHash).
 * But in order to test components, it needs to export them, right? How do we prevent tests from killing good encapsulation standards?
 */
module.exports.geoHash = geoHash;
module.exports.buildGeoHash = buildGeoHash;
module.exports.getOpenPriceFromYahooResults = getOpenPriceFromYahooResults;
module.exports.makeDateString = makeDateString;
module.exports.hashDateAndPrice = hashDateAndPrice;