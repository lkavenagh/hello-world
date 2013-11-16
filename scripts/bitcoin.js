jQuery(document).ready(function($) {
	var apikey = 'dea3b122de16ef0e377a94ee58890a3f728b92b119cd0b7609a2cb6399e02891';
	var apiurl = 'https://api.bitcoinaverage.com/';
	var currency = 'USD';
	var oldprices = [0, 0, 0, 0, 0];
	var newprices = [0, 0, 0, 0, 0];
	var timestamp = ['',''];
	var hist_averages_24 = [];
	var hist_averages_AT = [];
	var hist_24_file;
	var hist_AT_file;
	var colors = ['red', 'green', 'black'];
	
	$.when(getCurrentPrices()).done(function() {
		displayPrices(oldprices, newprices);
	});
	
	$.when(getHistoricalPrices()).done(function() {
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
					hist_averages_24[k] = [];
					hist_averages_24[k][0] = new Date(v['datetime'] + ' GMT+0500');
					hist_averages_24[k][1] = v['average'];
				});
				$.plot($('#placeholder24'), [hist_averages_24], {
					xaxis : {
						mode:'time',
						timeformat: '%d, %H:%M',
						min: hist_averages_24[0][0],
						max: hist_averages_24[hist_averages_24.length-1][0]
					}
				});
			},
			error : function(message, a, b) {
				console.log(b);
			}
		});
		
		$.ajax({
			url : hist_AT_file,
			dataType : 'text',
			success : function(data){
				data = data.replace(/\r/g, "");
				results = $.parse(data, {
					delimiter: ",",
					header: true,
					dynamicTyping: true
				});
				$(results['results']['rows']).each(function(k,v) {
					hist_averages_AT[k] = [];
					hist_averages_AT[k][0] = new Date(v['datetime'] + ' GMT+0500');
					hist_averages_AT[k][1] = v['average'];
				});
				$.plot($('#placeholderAT'), [hist_averages_AT], {
					xaxis : {
						mode:'time',
						timeformat: '%b, \'%y',
						min: hist_averages_AT[0][0],
						max: hist_averages_AT[hist_averages_AT.length-1][0]
					}
				});
			},
			error : function(message, a, b) {
				console.log(b);
			}
		});
	});
	
	setInterval( function() {
		$.when(getCurrentPrices()).done(function() {
			displayPrices(oldprices, newprices);
		});
	}, 10000);
	
	function displayPrices(prices, newprices) {
		k = (newprices[0] > oldprices[0]) ? 1 : (newprices[0] == oldprices[0] ? 2 : 0);
		$('#tradeprice').html('<td>Trade price: </td><td><font color=' + colors[k] + '>$' + newprices[0] + '</font></td>');
		$('title').html(timestamp[1] + ' - $' + newprices[0]);
		
		k = newprices[1] > oldprices[1] ? 1 : (newprices[1] == oldprices[1] ? 2 : 0);
		$('#bidprice').html('<td>Bid price: </td><td><font color=' + colors[k] + '>$' + newprices[1] + '</font></td>');

		k = newprices[2] > oldprices[2] ? 1 : (newprices[2] == oldprices[2] ? 2 : 0);
		$('#askprice').html('<td>Ask price:  </td><td><font color=' + colors[k] + '>$' + newprices[2] + '</font></td>');

		k = newprices[3] > oldprices[3] ? 1 : (newprices[3] == oldprices[3] ? 2 : 0);
		$('#dailyvol').html('24 hour total volume: ' + newprices[3] + ' BTC');

		$('#timestamp').html('Last data received: ' + timestamp[0]);

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
				alert(c);
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
				alert(c);
			}
		});
	}
});