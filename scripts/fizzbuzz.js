jQuery(document).ready(function($) {
	$("#clicks").html('Click to load numbers');
	
	$("p.hover").hover(function(){
		$( this ).stop().animate({color:"red"},0);
	}, function() {
		$( this ).stop().animate({color:"black"},0);
	});
	
	$('#clicks').click(function(){
		//display numbers
		for (var i=1; i<=100; i++) {
    		$('#numbers').append('<div>'+i+'</div>');
		}
		$("#clicks").html('Click to change multiples of 3');
		$('#clicks').unbind('click');
		$('#clicks').bind('click',function(){
			//change multiples of 3 to fizz
			var c = $('#numbers').children();
			$(c).each(function(k, v) {
				if ((k+1) % 3 == 0) {
					v.innerHTML = 'Fizz';
				}
			});
			$("#clicks").html('Click to change multiples of 5');
			$('#clicks').bind('click',function(){
				//change multiples of 5 to buzz (append if already fizz)
				var c = $('#numbers').children();
				$(c).each(function(k, v) {
					if ((k+1) % 5 == 0) {
						if (v.innerHTML == 'Fizz') {
							v.innerHTML = 'FizzBuzz';
						} else {
							v.innerHTML = 'Buzz';
						}
					}
				});
				$("#clicks").html('Click to reset');
				$('#clicks').bind('click',function(){
					location.reload();
				});
			});
		});
	});
});