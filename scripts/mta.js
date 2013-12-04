var proxyurl = './scripts/mta.php';
var requesturl = 'http://web.mta.info/status/serviceStatus.txt';
var filepath = 'file:///R:/Documents/GitHub/kavenagh-website/serviceStatus.txt';
var apikey = '01165445e3b0666d030436b417ef1aec';

jQuery(document).ready(function($) {
	$.ajax({
		url : proxyurl,
		dataType : 'xml',
		data: {
			requrl: requesturl
		},
		success : function(data) {
			console.log(data['service']);
		},
		error : function(message, a, b) {
			console.log(b);
		}
	});
});