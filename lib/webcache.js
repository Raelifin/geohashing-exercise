
var request = require('request');
var rp = require('request-promise');

function reportSiteContents(url, callback) {
	if (typeof callback === 'undefined') {
		return rp(url);
	} else {		
		request(url, (error, response, body) => callback(body));
	}
}

module.exports.reportSiteContents = reportSiteContents;