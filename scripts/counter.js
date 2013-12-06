var counterurl = './scripts/counter.php';

jQuery(document).ready(function($) {
	updateCounter();
	setTimeout(function() {
		updateCounter();
	}, 2000);
	function updateCounter() {
		$.ajax({
			url:counterurl,
			success: function(data) {
				data = $.parseJSON(data);
				$('#counter_all').html(data.all);
				$('#counter_page').html(data.page);
				$('#counter_user').html(data.user);
			}
		});
	}
});
