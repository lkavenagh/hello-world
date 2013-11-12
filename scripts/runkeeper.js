var clientId = '9f319ae3b0b84c06907159ff45763a3d';
var clientSecret = '6088f3610b8246919814c69f638d6178';
var authUrl = 'https://runkeeper.com/apps/authorize/';
var accessTokenUrl = 'https://runkeeper.com/apps/token';
var deauthUrl = 'https://runkeeper.com/apps/de-authorize';

jQuery(document).ready(function($) {
	$.ajax({
		url : authUrl,
		type: "POST",
		data: 'client_id=' + clientId + '&response_type=code&redirect_uri=http://kavenagh.com/runkeeper.html',
		dataType : 'jsonp',
		success : function(data) {
			alert(JSON.stringify(data));
		},
		error : function(message, a, b) {
			alert(message.status);
			alert(b);
		}
	});
});