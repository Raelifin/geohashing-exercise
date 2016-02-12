
var md5 = require('md5');

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

//Task-Specific Function
function buildGeoHash(lat, lon, dateObject, openPrice) {
	var trimmedCoords = [lat,lon].map(x => parseInt(x)); //ParseInt is used to cut off fractional component
	var hash = hashDateAndPrice(dateObject, openPrice);
	var bigInts = chunkString(hash,2).map(hexToInt);
	var coords = joinTwoArrays(trimmedCoords, bigInts, '.');
	coords = coords.map(x => parseFloat(parseFloat(x).toFixed(6))); //Round to 6 decimals
	return {lat: coords[0], lon:coords[1]};
}

/**
 * Max's learning note:
 * This seems wrong. This file should be producing one function: buildGeoHash.
 * But in order to test components, it needs to export them, right? How do we prevent tests from killing good encapsulation standards?
 */
module.exports.buildGeoHash = buildGeoHash;
module.exports.makeDateString = makeDateString;
module.exports.hashDateAndPrice = hashDateAndPrice;