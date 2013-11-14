$(document).ready(function(){
	
	$(".square").mouseenter(function(){
		$( this ).stop().animate({width:'300px'},400);
		$( this ).find("img.menuicon").hide();
		$( this ).find("p.app").css('display', 'inline');
	});
	
	$("img.menuicon").mouseenter(function(){
		$( this ).stop().hide();
	});
	
	$(".square").mouseleave(function(){
		$( this ).stop().animate({width:'45px'}, 400);
		$( this ).find("img.menuicon").show();
		$( this ).find("p.app").hide();
	});
	
	$(".square").click(function(){
		window.location = $(this).find('a').attr('href');
	});
	
});