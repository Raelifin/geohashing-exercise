
var request = require('request');

function makeDateString(dateObj) {
	return [dateObj.getFullYear(),dateObj.getMonth()+1,dateObj.getDate()].join('-');
}

function getDowOpeningPriceFromResponseJSON(yahooResponseJSONString) {
	return JSON.parse(yahooResponseJSONString).query.results.quote[0].Open;
}

function geoHash(lat, lon, callback) {
	request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22%5ENDX%22%2C%22INDU%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=', function(error, response, body) {
		var openPrice = getDowOpeningPriceFromResponseJSON(body);
		var dateString = makeDateString(new Date());
		callback(dateString+'-'+openPrice);
	});
}

module.exports.geoHash = geoHash;
module.exports.getDowOpeningPriceFromResponseJSON = getDowOpeningPriceFromResponseJSON;
module.exports.makeDateString = makeDateString;