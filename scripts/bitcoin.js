jQuery(document).ready(function($) {
	var apikey = 'dea3b122de16ef0e377a94ee58890a3f728b92b119cd0b7609a2cb6399e02891';
	var apiurl = 'https://api.bitcoinaverage.com/';
	var currency = 'USD';
	var prices = [];
	
	$.when(getCurrentPrices()).done(function() {
		$('#tradeprice').html('Trade price: ' + prices[0]);
		$('#bidprice').html('Bid price: ' + prices[1]);
		$('#askprice').html('Ask price: ' + prices[2]);
		$('#dailyavg').html('24 hour average: ' + prices[3]);
		$('#timestamp').html('Last data received: ' + prices[4]);
	});
	
	setInterval( function() {
		$.when(getCurrentPrices()).done(function() {
		$('#tradeprice').html('Trade price: ' + prices[0]);
		$('#bidprice').html('Bid price: ' + prices[1]);
		$('#askprice').html('Ask price: ' + prices[2]);
		$('#dailyavg').html('24 hour average: ' + prices[3]);
		$('#timestamp').html('Last data received: ' + prices[4]);})
	}, 10000);
	
	function getCurrentPrices() {
		return $.ajax({
			url : apiurl+'ticker/' + currency,
			dataType : 'json',
			success : function(data) {
				prices[0] = data['last'];
				prices[1] = data['bid'];
				prices[2] = data['ask'];
				prices[3] = data['24h_avg'];
				var date = new Date(data['timestamp'].substring(0, data['timestamp'].length-5) + ' UTC');
				
				prices[4] = date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ', ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
			},
			error : function(message,b,c) {
				alert(c);
			}
		});
	}
});