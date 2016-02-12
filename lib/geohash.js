
var buildGeoHash = require('./geohashLogic').buildGeoHash;
var request = require('request');
var rp = require('request-promise');
var cacheable = require('./cache').cacheableWithExpiration;

//Generalized Helper Function
function getChildValueFromLocation(object, location) {
	return location.reduce((o,i) => o[i], object);
}

const yahooDowPriceURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
const yahooAPIOpeningPriceLocation = ['query','results','quote','0','Open']; //This is the location of the Dow Open in the Yahoo response object
const expirationTime = 24*60*60*1000;

function getOpenPriceFromYahooResults(rawStringFromYahooServer) {
	return getChildValueFromLocation(JSON.parse(rawStringFromYahooServer), yahooAPIOpeningPriceLocation);
}

//Note: the version of this function that uses a callback doesn't cache, because callbacks are side-effects and side-effects and caching don't play well together.
var reportOpenPriceFromYahoo = cacheable(function(callback) {
	if (typeof callback === 'undefined') {
		return rp(yahooDowPriceURL).then(body => getOpenPriceFromYahooResults(body));
	} else {
		request(yahooDowPriceURL, (error, response, body) => callback(getOpenPriceFromYahooResults(body)));
	}
}, [], expirationTime);

function geoHash(lat, lon, callback) {
	if (typeof callback === 'undefined') {
		return reportOpenPriceFromYahoo().then(price => buildGeoHash(lat,lon,new Date(),price));
	} else {
		reportOpenPriceFromYahoo(price => callback(buildGeoHash(lat,lon,new Date(),price)));
	}
}

module.exports.geoHash = geoHash;
module.exports.getOpenPriceFromYahooResults = getOpenPriceFromYahooResults;