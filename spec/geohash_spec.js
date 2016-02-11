describe("Geohash", function() {
	
	describe('geoHash', function() {
		var subject = require('../lib/geohash').geoHash;
		/**
		* Max's learning note:
		* This seems really clunky. I know the runs and waitsFor style got depricated in Jasmine 2.0, but I still think this could be cleaner.
		* How does it relate to Arrange, Act, and Assert? Is this right?
		*/
		it('returns a latitude and longitude', function() {
			//Arrange
			var sampleLat = '1.001';
			var sampleLon = '2.002';
			var result;
			
			//Act
			runs(function() { subject(sampleLat, sampleLon, function(r) { result = r; }); });
			waitsFor(function() { return result; }, "Result should exist", 1000);
			
			//Assert
			runs(function() {
				expect(result['lat']).toBeDefined();
				expect(result['lon']).toBeDefined();
				expect(isNaN(parseFloat(result['lat']))).toBe(false);
				expect(isNaN(parseFloat(result['lon']))).toBe(false);
			});
		});
	});
	
	describe('buildGeoHash', function() {
		var subject = require('../lib/geohash').buildGeoHash;
		it('returns the correct latitude and longetude for Dec 17, 1995', function() {
			var inLat = '1.001';
			var inLon = '2.002';
			var date = new Date('December 17, 1995 03:24:00');
			var price = '3996.77';
			
			var result = subject(inLat, inLon, date, price);
			
			expect(result['lat']).toBe('1.17254398181690675000');
			expect(result['lon']).toBe('2.10539116780270553000');
		});
	});
	
	
	
	describe('hashDateAndPrice', function() {
		var subject = require('../lib/geohash').hashDateAndPrice;
		it('returns a 32 character string', function() {
			var date = new Date('December 17, 1995 03:24:00');
			var price = '3996.77';
			
			var result = subject(date, price);
			
			expect(result.length).toBe(32);
		});
	});
	
	describe('makeDateString', function() {
		var subject = require('../lib/geohash').makeDateString;
		it('returns a formatted date string', function() {
			var date = new Date('December 17, 1995 03:24:00');
			
			var result = subject(date);
			
			expect(result).toBe('1995-12-17');
		});
	});
	
	describe('getOpenPriceFromYahooResults', function() {
		var subject = require('../lib/geohash').getOpenPriceFromYahooResults;
		it('returns a price string for Yahoo API data', function() {
			var sampleResponse = '{"query":{"count":2,"created":"2016-02-10T18:45:01Z","lang":"en-US","diagnostics":{"url":[{"execution-start-time":"484","execution-stop-time":"487","execution-time":"3","content":"http://www.datatables.org/yahoo/finance/yahoo.finance.quotes.xml"},{"execution-start-time":"546","execution-stop-time":"556","execution-time":"10","content":"http://download.finance.yahoo.com/d/quotes.csv?f=aa2bb2b3b4cc1c3c4c6c8dd1d2ee1e7e8e9ghjkg1g3g4g5g6ii5j1j3j4j5j6k1k2k4k5ll1l2l3mm2m3m4m5m6m7m8nn4opp1p2p5p6qrr1r2r5r6r7ss1s7t1t7t8vv1v7ww1w4xy&s=%5ENDX,INDU"}],"publiclyCallable":"true","cache":{"execution-start-time":"499","execution-stop-time":"536","execution-time":"37","method":"GET","type":"MEMCACHED","content":"5d1e1de680846a307c9874dc3d6878dc"},"query":{"execution-start-time":"545","execution-stop-time":"556","execution-time":"11","params":"{url=[http://download.finance.yahoo.com/d/quotes.csv?f=aa2bb2b3b4cc1c3c4c6c8dd1d2ee1e7e8e9ghjkg1g3g4g5g6ii5j1j3j4j5j6k1k2k4k5ll1l2l3mm2m3m4m5m6m7m8nn4opp1p2p5p6qrr1r2r5r6r7ss1s7t1t7t8vv1v7ww1w4xy&s=%5ENDX,INDU]}","content":"select * from csv where url=@url and columns=\'Ask,AverageDailyVolume,Bid,AskRealtime,BidRealtime,BookValue,Change&PercentChange,Change,Commission,Currency,ChangeRealtime,AfterHoursChangeRealtime,DividendShare,LastTradeDate,TradeDate,EarningsShare,ErrorIndicationreturnedforsymbolchangedinvalid,EPSEstimateCurrentYear,EPSEstimateNextYear,EPSEstimateNextQuarter,DaysLow,DaysHigh,YearLow,YearHigh,HoldingsGainPercent,AnnualizedGain,HoldingsGain,HoldingsGainPercentRealtime,HoldingsGainRealtime,MoreInfo,OrderBookRealtime,MarketCapitalization,MarketCapRealtime,EBITDA,ChangeFromYearLow,PercentChangeFromYearLow,LastTradeRealtimeWithTime,ChangePercentRealtime,ChangeFromYearHigh,PercebtChangeFromYearHigh,LastTradeWithTime,LastTradePriceOnly,HighLimit,LowLimit,DaysRange,DaysRangeRealtime,FiftydayMovingAverage,TwoHundreddayMovingAverage,ChangeFromTwoHundreddayMovingAverage,PercentChangeFromTwoHundreddayMovingAverage,ChangeFromFiftydayMovingAverage,PercentChangeFromFiftydayMovingAverage,Name,Notes,Open,PreviousClose,PricePaid,ChangeinPercent,PriceSales,PriceBook,ExDividendDate,PERatio,DividendPayDate,PERatioRealtime,PEGRatio,PriceEPSEstimateCurrentYear,PriceEPSEstimateNextYear,Symbol,SharesOwned,ShortRatio,LastTradeTime,TickerTrend,OneyrTargetPrice,Volume,HoldingsValue,HoldingsValueRealtime,YearRange,DaysValueChange,DaysValueChangeRealtime,StockExchange,DividendYield\'"},"javascript":{"execution-start-time":"498","execution-stop-time":"702","execution-time":"203","instructions-used":"106000","table-name":"yahoo.finance.quotes"},"user-time":"711","service-time":"50","build-version":"0.2.386"},"results":{"quote":[{"symbol":"^NDX","Ask":null,"AverageDailyVolume":null,"Bid":null,"AskRealtime":null,"BidRealtime":null,"BookValue":"0.00","Change_PercentChange":"+73.11 - +1.85%","Change":"+73.11","Commission":null,"Currency":"USD","ChangeRealtime":null,"AfterHoursChangeRealtime":null,"DividendShare":null,"LastTradeDate":"2/10/2016","TradeDate":null,"EarningsShare":null,"ErrorIndicationreturnedforsymbolchangedinvalid":null,"EPSEstimateCurrentYear":null,"EPSEstimateNextYear":null,"EPSEstimateNextQuarter":"0.00","DaysLow":"3978.60","DaysHigh":"4045.48","YearLow":"3787.23","YearHigh":"4739.75","HoldingsGainPercent":null,"AnnualizedGain":null,"HoldingsGain":null,"HoldingsGainPercentRealtime":null,"HoldingsGainRealtime":null,"MoreInfo":null,"OrderBookRealtime":null,"MarketCapitalization":null,"MarketCapRealtime":null,"EBITDA":null,"ChangeFromYearLow":"233.69","PercentChangeFromYearLow":"+6.17%","LastTradeRealtimeWithTime":null,"ChangePercentRealtime":null,"ChangeFromYearHigh":"-718.83","PercebtChangeFromYearHigh":"-15.17%","LastTradeWithTime":"1:45pm - <b>4020.92</b>","LastTradePriceOnly":"4020.92","HighLimit":null,"LowLimit":null,"DaysRange":"3978.60 - 4045.48","DaysRangeRealtime":null,"FiftydayMovingAverage":null,"TwoHundreddayMovingAverage":null,"ChangeFromTwoHundreddayMovingAverage":null,"PercentChangeFromTwoHundreddayMovingAverage":null,"ChangeFromFiftydayMovingAverage":null,"PercentChangeFromFiftydayMovingAverage":null,"Name":"NASDAQ-100","Notes":null,"Open":"3996.77","PreviousClose":"3947.80","PricePaid":null,"ChangeinPercent":"+1.85%","PriceSales":null,"PriceBook":null,"ExDividendDate":null,"PERatio":null,"DividendPayDate":null,"PERatioRealtime":null,"PEGRatio":"0.00","PriceEPSEstimateCurrentYear":null,"PriceEPSEstimateNextYear":null,"Symbol":"^NDX","SharesOwned":null,"ShortRatio":null,"LastTradeTime":"1:45pm","TickerTrend":null,"OneyrTargetPrice":null,"Volume":"0","HoldingsValue":null,"HoldingsValueRealtime":null,"YearRange":"3787.23 - 4739.75","DaysValueChange":null,"DaysValueChangeRealtime":null,"StockExchange":"NIM","DividendYield":null,"PercentChange":"+1.85%"},{"symbol":"INDU","Ask":null,"AverageDailyVolume":null,"Bid":null,"AskRealtime":null,"BidRealtime":null,"BookValue":null,"Change_PercentChange":null,"Change":null,"Commission":null,"Currency":null,"ChangeRealtime":null,"AfterHoursChangeRealtime":null,"DividendShare":null,"LastTradeDate":null,"TradeDate":null,"EarningsShare":null,"ErrorIndicationreturnedforsymbolchangedinvalid":null,"EPSEstimateCurrentYear":null,"EPSEstimateNextYear":null,"EPSEstimateNextQuarter":null,"DaysLow":null,"DaysHigh":null,"YearLow":null,"YearHigh":null,"HoldingsGainPercent":null,"AnnualizedGain":null,"HoldingsGain":null,"HoldingsGainPercentRealtime":null,"HoldingsGainRealtime":null,"MoreInfo":null,"OrderBookRealtime":null,"MarketCapitalization":null,"MarketCapRealtime":null,"EBITDA":null,"ChangeFromYearLow":null,"PercentChangeFromYearLow":null,"LastTradeRealtimeWithTime":null,"ChangePercentRealtime":null,"ChangeFromYearHigh":null,"PercebtChangeFromYearHigh":null,"LastTradeWithTime":null,"LastTradePriceOnly":null,"HighLimit":null,"LowLimit":null,"DaysRange":null,"DaysRangeRealtime":null,"FiftydayMovingAverage":null,"TwoHundreddayMovingAverage":null,"ChangeFromTwoHundreddayMovingAverage":null,"PercentChangeFromTwoHundreddayMovingAverage":null,"ChangeFromFiftydayMovingAverage":null,"PercentChangeFromFiftydayMovingAverage":null,"Name":null,"Notes":null,"Open":null,"PreviousClose":null,"PricePaid":null,"ChangeinPercent":null,"PriceSales":null,"PriceBook":null,"ExDividendDate":null,"PERatio":null,"DividendPayDate":null,"PERatioRealtime":null,"PEGRatio":null,"PriceEPSEstimateCurrentYear":null,"PriceEPSEstimateNextYear":null,"Symbol":"INDU","SharesOwned":null,"ShortRatio":null,"LastTradeTime":null,"TickerTrend":null,"OneyrTargetPrice":null,"Volume":null,"HoldingsValue":null,"HoldingsValueRealtime":null,"YearRange":null,"DaysValueChange":null,"DaysValueChangeRealtime":null,"StockExchange":null,"DividendYield":null,"PercentChange":null}]}}}';
			
			var result = subject(sampleResponse);
			
			expect(result).toBe('3996.77');
		});
	});
});