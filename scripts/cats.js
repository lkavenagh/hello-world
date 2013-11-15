var apikey = "AIzaSyA1w6xo6AiJQYhdnkg3UTWcXkoV5YhCXB0";
var cx = "014292974721206889519:zjwkqhcfjuk";
var searchterm = "cute kittens";
var q = "https://www.googleapis.com/customsearch/v1?q=" + searchterm + "&searchType=image&cx=" + cx + "&key=" + apikey;

var number;
var results;
var count;
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
		var imgURLs = [];
		for (i=0; i<count; i++){
			imgURLs.push(results[i]['link']);
		}
		preloadImages(imgURLs);
		setInterval( function() {
   			nextImage(number);
   			number++;

			if (number>=count-1) {
				number = 0;
			};
	    }, 1000);
    });
});

function preloadImages(array) {
	
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        if (i==3) {
        	img.src = array[i].substring(1,array[i].length);
        } else {
        	img.src = array[i];
        }
        
        preloadImages.list.push(img);
    }
    
};

function nextImage(number) {
    
	var imgContainer = document.getElementById('picture');
	
	$( "#picture" ).fadeTo('medium', 0, function() {
		imgContainer.src = preloadImages.list[number].src;
	});
	
	$( "#picture" ).load(function() {
		$( "#picturelabel").html(preloadImages.list[number].src);
	}).error(function() {
		$( "#picturelabel").html("NO IMAGE");
	});
	
	imgContainer.setAttribute('width', '325px');
	imgContainer.setAttribute('height', '200px');

};