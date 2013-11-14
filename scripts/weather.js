jQuery(document).ready(function($) {
	var city;
	var state;
	var country;
	var querydata;
	var requesturl;
	var conditionsurl = 'NA';
	var apikey = "818a91d82fc2c53d";
	var tempform = "C";
	
	$("#tempformF").hide(0, function(){});
	
	$("#tempformC").click(function() {
		$("#tempformC").slideUp("medium", function(){
			$("#tempformF").slideDown("medium", function(){});
		});
		tempform = "F";
	});
	
	$("#tempformF").click(function() {
		$("#tempformF").slideUp("medium", function(){
			$("#tempformC").slideDown("medium", function(){});
		});
		tempform = "C";
	});
	
	$("p.hover").hover(function(){
		$( this ).stop().animate({color:"red"},0);
	}, function() {
		$( this ).stop().animate({color:"black"},0);
	});
	
	$( "#weatherautotemp" ).click(function() {
		$( this ).fadeTo('medium', 0);
		$( this ).next(".forecastdiv").fadeTo('medium', 0);
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/autoip.json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weatherziptemp" ).click(function() {
		var zip=prompt("Enter a ZIP code","10001");
		$( this ).fadeTo('medium', 0.01);
		$( this ).next(".forecastdiv").fadeTo('medium', 0);
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/" + zip + ".json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weathercitytemp" ).click(function() {
		var input=prompt("Enter <city>,<country> or <city>,<statecode> for USA","Paris,France");
		var inputSplit = input.split(',');
		$( this ).fadeTo('medium', 0.01);
		$( this ).next(".forecastdiv").fadeTo('medium', 0);
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/" + inputSplit[1] + "/" + inputSplit[0] + ".json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weatherbktemp" ).click(function() {
		$( this ).fadeTo('medium', 0.01);
		$( this ).next(".forecastdiv").fadeTo('medium', 0);
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/11222.json", this.attributes.item(0).nodeValue, '2013-11-28');
	});
	
	function showWeatherReport($thisurl, $thishandle, specdate) {
		$.when(getUrlForLocation($thisurl))
		.then( function() {
			$.when(showConditions($thishandle))
			.then(function() { 
				if (specdate==undefined) {
					showForecast($thishandle);
				} else {
					showConditionsDate($thishandle, specdate);
				}
			});
		});
	}
	
	function getUrlForLocation($thisurl) {
		return $.ajax({
			url : $thisurl,
			dataType : "jsonp",
			success : function(parsed_json) {
				city = parsed_json['location']['city'];
				state = parsed_json['location']['state'];
				country = parsed_json['location']['country_name'];
				if (country!="USA") {
					conditionsurl = "http://api.wunderground.com/api/" + apikey + "/conditions/forecast10day/q/" + country.replace(/\s/gi, "_") + "/" + city.replace(/\s/gi, "_") + ".json";
				} else {
					conditionsurl = "http://api.wunderground.com/api/" + apikey + "/conditions/forecast10day/q/" + state.replace(/\s/gi, "_") + "/" + city.replace(/\s/gi, "_") + ".json";
				}
			},
			error: function() {
				$('#' + $thishandle).html("<p>Could not load weather! - click to refresh</p>");
				$( "#" + $thishandle ).fadeTo('medium', 1);
			}
		});
	};
	
	function showConditions($thishandle) {
		return $.ajax({
			url : conditionsurl,
			dataType : "jsonp",
			success : function(parsed_json) {
				if (tempform=="C") {
					querydata = parsed_json;
					temp = querydata['current_observation']['temp_c'];
				} else {
					querydata = parsed_json;
					temp = querydata['current_observation']['temp_f'];
				}
				humidity = parsed_json['current_observation']['relative_humidity'];
				weather = parsed_json['current_observation']['weather'];
				if ($thishandle == "weathercitytemp") {
					$('#' + $thishandle).html("<p><b>Current Conditions (click to refresh)</b><br>" + city + ", " + country + ": " + temp + tempform + "<br>Humidity: " + humidity + ", " + weather + "</p>");
				} else {
					$('#' + $thishandle).html("<p><b>Current Conditions (click to refresh)</b><br>" + city + ", " + state + " (" + country + "): " + temp + tempform + "<br>Humidity: " + humidity + ", " + weather + "</p>");
				}
				$( "#" + $thishandle ).fadeTo('medium', 1);
			},
			error : function() {
				$('#' + $thishandle).html("<p>Could not load weather! - click to refresh</p>");
				$( "#" + $thishandle ).fadeTo('medium', 1);
			}
		});
	};
	
	function showForecast($thishandle) {
		$('#'+$thishandle).next(".forecastdiv").innerHTML = "<p>Loading forecast...</p>";

		var tmp_str = "";
		console.log(querydata);
		data = querydata['forecast']['simpleforecast']['forecastday'];
		$.each(data, function(k,v) {
			month = v['date']['monthname'];
			day = v['date']['day'];
			weekday = v['date']['weekday'];
			if (tempform=="C") {
				high = v['high']['celsius'];
				low = v['low']['celsius'];
			} else {
				high = v['high']['fahrenheit'];
				low = v['low']['fahrenheit'];
			}
			tmp_str = tmp_str + "<br>" + weekday + ", " + month + " " + day + ": " + low + " - " + high + tempform;
		});
		$("#" + $thishandle).next(".forecastdiv").html("<p><b>Forecast for " + city + "</b>" + tmp_str + "</p>");
		$( "#" + $thishandle ).next(".forecastdiv").fadeTo('medium', 1);
			
	};
	
	function showConditionsDate($thishandle, specdate) {
		var specyear = specdate[0]+specdate[1]+specdate[2]+specdate[3];
		var specmonth = specdate[5]+specdate[6];
		var specday = specdate[8]+specdate[9];
		var found = false;
		
		var tmp_str = "";
		data = querydata['forecast']['simpleforecast']['forecastday'];
		$.each(data, function(k,v) {
			year = v['date']['year'];
			month = v['date']['month'];
			day = v['date']['day'];
			if (year==specyear && month==specmonth && day==specday) {
				found = true;
				if (tempform=="C") {
					high = v['high']['celsius'];
					low = v['low']['celsius'];
				} else {
					high = v['high']['fahrenheit'];
					low = v['low']['fahrenheit'];
				}
				tmp_str = tmp_str + "<br>" + weekday + ", " + month + " " + day + ": " + low + " - " + high + tempform;
			}
		});
		if (found) {
			$("#" + $thishandle).next(".forecastdiv").html("<p><b>Forecast for " + city + "</b>" + tmp_str + "</p>");
			$( "#" + $thishandle ).next(".forecastdiv").fadeTo('medium', 1);
		} else {
			$("#" + $thishandle).next(".forecastdiv").html("<p><b>Forecast for " + city + "</b><br>" + specyear + "-" + specmonth + "-" + specday + " Not available!</p>");
			$( "#" + $thishandle ).next(".forecastdiv").fadeTo('medium', 1);
		}
	};
});