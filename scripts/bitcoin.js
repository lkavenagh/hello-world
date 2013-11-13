jQuery(document).ready(function($) {
	var apikey = 'dea3b122de16ef0e377a94ee58890a3f728b92b119cd0b7609a2cb6399e02891';
	var apiurl = 'https://coinbase.com/api/v1/';
	
	$.ajax({
		url : apiurl + 'prices/spot_rate',
		success : function(data) { alert(data); },
		error : function(message, a, b) { alert(message.status + ' ' + b); }
	});
});