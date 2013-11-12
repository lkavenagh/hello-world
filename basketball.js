jQuery(document).ready(function($) {
	var apikey = "h929gbvuzqbtqpck6dx53kph";
	var secret = "ZyFS2H6KcyPjwqt4MgtcVje3";
	var data;
	var stats;
	
	promise = getTeamsList();
	promise.done(function() {
		var str = '<p>';
		$(data).each( function(index) {
			str = str + "<br><a href=" + data[index]['links']['web']['teams']['href'] + "><font color=" + data[index]['color'] + ">" + data[index]['name'] + "</font></a>";
		});
		document.getElementById('teams').innerHTML = str + '</p>';
	});
	
	function getTeamsList() {
		var dfd = new $.Deferred();
		$.ajax({
			url : "http://api.espn.com/v1/sports/basketball/nba/teams?apikey=" + apikey,
			dataType : "jsonp",
			success : function(parsed_json) {
				data = parsed_json['sports'][0]['leagues'][0]['teams'];
				dfd.resolve();
			}
		});
		return dfd.promise();
	};
});