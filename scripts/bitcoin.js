jQuery(document).ready(function($) {
	var apikey = 'dea3b122de16ef0e377a94ee58890a3f728b92b119cd0b7609a2cb6399e02891';
	var apiurl = 'https://api.bitcoinaverage.com/';
	var currency = 'USD';
	var oldprices = [0, 0, 0, 0, 0];
	var newprices = [0, 0, 0, 0, 0];
	var timestamp = ['',''];
	var hist_24_file;
	var hist_AT_file;
	var hist = [];
	var colors = ['red', 'green', 'black'];
	var offset = new Date().getTimezoneOffset()/60;
	var curLen = 1;
	
	$('#1').css('border-style', 'inset');
	
	$("p.hover").hover(function(){
		$( this ).stop().animate({color:"red"},0);
	}, function() {
		$( this ).stop().animate({color:"black"},0);
	});
	
	$('.hover').click(function() {
		$(this).siblings('.hover').css('border-style', 'outset');
		$(this).css('border-style', 'inset');
		curLen = this.attributes['id'].nodeValue;
		$('#labelHourly').html(curLen + '-hour price');
		$.when($('#placeholderHourly').fadeTo('medium', 0.01))
		.then(function() {
			displayHourlyPlot(curLen, 'placeholderHourly');
			$('#placeholderHourly').fadeTo('medium', 1);
		});
	});
	
	$.when(getCurrentPrices()).done(function() {
		displayPrices(oldprices, newprices);
	});
	
	$.when(getHistoricalPrices()).done(function() {
		displayHistPlot(hist_24_file, 'placeholder24');
		displayHistPlot(hist_AT_file, 'placeholderAT');
		displayHourlyPlot(curLen, 'placeholderHourly');
	});
	
	setInterval( function() {
		$.when(getCurrentPrices()).done(function() {
			displayPrices(oldprices, newprices);
			displayHourlyPlot(curLen, 'placeholderHourly');
		});
	}, 30000);
	
	function displayPrices(prices, newprices) {
		k = (newprices[0] > oldprices[0]) ? 1 : (newprices[0] == oldprices[0] ? 2 : 0);
		$('#tradeprice').html('<td>Trade price: </td><td><font color=' + colors[k] + '>$' + newprices[0] + '</font></td>');
		$('title').html(timestamp[1] + ' - $' + newprices[0]);
		
		k = newprices[1] > oldprices[1] ? 1 : (newprices[1] == oldprices[1] ? 2 : 0);
		$('#bidprice').html('<td>Bid price: </td><td><font color=' + colors[k] + '>$' + newprices[1] + '</font></td>');

		k = newprices[2] > oldprices[2] ? 1 : (newprices[2] == oldprices[2] ? 2 : 0);
		$('#askprice').html('<td>Ask price:  </td><td><font color=' + colors[k] + '>$' + newprices[2] + '</font></td>');

		k = newprices[3] > oldprices[3] ? 1 : (newprices[3] == oldprices[3] ? 2 : 0);
		$('#dailyvol').html('<p>24 hour total volume: ' + newprices[3] + ' BTC</p>');

		$('#timestamp').html('<p>Last data received: ' + timestamp[0] + '</p>');

		oldprices = newprices.slice(0);
	}
	
	function getCurrentPrices() {
		return $.ajax({
			url : apiurl+'ticker/' + currency,
			dataType : 'json',
			success : function(data) {
				newprices[0] = data['last'];
				newprices[1] = data['bid'];
				newprices[2] = data['ask'];
				newprices[3] = data['total_vol'];
				var date = new Date(data['timestamp'].substring(0, data['timestamp'].length-5) + ' UTC');
				
				timestamp[0] = date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ', ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
				timestamp[1] = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
			},
			error : function(message,b,c) {
				$('#tradeprice').html('BitcoinAverage.com is down.');
				$('title').html('BitcoinAverage.com is down.');
			}
		});
	}
	
	function getHistoricalPrices() {
		return $.ajax({
			url : apiurl + 'history/' + currency,
			dataType : 'json',
			success : function(data) {
				hist_24_file = data['24h_sliding'];
				hist_AT_file = data['all_time'];
			},
			error : function(message, b, c) {
				console.log(message);
			}
		});
	}
	
	function displayHistPlot(thisurl, thishandle) {
		hist = [];
		offsetstr = ('GMT' + sign(offset) + ('0' + offset).slice(-2) + '00');
		$.ajax({
			url : thisurl,
			dataType : 'text',
			success : function(data){
				data = data.replace(/\r/g, "");
				results = $.parse(data, {
					delimiter: ",",
					header: true,
					dynamicTyping: true
				});
				$(results['results']['rows']).each(function(k,v) {
					hist[k] = [];
					hist[k][0] = new Date(v['datetime'] + ' ' + offsetstr);
					hist[k][1] = v['average'];
				});
				if (thishandle=='placeholder24') {
					tf = '%H:%M';
				} else {
					tf = '%b \'%y';
				}
				$.plot($('#' + thishandle), [hist], {
					xaxis : {
						mode:'time',
						timeformat: tf,
						min: hist[0][0],
						max: hist[hist.length-1][0]
					}
				});
			},
			error : function(message, a, b) {
				console.log(message);
			}
		});
	};
	
	function displayHourlyPlot(len, thishandle) {
		compTime = new Date().setHours(new Date().getHours() - len - offset);
		thisHist = [];
		$.ajax({
			url : hist_24_file,
			dataType : 'text',
			success : function(data){
				data = data.replace(/\r/g, "");
				results = $.parse(data, {
					delimiter: ",",
					header: true,
					dynamicTyping: true
				});
				
				$(results['results']['rows']).each(function(k,v) {
					hist[k] = [];
					hist[k][0] = new Date(v['datetime'] + ' ' + offsetstr);
					hist[k][1] = v['average'];
				});
				
				k = 0;
				for (i=0; i<hist.length-1; i++) {
					if (hist[i][0].getTime() > compTime) {
						thisHist[k] = [];
						thisHist[k][0] = hist[i][0];
						thisHist[k][1] = hist[i][1];
						k++;
					}
				};
				
				$.plot($('#' + thishandle), [thisHist], {
					xaxis : {
						mode:'time',
						timeformat: '%H:%M',
						min: thisHist[0][0],
						max: thisHist[thisHist.length-1][0]
					}
				});
			},
			error : function(message, a, b) {
				console.log(message);
			}
		});
	};
	
	function sign(x) { return x > 0 ? '+' : x < 0 ? '-' : '+'; }
});