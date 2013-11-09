jQuery(document).ready(function($) {
	var location;
	var state;
	var country;
	var requesturl;
	var apikey = "91f86ce5a898ddbc";
	
	$( "#weatherautotemp" ).click(function() {
		$( this ).fadeTo('medium', 0);
		showTemp("http://api.wunderground.com/api/" + apikey + "/geolookup/q/autoip.json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weatherziptemp" ).click(function() {
		var zip=prompt("Enter a ZIP code","10001");
		$( this ).fadeTo('medium', 0.01);
		showTemp("http://api.wunderground.com/api/" + apikey + "/geolookup/q/" + zip + ".json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weathercitytemp" ).click(function() {
		var input=prompt("Enter <city>,<country> or <city>,<statecode> for USA","Paris,France");
		var inputSplit = input.split(',');
		$( this ).fadeTo('medium', 0.01);
		showTemp("http://api.wunderground.com/api/" + apikey + "/geolookup/q/" + inputSplit[1] + "/" + inputSplit[0] + ".json", this.attributes.item(0).nodeValue);
	});
	
	$( "#weatherbktemp" ).click(function() {
		$( this ).fadeTo('medium', 0.01);
		$( "#weatherbkfc" ).fadeTo('medium', 0.01);
		showTemp("http://api.wunderground.com/api/" + apikey + "/geolookup/q/11222.json", this.attributes.item(0).nodeValue);
		showTemp("http://api.wunderground.com/api/" + apikey + "/geolookup/q/11222.json", 'weatherbkfc');
	});
	
	function showTemp($thisurl, $thishandle) {
		if ($thishandle == "weatherbkfc") {
			$.ajax({
				url : "http://api.wunderground.com/api/" + apikey + "/forecast10day/q/NY/Brooklyn.json",
				dataType : "jsonp",
				success : function(parsed_json) {
					var tmp_str = "";
					for (var i=0; i<parsed_json['forecast']['simpleforecast']['forecastday'].length; i++) {
						month = parsed_json['forecast']['simpleforecast']['forecastday'][i]['date']['monthname'];
						day = parsed_json['forecast']['simpleforecast']['forecastday'][i]['date']['day'];
						weekday = parsed_json['forecast']['simpleforecast']['forecastday'][i]['date']['weekday'];
						highC = parsed_json['forecast']['simpleforecast']['forecastday'][i]['high']['celsius'];
						highF = parsed_json['forecast']['simpleforecast']['forecastday'][i]['high']['fahrenheit'];
						tmp_str = tmp_str + "<br>" + weekday + ", " + month + " " + day + ": " + highF + "F / " + highC + "C";
					}
					document.getElementById($thishandle).innerHTML = "<p><b>Forecast</b>" + tmp_str + "</p>";
					//$( "#" + $thishandle ).fadeTo('medium', 1);
				},
				error : function() {
					document.getElementById($thishandle).innerHTML = "<p>Could not load weather! - click to refresh</p>";
					$( "#" + $thishandle ).fadeTo('medium', 1);
				}
			});
			return;
		}
		$.when(
			$.ajax({
				url : $thisurl,
				dataType : "jsonp",
				success : function(parsed_json) {
					city = parsed_json['location']['city'];
					state = parsed_json['location']['state'];
					country = parsed_json['location']['country_name'];
					if ($thishandle == "weathercitytemp") {
						if (country=="USA") {
							requesturl = "http://api.wunderground.com/api/" + apikey + "/conditions/q/" + state.replace(/\s/gi, "_") + "/" + city.replace(/\s/gi, "_") + ".json";
						} else {
							requesturl = "http://api.wunderground.com/api/" + apikey + "/conditions/q/" + country.replace(/\s/gi, "_") + "/" + city.replace(/\s/gi, "_") + ".json";
						}
					} else {
						requesturl = parsed_json['location']['requesturl'];
						requesturl = jQuery.trim(requesturl).substring(0,requesturl.length-4);
						requesturl = "http://api.wunderground.com/api/" + apikey + "/conditions/q/" + requesturl + "json";
					}
				}
			})
		).then( function(){
			$.ajax({
				url : requesturl,
				dataType : "jsonp",
				success : function(parsed_json) {
					temp_f = parsed_json['current_observation']['temp_f'];
					temp_c = parsed_json['current_observation']['temp_c'];
					humidity = parsed_json['current_observation']['relative_humidity'];
					weather = parsed_json['current_observation']['weather'];
					if ($thishandle == "weathercitytemp") {
						document.getElementById($thishandle).innerHTML = "<p><b>Current Conditions (click to refresh)</b><br>" + city + ", " + country + ": " + temp_f + "F / " + temp_c + "C<br>    Humidity: " + humidity + ", " + weather + "</p>";
					} else {
						document.getElementById($thishandle).innerHTML = "<p><b>Current Conditions (click to refresh)</b><br>" + city + ", " + state + " (" + country + "): " + temp_f + "F / " + temp_c + "C<br>    Humidity: " + humidity + ", " + weather + "</p>";
					}
					$( "#" + $thishandle ).fadeTo('medium', 1);
					$( "#weatherbkfc" ).fadeTo('medium', 1);
				},
				error : function() {
					document.getElementById($thishandle).innerHTML = "<p>Could not load weather! - click to refresh</p>";
					$( "#" + $thishandle ).fadeTo('medium', 1);
				}
			});
		});
	}
});