var apikey = "AIzaSyA1w6xo6AiJQYhdnkg3UTWcXkoV5YhCXB0";

jQuery(document).ready(function($) {
	loadScript();

	$( '#addresssubmit' ).click(function( event ) {
		centerOnAddress(document.getElementById('address').value);
	});
	
	$( '#address' ).keyup(function( e ) {
		var keycode = (window.event) ? e.which : e.keyCode;
		if (keycode == 13) {
			$( '#addresssubmit' ).click();
		};
	});
});

function initialize() {
	var mapOptions = {
	    zoom: 16,
	    center: new google.maps.LatLng(0,0),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	centerOnAddress('190 Freeman St, NYC');
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apikey +'&v=3.exp&sensor=true&' + 'callback=initialize';
  document.body.appendChild(script);
}

function centerOnAddress(address) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}