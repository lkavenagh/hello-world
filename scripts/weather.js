jQuery(document).ready(function($) {
	var city;
	var state = '';
	var country;
	var querydata;
	var requesturl;
	var conditionsurl = 'NA';
	var apikey = "818a91d82fc2c53d";
	var tempform = "C";
	
	$("#tempformF").hide(0, function(){});
	
	setTimeout(function() {
		$( "#weatherautotemp" ).click();
	}, 10);
	
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
		$('#conditionsdiv').fadeTo('medium', 0);
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/autoip.json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weatherziptemp" ).click(function() {
		var zip=prompt("Enter a ZIP code","10001");
		$('#conditionsdiv').fadeTo('medium', 0.01);
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/" + zip + ".json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weathercitytemp" ).click(function() {
		var input=prompt("Enter <city>,<country> or <city>,<statecode> for USA","Paris,France");
		var inputSplit = input.split(',');
		$('#conditionsdiv').fadeTo('medium', 0.01);
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/" + inputSplit[1] + "/" + inputSplit[0] + ".json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weatherbktemp" ).click(function() {
		$('#conditionsdiv').fadeTo('medium', 0.01);
		$('#forecastdiv').fadeTo('medium', 0);
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
				$('#conditionsdiv').html("<p>Could not load weather! - click to refresh</p>");
				$('#conditionsdiv').fadeTo('medium', 1);
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
				icon = parsed_json['current_observation']['icon_url'];
				if ($thishandle == "weathercitytemp") {
					$('#conditionsdiv').html("<p><b>Current Conditions</b><br>" + city + ", " + country + ": " + temp + tempform + "<br>Humidity: " + humidity + ", " + weather + '</p>');
				} else {
					$('#conditionsdiv').html("<p><b>Current Conditions</b><br>" + city + ", " + state + " (" + country + "): " + temp + tempform + "<br>Humidity: " + humidity + "<br><img height=30px width=30px src=\'" + icon + '\'>' + weather + '</p>');
				}
				$('#conditionsdiv').fadeTo('medium', 1);
				$('title').html(temp + tempform + ', ' + weather);
			},
			error : function() {
				$('#conditionsdiv').html("Could not load weather! - click to refresh");
				$( '#conditionsdiv' ).fadeTo('medium', 1);
			}
		});
	};
	
	function showForecast($thishandle) {
		$('#forecastdiv').innerHTML = "<p>Loading forecast...</p>";

		var tmp_str1 = "";
		var tmp_str2 = "";
		var tmp_str3 = "";
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
			weather = v['conditions'];
			icon = v['icon_url'];
			tmp_str1 = tmp_str1 + "<br>" + weekday + ", " + month + " " + day;
			tmp_str2 = tmp_str2 + "<br>" + low + " - " + high + tempform;
			tmp_str3 = tmp_str3 + "<br><img height=20px width=20 src=\'" + icon + '\'>' + weather;
		});
		if (state == '') {
			$('#forecastdiv').html("<p><b>Forecast for " + city + ', ' + country + "</b>:");
		} else {
			$('#forecastdiv').html("<p><b>Forecast for " + city + ', ' + state + "</b>:");
		}
		
		$('#forecastdivdate').html("<p>" + tmp_str1 + "</p>");
		$('#forecastdivtemp').html("<p>" + tmp_str2 + "</p>");
		$('#forecastdivcond').html("<p>" + tmp_str3 + "</p>");
		$('#forecastdiv').fadeTo('medium', 1);
			
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
			monthname = v['date']['monthname'];
			day = v['date']['day'];
			weekday = v['date']['weekday'];
			if (year==specyear && month==specmonth && day==specday) {
				found = true;
				if (tempform=='C') {
					high = v['high']['celsius'];
					low = v['low']['celsius'];
				} else {
					high = v['high']['fahrenheit'];
					low = v['low']['fahrenheit'];
				}
				weather = v['conditions'];
				icon = v['icon_url'];
				tmp_str = tmp_str + "<br>" + weekday + ", " + monthname + " " + day + ": " + low + " - " + high + tempform + ', ' + '<img height=20px width=20 src=\'' + icon + '\'>' + weather;
			}
		});
		if (found) {
			$('#forecastdiv').html("<p><b>Forecast for " + city + "</b>" + tmp_str + "</p>");
			$('#forecastdiv').fadeTo('medium', 1);
		} else {
			$('#forecastdiv').html("<p><b>Forecast for " + city + "</b><br>" + specyear + "-" + specmonth + "-" + specday + " Not available!</p>");
			$('#forecastdiv').fadeTo('medium', 1);
		}
	};
});
