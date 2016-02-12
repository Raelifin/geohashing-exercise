
var request = require('request');
var rp = require('request-promise');

//Generalized Helper Functions
/**
 * Max's learning note:
 * The extra credit section on the GitHub readme says this is the function we want,
 * but it seems to me that this doesn't allow for efficient expiration of cached results.
 * I decided to go with the next function down, but if I'm missing something I'd really
 * like to know.
 */
function cacheable(f, cacheKey) {
	return function(key) {
		if (key == cacheKey) {
			if (this.storedResult == undefined) {
				this.storedResult = f(key);
			}
			return this.storedResult;
		} else {
			return f(key);
		}
	};
}

function cacheableWithExpiration(f, cacheKey, expirationTimerInSeconds) {
	return function(key) {
		if (key == cacheKey) {
			var expired = this.storageTime && new Date().getTime() - this.storageTime > expirationTimerInSeconds*1000
			if (this.storedResult == undefined || expired) {
				this.storedResult = f(key);
				this.storageTime = new Date().getTime();
			}
			return this.storedResult;
		} else {
			return f(key);
		}
	}
}

//Task-specific functions
function reportSiteContents(url, callback) {
	if (typeof callback === 'undefined') {
		return rp(url);
	} else {		
		request(url, (error, response, body) => callback(body));
	}
}

module.exports.reportSiteContents = reportSiteContents;
module.exports.cacheable = cacheable;