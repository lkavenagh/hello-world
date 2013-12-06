var apikey = "AIzaSyA1w6xo6AiJQYhdnkg3UTWcXkoV5YhCXB0";
var markers = [];
var map;
var infowindow;

jQuery(document).ready(function($) {
	loadScript();

	$( '#addresssubmit' ).click(function( event ) {
		clearMarkers();
		centerOnAddress(document.getElementById('address').value, true);
	});
	
	$( '#address' ).keyup(function( e ) {
		var keycode = (window.event) ? e.which : e.keyCode;
		if (keycode == 13) {
			$( '#addresssubmit' ).click();
		};
	});
	
	$( '#quickselect1' ).click(function( event ) {
		clearMarkers();
		map.setZoom(15);
		var request = {
			location: new google.maps.LatLng(40.730088,-73.953481),
			radius: 500,
			types: ['bar']
		};
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, buttonCallback);
		map.setCenter(request.location);
	});
	
	$( '#quickselect2' ).click(function( event ) {
		clearMarkers();
		map.setZoom(15);
		var request = {
			location: new google.maps.LatLng(40.758612,-73.973486),
			radius: 500,
			types: ['bar']
		};
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, buttonCallback);
		map.setCenter(request.location);
	});
	
	$( '#quickselect3' ).click(function( event ) {
		clearMarkers();
		var request = {
			location: map.getCenter(),
			bounds: map.getBounds(),
			types: ['bar']
		};
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, buttonCallback);
		map.setCenter(request.location);
	});
});

function createMarker(place) {
	if (infowindow) { infowindow.close(); }
	infowindow = new google.maps.InfoWindow();
	var placeLoc = place.geometry.location;
	
	var request = { reference: place.reference };
	service = new google.maps.places.PlacesService(map);
	
    service.getDetails(request, function(details, status) {
		if (details != null) {
			var image = {
				url: place.icon,
				size: new google.maps.Size(21, 21),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(21, 21)
			};
			var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location,
				icon: image
			});
			markers.push(marker);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent("<div class=\"infowindow-div\">" 
					+ "<b>" + details.name + "</b>"
					+ "<br>"
					+ details.vicinity
					+ "<br>"
					+ "Website: <a href=\'" + details.website + '\'>' + details.website + '</a>' 
					+ "<br>"
					+ "Rating: " + details.rating + '/5'
					+ "</div>");
				infowindow.open(map, this);
			});
		}
    });
}

function buttonCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function initialize() {
	var mapOptions = {
	    zoom: 16,
	    center: new google.maps.LatLng(0,0),
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	centerOnAddress('190 Freeman St, NYC', false);
	
	var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.8902, 151.1759),
      new google.maps.LatLng(-33.8474, 151.2631));
  	map.fitBounds(defaultBounds);
  
	var input = /** @type {HTMLInputElement} */(document.getElementById('pac-input'));
  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
	var searchBox = new google.maps.places.SearchBox(
		/** @type {HTMLInputElement} */(input));
	
	  // Listen for the event fired when the user selects an item from the
	  // pick list. Retrieve the matching places for that item.
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		updateWithSearch(searchBox);
	});
	
	// Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(map, 'bounds_changed', function() {
	  var bounds = map.getBounds();
	  searchBox.setBounds(bounds);
	});
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apikey +'&v=3.exp&sensor=true&libraries=places&' + 'callback=initialize';
  document.body.appendChild(script);
}

function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

function updateWithSearch(searchBox) {
	var places = searchBox.getPlaces();
		
	for (var i = 0, marker; marker = markers[i]; i++) {
	  marker.setMap(null);
	}
	
	// For each place, get the icon, place name, and location.
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0, place; place = places[i]; i++) {
	  var image = {
	    url: place.icon,
	    size: new google.maps.Size(71, 71),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(17, 34),
	    scaledSize: new google.maps.Size(25, 25)
	  };
	
	  // Create a marker for each place.
	  createMarker(place);
	
	  bounds.extend(place.geometry.location);
	}
	
	map.fitBounds(bounds);
	if (map.getZoom() > 20) {
		map.setZoom(16);
	}
}

function centerOnAddress(address, markerTF) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			if (markerTF) {
				var marker = new google.maps.Marker({
					position: map.getCenter(),
					icon: {
					  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
					  scale: 5,
					  title: "Click"
					  },
					draggable: true,
					map: map,
					animation: google.maps.Animation.DROP
				});
				markers.push(marker);
				google.maps.event.addListener(marker, 'click', function() {
					if (infowindow != null) {infowindow.close();}
					infowindow = new google.maps.InfoWindow({
						content: "<div class=\"infowindow-div\">" + address + "</div>",
						maxWidth: 350
					});
					infowindow.open(map,marker);
				});
			}
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}
