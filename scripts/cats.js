var apikey = "AIzaSyA1w6xo6AiJQYhdnkg3UTWcXkoV5YhCXB0";
var cx = "014292974721206889519:zjwkqhcfjuk";
var searchterm = "cute kittens";
var q = "https://www.googleapis.com/customsearch/v1?q=" + searchterm + "&searchType=image&cx=" + cx + "&key=" + apikey;

var number;
var results;
var count;
var loaded = true;
var newImg = document.createElement('img');

jQuery(document).ready(function($) {
	$.when(
		$.ajax({
			url : q,
			dataType : "jsonp",
			success : function(parsed_json) {
				results = parsed_json['items'];
				count = parseInt(parsed_json['queries']['request'][0]['count']);
			},
			error : function() {
				alert("Error");
			}
		})
	).then( function() {
		number = 0;
		setInterval( function() {
	    	$( "#picture" ).fadeTo('medium', 0, function() {
	   			nextImage(results[number]['link']);
	   		});
	   		if (loaded) {
	   			number++;
	   		}

			if (number>=count-1) {
				number = 0;
			};
	    }, 3000);
    });
});



function nextImage($imgurl) {
	var contentDiv = document.getElementById('picture');
    
	var result = $imgurl;
	
	var imgContainer = document.createElement('div');
	
	if (loaded) {
		newImg = document.createElement('img');
		newImg.src = result;
		loaded = false;
	}
	// There is also a result.url property which has the escaped version
	if (newImg.width == 0) {
		return;
	}
	loaded = true;
	newImg.setAttribute('width', '325');
	newImg.setAttribute('height', '200px');
	
	imgContainer.appendChild(newImg);

      // Put our title + image in the content
    contentDiv.innerHTML = '';
    contentDiv.setAttribute
	contentDiv.appendChild(imgContainer);
	$( "#picture" ).fadeTo('medium',1);
};