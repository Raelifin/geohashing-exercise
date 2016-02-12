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
	
	/**
	 * Max's learning note:
	 * In the Arrange->Act->Assert paradigm, does a test of a higher-order function treat
	 * the first-order function as the result, or does it test the data it feeds the
	 * first-order function as the result? I'm a bit confused here.
	 **/
	
	describe('cacheable', function() {
		var subject = require('../lib/webcache').cacheable;
		it ('can create different cacheable functions on different keys', function() {
			var key1 = 42;
			var key2 = 1337;
			
			var result1 = subject(x => Math.random()*x, key1);
			var result2 = subject(x => Math.random()*Math.random(), key2);
			
			expect(result1(key1)).toBe(result1(key1));
			expect(result1(-key1)).not.toBe(result1(-key1));
			expect(result2(key2)).toBe(result2(key2));
			expect(result2(-key2)).not.toBe(result2(-key2));
			expect(result1(key1)).not.toBe(result2(key2));
		});
		it ('can handle functions with more than one parameter by keying on the first parameter only', function() {
			var key = 42;
			var param2 = 1337;
			var alternateParam2 = -0.1337
			
			var result = subject((x,y) => Math.random()*x*y, key);
			
			expect(result(key,param2)).toBe(result(key,param2));
			expect(result(-key,param2)).not.toBe(result(-key,param2));
			expect(result(key,param2)).toBe(result(key,alternateParam2));
		});
	});
	
	describe('cacheableWithExpiration', function() {
		var subject = require('../lib/webcache').cacheableWithExpiration;
		it ('creates a cacheable function on a specific key', function() {
			var key = 42;
			
			var result = subject(x => Math.random()*x, key, 5);
			
			expect(result(key)).toBe(result(key));
			expect(result(-key)).not.toBe(result(-key));
		});
		/**
		 * Max's learning note:
		 * I'm really curious how to best handle the Arrange->Act->Assert paradigm in weird tests like this one.
		 * Is this "right"?
		 **/
		it ('expires in the appropriate amount of time', function(done) {
			var key = 42;
			
			var result = subject(x => Math.random()*x, key, 0.5);
			var output1 = result(key);
			setTimeout(function() {
				var output2 = result(key);
				
				expect(output1).not.toBe(output2);
				
				done();
			}, 600);
		});
	});
});