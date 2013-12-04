var proxyurl = './scripts/mta.php';
var requesturl = 'http://web.mta.info/status/serviceStatus.txt';
var apikey = '01165445e3b0666d030436b417ef1aec';

jQuery(document).ready(function($) {
	$.ajax({
		url : proxyurl,
		dataType : 'text',
		data: {
			requrl: requesturl
		},
		success : function(data) {
			xmlDoc = $.parseXML( data );
			console.log($(xmlDoc).find('service').find('timestamp').text());
		},
		error : function(message, a, b) {
			console.log(b);
		}
	});
});
