$(document).ready(function() {
	var scrollPos;
	var iterator = 0;
	var totalHeight = 0;
	var $entries = $(".italia_entry");

	$entries.each(function() {
		$(this).attr('data-offset', totalHeight);
		var $height = $(this).outerHeight();
		$(this).attr('data-height', $height);
		$height = totalHeight += $height;
		$('body').css('min-height', $height);
		$(this).css('z-index', 4 - iterator++);
	});
	iterator = 0;

	window.addEventListener('scroll', function(){
		requestAnimationFrame(function() {
			scrollPos = window.pageYOffset;
			$entries.each(function() {
				$(this).toggleClass('is_scrollable', scrollPos > $(this).attr('data-offset'));
			});
		});
	});
});
