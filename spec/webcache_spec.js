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
		it('accepts callbacks', function(done) {
			 var url = 'http://example.org';
			 
			 subject(url, function(result) {
				 
				 expect(result).toMatch(/<p>This domain is established to be used for illustrative examples in documents/);
				 
				 done();
			 });
		});
	});
	
	describe('cacheable', function() {
		var subject = require('../lib/webcache').cacheable;
		it ('creates a cacheable function on a specific key', function() {
			var key = 37;
			
			var result = subject(x => Math.random()*x, key);
			
			expect(result(key)).toBe(result(key));
			expect(result(-key)).not.toBe(result(-key));
		});
	});
});