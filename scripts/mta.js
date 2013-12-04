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
			$('#mtafeed').html('<p>' + $(xmlDoc).find('service').find('timestamp').text() + '</p><br>');
			$(xmlDoc).find('service').find('subway').find('line').each(function() {
				name = $(this).find('name').text();
				if($(this).find('status').text() != 'GOOD SERVICE') {
					col = '<font color=\'red\'>';
					statusStr = $(this).find('status').text() + ' - ' + $(this).find('text').text() + '</font>';
				} else {
					col = '<font color=\'green\'>';
					statusStr = $(this).find('status').text() + '</font>';
				}
				$('#mtafeed').html($('#mtafeed').html() + '<tr><td>' + name + '</td><td>' + col + statusStr + '</td></tr>');
			});
		},
		error : function(message, a, b) {
			console.log(b);
		}
	});
});
