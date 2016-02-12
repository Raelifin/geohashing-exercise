
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
	var cache = {};
	return function() {
		if (arguments[0] == cacheKey) {
			if (cache.storedResult == undefined) {
				cache.storedResult = f.apply(this, arguments);
			}
			return cache.storedResult;
		} else {
			return f.apply(this, arguments);
		}
	};
}

function cacheableWithExpiration(f, cacheKey, expirationTimerInSeconds) {
	var cache = {};
	return function(key) {
		if (key == cacheKey) {
			var expired = cache.storageTime && (new Date().getTime() - cache.storageTime > expirationTimerInSeconds*1000);
			if (cache.storedResult == undefined || expired) {
				cache.storedResult = f(key);
				cache.storageTime = new Date().getTime();
			}
			return cache.storedResult;
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
module.exports.cacheableWithExpiration = cacheableWithExpiration;