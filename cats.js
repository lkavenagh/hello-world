var apikey = "AIzaSyA1w6xo6AiJQYhdnkg3UTWcXkoV5YhCXB0";
var cx = "014292974721206889519:zjwkqhcfjuk";
var searchterm = "cute kittens";
var q = "https://www.googleapis.com/customsearch/v1?q=" + searchterm + "&searchType=image&cx=" + cx + "&key=" + apikey;

var number;
var results;
var count;

jQuery(document).ready(function($) {
	nextImage("http://www.keter.com/files/images/global/themes/7ECC14/product__showcase__loading_animation.gif");
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
	    	$( "#chickenpicture" ).fadeTo('medium', 0, function() {
	   			nextImage(results[number]['link']);
	   			$( "#chickenpicture" ).fadeTo('medium',1);
	   		});
	   		number++;
	   		while (results[number]['link'].search(/\(/) > -1) {
				number++;
				if (number>=count-1) {
					number = 0;
				};
			}
			if (number>=count-1) {
				number = 0;
			};
	    }, 3000);
    });
});



function nextImage($imgurl) {
	var contentDiv = document.getElementById('chickenpicture');
    
	var result = $imgurl;
	
	var imgContainer = document.createElement('div');
	var newImg = document.createElement('img');
	
	// There is also a result.url property which has the escaped version
	newImg.src = result;
	newImg.setAttribute('width', '325');
	newImg.setAttribute('height', '200px');
	
	imgContainer.appendChild(newImg);

      // Put our title + image in the content
    contentDiv.innerHTML = '';
    contentDiv.setAttribute
	contentDiv.appendChild(imgContainer);
};