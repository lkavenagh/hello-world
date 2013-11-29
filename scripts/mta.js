var proxyurl = './scripts/mta.php';
var requesturl = 'http://web.mta.info/status/serviceStatus.txt'
var apikey = '01165445e3b0666d030436b417ef1aec';

jQuery(document).ready(function($) {
	$.ajax({
		url : proxyurl,
		type: 'POST',
		data: {
			address: requesturl
		},
		success : function(data) {
			console.log(data);
		},
		error : function(message, a, b) {
			console.log(b);
		}
	});
});