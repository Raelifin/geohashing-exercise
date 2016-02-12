
var request = require('request');
var rp = require('request-promise');

function reportSiteContents(url) {
	return rp(url);
}

module.exports.reportSiteContents = reportSiteContents;