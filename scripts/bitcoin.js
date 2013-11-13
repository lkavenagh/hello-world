jQuery(document).ready(function($) {
	var apikey = 'dea3b122de16ef0e377a94ee58890a3f728b92b119cd0b7609a2cb6399e02891';
	var apiurl = 'https://api.bitcoinaverage.com/';
	
	$.ajax({
		url : apiurl+'ticker/USD',
		beforeSend : function() { console.log('Sending AJAX'); },
		dataType : 'json',
		success : function(data) {
			$('#tradeprice').html(data['last']);
			$('#askprice').html(data['ask']);
			$('#bidprice').html(data['bid']);
		},
		error : function(a,b,c) {
			alert(c);
		}
	});
	
	setInterval( function() {
		$.ajax({
			url : apiurl+'ticker/USD',
			beforeSend : function() { console.log('Sending AJAX'); },
			dataType : 'json',
			success : function(data) {
				$('#tradeprice').html(data['last']);
				$('#askprice').html(data['ask']);
				$('#bidprice').html(data['bid']);
			},
			error : function(a,b,c) {
				alert(c);
			}
		});
	}, 10000);
});