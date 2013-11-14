jQuery(document).ready(function($) {
	var apikey = 'dea3b122de16ef0e377a94ee58890a3f728b92b119cd0b7609a2cb6399e02891';
	var apiurl = 'https://api.bitcoinaverage.com/';
	var currency = 'USD';
	var oldprices = [0, 0, 0, 0, 0];
	var newprices = [0, 0, 0, 0, 0];
	var colors = ['red', 'green', 'black'];
	
	$.when(getCurrentPrices()).done(function() {
		displayPrices(oldprices, newprices);
	});
	
	setInterval( function() {
		$.when(getCurrentPrices()).done(function() {
			displayPrices(oldprices, newprices);
		});
	}, 10000);
	
	function displayPrices(prices, newprices) {
		k = (newprices[0] > oldprices[0]) ? 1 : (newprices[0] == oldprices[0] ? 2 : 0);
		$('#tradeprice').html('<td>Trade price: </td><td><font color=' + colors[k] + '>$' + newprices[0] + '</font></td>');

		k = newprices[1] > oldprices[1] ? 1 : (newprices[1] == oldprices[1] ? 2 : 0);
		$('#bidprice').html('<td>Bid price: </td><td><font color=' + colors[k] + '>$' + newprices[1] + '</font></td>');

		k = newprices[2] > oldprices[2] ? 1 : (newprices[2] == oldprices[2] ? 2 : 0);
		$('#askprice').html('<td>Ask price:  </td><td><font color=' + colors[k] + '>$' + newprices[2] + '</font></td>');

		k = newprices[3] > oldprices[3] ? 1 : (newprices[3] == oldprices[3] ? 2 : 0);
		$('#dailyvol').html('24 hour total volume: ' + newprices[3] + ' BTC');

		k = newprices[4] > oldprices[4] ? 1 : (newprices[4] == oldprices[4] ? 2 : 0);
		$('#timestamp').html('Last data received: ' + newprices[4]);

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
				
				newprices[4] = date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ', ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
			},
			error : function(message,b,c) {
				alert(c);
			}
		});
	}
});