$(document).ready(function() {
	
	$("#button1").click(function() {
		var nums = new Array();
		nums[0] = parseInt($("#num1").val());
		nums[1] = parseInt($("#num2").val());
				
		
		if (isNaN(nums[0]) || isNaN(nums[1])) {
			$("#resultid1").html("Invalid input!");
		} else {
			$("#resultid1").html(mySum(nums));
		}
	});
	
	$("#button2").click(function() {
		var time = $("#time").val();
		
		$("#resultid2").html(getClockAngle(time));
		
	});
	
	$("#button3").click(function() {
		var prime = $("#prime").val();
		
		$("#resultid3").html(parseInt(isPrime(prime)));
		
	});
		
	var images = ["http://critterbabies.com/wp-content/gallery/kittens/803864926_1375572583.jpg", "http://critterbabies.com/wp-content/gallery/kittens/cats-animals-kittens-background-us.jpg", "http://images4.fanpop.com/image/photos/16100000/Cute-Kitten-kittens-16122946-1280-800.jpg"];
	
	var intId = null;
	$("#startCarousel").click(function() {
		var imgNum = 1;
		changeImage(images,0);
		intId = setInterval(function(){
			changeImage(images,imgNum);
			imgNum++;
			if (imgNum >= images.length) { imgNum = 0; }
		}, 1000);
	});
	
	$("#stopCarousel").click(function() {
		clearInterval(intId);
	});
});

function mySum(nums) {
	return nums.reduce(function(previousValue, currentValue, index, array) {
		return previousValue + currentValue;
	});
};

function getClockAngle(time) {
	var tokens = time.split(":");
	if (tokens[0] > 12) { tokens[0] = tokens[0]-12; }
	var hourPos = (parseInt(tokens[0])*5) + ((parseInt(tokens[1])/60)*5);
	var minPos = parseInt(tokens[1]);
	
	var angle = Math.max(hourPos, minPos) - Math.min(hourPos, minPos);
	
	angle = (angle / 60) * 360;
	
	console.log(hourPos);
	console.log(minPos);
	return angle;
};

function changeImage(images, imgNum) {
	document.getElementById("carousel").src = images[imgNum];
};

function isPrime(prime) {
	if (prime <= 2) { return 1; }
	
	for (var i = 2; i <= Math.sqrt(prime); i++) {
		if (prime % i == 0) {
			return 0;
		}
	}
	
	return 1;
}