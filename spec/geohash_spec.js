describe("Geohash", function() {
	describe('makeDateString', function() {
		var subject = require('../lib/geohash').makeDateString;
		it('returns a formatted date string', function() {
			//Arrange
			var date = new Date('December 17, 1995 03:24:00');
			//Act
			var result = subject(date);
			//Assert
			expect(result).toBe('1995-12-17');
		});
	});
});