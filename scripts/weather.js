jQuery(document).ready(function($) {
	var city;
	var state;
	var country;
	var requesturl;
	var conditionsurl = 'NA';
	var apikey = "818a91d82fc2c53d";
	var tempform = "C";
	
	jQuery('body').ajaxStart(function(){
	    alert( "ajaxStart" );
	  }).ajaxStop(function(){
	    alert( "ajaxStop" );
	  }).ajaxSend(function(){
	    alert( "ajaxSend" );
	  }).ajaxComplete(function(){
	    alert( "ajaxComplete" );
	  }).ajaxError(function(){
	    alert( "ajaxError" );
	  }).ajaxSuccess(function(){
	    alert( "ajaxSuccess" );
	  });
	
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
		showWeatherReport("http://api.wunderground.com/api/" + apikey + "/geolookup/q/11222.json", this.attributes.item(0).nodeValue);
	});
	
	function showWeatherReport($thisurl, $thishandle, specdate) {
		var promise = getUrlForLocation($thisurl);

		if ($thishandle=="weatherbktemp") {
			promise.done(function() {
				showConditions($thishandle);
				showConditionsDate($thishandle, "2013-11-28");
			});
		} else {
			promise.done(function() {
				showConditions($thishandle);
				showForecast($thishandle);
			});
		};
	}
	
	function getUrlForLocation($thisurl) {
		var dfd = new $.Deferred();
		$.ajax({
			url : $thisurl,
			dataType : "jsonp",
			beforeSend : function() { alert("getUrlForLocation.beforeSend"); },
			success : function(parsed_json) {
				city = parsed_json['location']['city'];
				state = parsed_json['location']['state'];
				country = parsed_json['location']['country_name'];
				if (country!="USA") {
					conditionsurl = "http://api.wunderground.com/api/" + apikey + "/conditions/q/" + country.replace(/\s/gi, "_") + "/" + city.replace(/\s/gi, "_") + ".json";
				} else {
					conditionsurl = "http://api.wunderground.com/api/" + apikey + "/conditions/q/" + state.replace(/\s/gi, "_") + "/" + city.replace(/\s/gi, "_") + ".json";
				}
				dfd.resolve();
			},
			error: function() {
				document.getElementById($thishandle).innerHTML = "<p>Could not load weather! - click to refresh</p>";
				$( "#" + $thishandle ).fadeTo('medium', 1);
			}
		});
		return dfd.promise();
	};
	
	function showConditions($thishandle) {
		$.ajax({
			url : conditionsurl,
			dataType : "jsonp",
			beforeSend : function() { alert("showConditions.beforeSend"); },
			success : function(parsed_json) {
				if (tempform=="C") {
					temp = parsed_json['current_observation']['temp_c'];
				} else {
					temp = parsed_json['current_observation']['temp_f'];
				}
				humidity = parsed_json['current_observation']['relative_humidity'];
				weather = parsed_json['current_observation']['weather'];
				if ($thishandle == "weathercitytemp") {
					document.getElementById($thishandle).innerHTML = "<p><b>Current Conditions (click to refresh)</b><br>" + city + ", " + country + ": " + temp + tempform + "<br>Humidity: " + humidity + ", " + weather + "</p>";
				} else {
					document.getElementById($thishandle).innerHTML = "<p><b>Current Conditions (click to refresh)</b><br>" + city + ", " + state + " (" + country + "): " + temp + tempform + "<br>Humidity: " + humidity + ", " + weather + "</p>";
				}
				$( "#" + $thishandle ).fadeTo('medium', 1);
			},
			error : function() {
				document.getElementById($thishandle).innerHTML = "<p>Could not load weather! - click to refresh</p>";
				$( "#" + $thishandle ).fadeTo('medium', 1);
			}
		});
	};
	
	function showForecast($thishandle) {
		document.getElementById($thishandle).innerHTML = "<p>Loading forecast...</p>";
		$.when(
			$.ajax({
				url : "http://api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state + "/" + city + ".json",
				dataType : "jsonp",
				beforeSend : function() { alert("showForecast1.beforeSend"); },
				success : function(parsed_json) {
					if(parsed_json["forecast"]==undefined) {
						requesturl = "http://api.wunderground.com/api/" + apikey + "/forecast10day/q/" + country + "/" + city + ".json";
					} else {
						requesturl = "http://api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state + "/" + city + ".json";
					}
				}
			})
		).then( function() {
			$.ajax({
				url : requesturl,
				dataType : "jsonp",
				beforeSend : function() { alert("showForecast2.beforeSend"); },
				success : function(parsed_json) {
					var tmp_str = "";
					data = parsed_json['forecast']['simpleforecast']['forecastday'];
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
				},
				error : function() {
					document.getElementById($thishandle).innerHTML = "<p>Could not load weather! - click to refresh</p>";
					$( "#" + $thishandle ).fadeTo('medium', 1);
				}
			});
		});
	};
	
	function showConditionsDate($thishandle, specdate) {
		var specyear = specdate[0]+specdate[1]+specdate[2]+specdate[3];
		var specmonth = specdate[5]+specdate[6];
		var specday = specdate[8]+specdate[9];
		var found = false;
		$.when(
			$.ajax({
				url : "http://api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state + "/" + city + ".json",
				dataType : "jsonp",
				beforeSend : function() { alert("showConditionsDate1.beforeSend"); },
				success : function(parsed_json) {
					if(parsed_json["forecast"]==undefined) {
						requesturl = "http://api.wunderground.com/api/" + apikey + "/forecast10day/q/" + country + "/" + city + ".json";
					} else {
						requesturl = "http://api.wunderground.com/api/" + apikey + "/forecast10day/q/" + state + "/" + city + ".json";
					}
				}
			})
		).then( function() {
			$.ajax({
				url : requesturl,
				dataType : "jsonp",
				beforeSend : function() { alert("showConditionsDate2.beforeSend"); },
				success : function(parsed_json) {
					var tmp_str = "";
					data = parsed_json['forecast']['simpleforecast']['forecastday'];
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
				},
				error : function() {
					document.getElementById($thishandle).innerHTML = "<p>Could not load weather! - click to refresh</p>";
					$( "#" + $thishandle ).fadeTo('medium', 1);
				}
			});
		});
	};
});