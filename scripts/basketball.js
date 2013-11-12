jQuery(document).ready(function($) {
	var apikey = "dc5453aa-f26c-4aa5-b4b8-7928a23481e8";
	var requesturl = 'https://erikberg.com/';
	var data;
	var stats;
	
	promise = getBoxScore();
	
	function getBoxScore(team_id) {
		var dfd = new $.Deferred();
		var year = '2013';
		var month = '11';
		var day = '12';
		$.ajax({
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization', 'Bearer ' + apikey);
			},
			url : 'https://erikberg.com/events.json',
			dataType : 'json',
			success : function(data) {
				alert(JSON.parse(data));
			},
			error : function(message, a, b) {
				alert(message.status);
				alert(b);
			}
		});
		return dfd.promise();
	};
});