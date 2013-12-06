var proxyurl = './scripts/proxy.php';
var requesturl = 'http://web.mta.info/status/serviceStatus.txt';
var apikey = '01165445e3b0666d030436b417ef1aec';

jQuery(document).ready(function($) {
	$('.mtafeed').on('click', '.hover.mtastatus', function() {
		$(this).next('.mtastatusdesc').slideToggle();
	});

	getMTAFeed();
	setInterval( function() {
		getMTAFeed();
	}, 60000);
	
	function getMTAFeed() {
		$.ajax({
			url : proxyurl,
			dataType : 'text',
			data: {
				requrl: requesturl
			},
			success : function(data) {
				xmlDoc = $.parseXML( data );
				updateStatusTable('subway', '#subwayfeed');
				updateStatusTable('LIRR', '#lirrfeed');
				updateStatusTable('bus', '#busfeed');
				updateStatusTable('MetroNorth', '#mnfeed');
			},
			error : function(message, a, b) {
				$('#mtafeed').append('<p> MTA API is down </p>');
			}
		});
	}
	function updateStatusTable(xmlfield, tableid) {
		$(tableid).html('');
		$(xmlDoc).find('service').find(xmlfield).find('line').each(function() {
			name = $(this).find('name').text();
			if($(this).find('status').text() != 'GOOD SERVICE') {
				statusStr = "<div class=\'hover mtastatus\'>" 
					+ '<font color=\'red\'>' 
					+ $(this).find('status').text() 
					+ '</font><br></div><div class=\'mtastatusdesc\'> ' 
					+ $(this).find('text').text() + '</div>';
			} else {
				statusStr = '<font color=\'green\'>' 
					+ $(this).find('status').text() 
					+ '</font>';
			}
			$(tableid).append('<tr><td class=\'col1\'>' 
				+ name 
				+ '</td><td class = \'col2\'>' 
				+ statusStr + '</td></tr>');
			$('#tablefooter').html('Last data received: ' + $(xmlDoc).find('service').find('timestamp').text());
		});
	}
});
