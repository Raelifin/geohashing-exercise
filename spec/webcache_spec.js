describe('Webcache', function() {
	
	describe('reportSiteContents', function() {
		var subject = require('../lib/webcache').reportSiteContents;
		it('returns a string with text from example.org when asked for example.org', function(done) {
			 var url = 'http://example.org';
			 
			 subject(url).then(function(result) {
				 
				 expect(result).toMatch(/<p>This domain is established to be used for illustrative examples in documents/);
				 
				 done();
			 });
		});
	});
});