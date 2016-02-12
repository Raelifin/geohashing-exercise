describe('Webcache', function() {
	
	describe('reportSiteContents', function() {
		var subject = require('../lib/webcache').reportSiteContents;
		it('returns a promise of a string', function(done) {
			 var url = 'http://example.org';
			 
			 subject(url).then(function(result) {
				 
				 expect(typeof result).toBe('string');
				 
				 done();
			 });
		});
	});
});