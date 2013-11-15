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
		console.log(count);
		for (i=0; i<count; i++){
			console.log(results[i]['link']);
			imgURLs.push(results[i]['link']);
			console.log(imgURLs[i]);
		}
		preloadImages(imgURLs);
		setInterval( function() {
	    	$( "#picture" ).fadeTo('medium', 0, function() {
	   			nextImage(results[number]['link']);
	   		});
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
        img.src = array[i];
        preloadImages.list.push(img);
    }
    
};

function nextImage($imgurl) {
	var contentDiv = document.getElementById('picture');
    
	var result = $imgurl;
	
	var imgContainer = document.createElement('div');
	
	newImg = document.createElement('img');
	newImg.src = result;

	// There is also a result.url property which has the escaped version
	newImg.setAttribute('width', '325');
	newImg.setAttribute('height', '200px');
	
	imgContainer.appendChild(newImg);

      // Put our title + image in the content
    contentDiv.innerHTML = '';
    contentDiv.setAttribute;
	contentDiv.appendChild(imgContainer);
	$( "#picturelabel").html(newImg.src);
	$( "#picture" ).fadeTo('medium',1);
};