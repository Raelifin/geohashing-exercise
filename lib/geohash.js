
var request = require('request');

function makeDateString(dateObj) {
	return [dateObj.getFullYear(),dateObj.getMonth()+1,dateObj.getDate()].join('-');
}

const yahooDowPriceURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
const yahooAPIOpeningPriceLocation = ['query','results','quote','0','Open']; //This is the location of the Dow Open in the Yahoo response object

function getChildValueFromLocation(object, location) {
	return location.reduce((o,i) => o[i], object);
}

function geoHash(lat, lon, callback) {
	request(yahooDowPriceURL, function(error, response, body) {
		var openPrice = getChildValueFromLocation(JSON.parse(body), yahooAPIOpeningPriceLocation);
		var dateString = makeDateString(new Date());
		callback(dateString+'-'+openPrice);
	});
}

module.exports.geoHash = geoHash;
module.exports.getChildValueFromLocation = getChildValueFromLocation;
module.exports.yahooAPIOpeningPriceLocation = yahooAPIOpeningPriceLocation;
module.exports.makeDateString = makeDateString;