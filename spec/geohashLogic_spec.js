describe("GeohashLogic", function() {
	
	describe('buildGeoHash', function() {
		var subject = require('../lib/geohashLogic').buildGeoHash;
		it('returns the correct latitude and longetude for Dec 17, 1995 and price=3996.77', function() {
			var inLat = '1.001';
			var inLon = '2.002';
			var date = new Date('December 17, 1995 03:24:00');
			var price = '3996.77';
			
			var result = subject(inLat, inLon, date, price);
			
			expect(result['lat']).toBe(1.172544);
			expect(result['lon']).toBe(2.105391);
		});
		
		it('returns the correct latitude and longetude for Jan 3, 2016 and price=4', function() {
			var inLat = '1.001';
			var inLon = '2.002';
			var date = new Date('Jan 3, 2016 03:24:00');
			var price = '4';
			
			var result = subject(inLat, inLon, date, price);
			
			expect(result['lat']).toBe(1.358264);
			expect(result['lon']).toBe(2.404788);
		});
	});
	
	
	describe('hashDateAndPrice', function() {
		var subject = require('../lib/geohashLogic').hashDateAndPrice;
		it('returns an md5 hash on sample input', function() {
			var date = new Date('December 17, 1995 03:24:00');
			var price = '3996.77';
			
			var result = subject(date, price);
			
			expect(result).toBe('ef73efba80d18e9c924276df7e6285a1');
		});
		it('returns an md5 hash on another sample input', function() {
			var date = new Date('February 11, 2016 03:24:00');
			var price = '15897.82';
			
			var result = subject(date, price);
			
			expect(result).toBe('769b7a4d524643842e2f7c954024b6e6');
		});
	});
	
	describe('makeDateString', function() {
		var subject = require('../lib/geohashLogic').makeDateString;
		it('returns a formatted date string', function() {
			var date = new Date('December 17, 1995 03:24:00');
			
			var result = subject(date);
			
			expect(result).toBe('1995-12-17');
		});
	});
});