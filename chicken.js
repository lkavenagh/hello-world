google.load("search", "1");

var number;

function searchComplete(searcher) {
  // Check that we got results
  if (searcher.results && searcher.results.length > 0) {
    // Loop through our results, printing them to the page.
    var results = searcher.results;

    number = 0;
    nextImage(results,number);
    setInterval( function() {
    	number++;
    	if (number==results.length) {
    		number = 0;
    	}
    	$( "#chickenpicture" ).fadeOut('slow', function() {
   			nextImage(results,number);
   			$( "#chickenpicture" ).fadeIn('slow');
   		});
    }, 1500);
  }
}

function OnLoad() {
	var imageSearch = new google.search.ImageSearch();
	imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE,
		google.search.ImageSearch.IMAGESIZE_EXTRA_LARGE);
	imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGETYPE,
		google.search.ImageSearch.IMAGETYPE_PHOTO);
	imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_SAFESEARCH,
		google.search.ImageSearch.SAFESEARCH_STRICT);
	imageSearch.setSearchCompleteCallback(this, searchComplete, [imageSearch]);

	imageSearch.execute("delicious BonChon");
}
google.setOnLoadCallback(OnLoad);

function nextImage($results, $number) {
	var contentDiv = document.getElementById('chickenpicture');
    
	var result = $results[$number];
	
	var imgContainer = document.createElement('div');
	var newImg = document.createElement('img');
	// There is also a result.url property which has the escaped version
	newImg.src = result.tbUrl;
	newImg.setAttribute('width', '256px');
	newImg.setAttribute('height', '200px');
	
	imgContainer.appendChild(newImg);

      // Put our title + image in the content
    contentDiv.innerHTML = '';
    contentDiv.setAttribute
	contentDiv.appendChild(imgContainer);
};