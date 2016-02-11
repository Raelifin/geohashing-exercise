
var md5 = require('md5');
var request = require('request');
var rp = require('request-promise');

//General Helper Functions
function range(start, end) {
	var r = [];
	for (var i = start; i <= end; i++) {
		r.push(i);
	}
	return r;
}

function hexToInt(hexString) {
	return parseInt('0x'+hexString);
}

function chunkString(s, chunks) {
	var chunkLength = parseInt(s.length/chunks);
	return range(0,chunks).map(i => s.substring(i*chunkLength,(i+1)*chunkLength));
}

function joinTwoArrays(a, b, glue) {
	return a.map((e,i) => e+glue+b[i]);
}

function getChildValueFromLocation(object, location) {
	return location.reduce((o,i) => o[i], object);
}

//Task-Specific Helper Functions
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

//Task-Specific Functions
function buildGeoHash(lat, lon, dateObject, openPrice) {
	var trimmedCoords = [lat,lon].map(x => parseInt(x)); //ParseInt is used to cut off fractional component
	var hash = hashDateAndPrice(dateObject, openPrice);
	var bigInts = chunkString(hash,2).map(hexToInt);
	var coords = joinTwoArrays(trimmedCoords, bigInts, '.');
	coords = coords.map(x => parseFloat(parseFloat(x).toFixed(6))); //Round to 6 decimals
	return {lat: coords[0], lon:coords[1]};
}

const yahooDowPriceURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
const yahooAPIOpeningPriceLocation = ['query','results','quote','0','Open']; //This is the location of the Dow Open in the Yahoo response object

function getOpenPriceFromYahooResults(rawStringFromYahooServer) {
	return getChildValueFromLocation(JSON.parse(rawStringFromYahooServer), yahooAPIOpeningPriceLocation);
}

function reportOpenPriceFromYahoo(callback) {
	if (typeof callback === 'undefined') {
		return rp(yahooDowPriceURL).then(body => getOpenPriceFromYahooResults(body));
	} else {		
		request(yahooDowPriceURL, function(error, response, body) {
			callback(getOpenPriceFromYahooResults(body));
		});
	}
}

function geoHash(lat, lon, callback) {
	if (typeof callback === 'undefined') {
		return reportOpenPriceFromYahoo().then(price => buildGeoHash(lat,lon,new Date(),price));
	} else {
		reportOpenPriceFromYahoo(price => callback(buildGeoHash(lat,lon,new Date(),price)));
	}
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