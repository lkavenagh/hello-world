$(document).ready(function(){
	$(".square").mouseenter(function(){
		$( this ).stop().animate({width:'300px'},300, function() {
			$( this ).find("pdis").stop().animate({opacity:'0'},0);
		});
		$( this ).find("papp").stop().animate({opacity:'1'},0);
	});
	$("pdis").mouseenter(function(){
		$( this ).stop().animate({opacity:'0'},0);
	});
	
	$(".square").mouseleave(function(){
		$( this ).stop().animate({width:'45px'}, 300, function() {
			$( this ).find("pdis").stop().animate({opacity:'1'},0);
		});
		$( this ).find("papp").stop().animate({opacity:'0'},300);
	});
	
	$(".square").click(function(){
		window.location = $(this).find('a').attr('href');
	});
});