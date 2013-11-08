jQuery(document).ready(function($) {
	var city;
	var state;
	var country;
	var requesturl;
	var temp_f;
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
	
	function showTemp($thisurl, $thishandle) {
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
					if ($thishandle == "weathercitytemp") {
						document.getElementById($thishandle).innerHTML = "<p>" + city + ", " + country + ": " + temp_f + "F / " + temp_c + "C</p>";
					} else {
						document.getElementById($thishandle).innerHTML = "<p>" + city + ", " + state + " (" + country + "): " + temp_f + "F / " + temp_c + "C</p>";
					}
					$( "#" + $thishandle ).fadeTo('medium', 1);
				},
				error : function() {
					document.getElementById($thishandle).innerHTML = "<p>Could not load weather!</p>";
					$( "#" + $thishandle ).fadeTo('medium', 1);
				}
			});
		});
	}
});