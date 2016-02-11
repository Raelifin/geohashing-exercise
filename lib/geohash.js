
var md5 = require('md5');
var request = require('request');
var rp = require('request-promise');

function getChildValueFromLocation(object, location) {
	return location.reduce((o,i) => o[i], object);
}

function makeDateString(dateObj) {
	var month = dateObj.getMonth()+1;
	month = month<10?'0'+month:month;
	var day = dateObj.getDate();
	day = day<10?'0'+day:day;
	return [dateObj.getFullYear(),month,day].join('-');
}

function hashDateAndPrice(dateObject, openPrice) {
	return md5(makeDateString(dateObject)+'-'+openPrice);
}

function generatePairOfBigIntegers(dateObject, openPrice) {
	var hash = hashDateAndPrice(dateObject, openPrice);
	return [hash.substring(0,16),hash.substring(16)].map(s => parseInt('0x'+s));
}

function buildGeoHash(lat, lon, dateObject, openPrice) {
	var generatedCoords = generatePairOfBigIntegers(dateObject, openPrice);
	var newLat = parseFloat(parseInt(lat)+'.'+generatedCoords[0]); //ParseInt is used to cut off fractional component
	var newLon = parseFloat(parseInt(lon)+'.'+generatedCoords[1]);
	return {lat: parseFloat(newLat.toFixed(6)), lon:parseFloat(newLon.toFixed(6))};
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

function geoHash(lat, lon, callback) {
	reportOpenPriceFromYahoo(function (price) {
		callback(buildGeoHash(lat,lon,new Date(),price));
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