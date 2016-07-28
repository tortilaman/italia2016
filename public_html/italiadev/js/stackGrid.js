//Function to scale numbers between two ranges.
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

$.fn.extend({
	animateCss: function (animationName) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		$(this).addClass('animated ' + animationName).one(animationEnd, function() {
			$(this).removeClass('animated ' + animationName);
			$(this).css('opacity', 1);
		});
	}
});

/*=================================
	DOCUMENT READY
**===============================*/

$(document).ready(function () {
	//Scrolling Variables
	var scrollPos,
		iterator = 0,
		totalHeight = 0,
		offset = 0,
		$entries = $("section[class*='-section']");

	/*=================================
		SCROLLING IMPLEMENTATION
	**===============================*/

	function calcHeights() {
		$entries.each(function () {
			$(this).attr('data-offset', offset);
			var $height = $(this).is($entries.first()) ? $(this).outerHeight() : $(this).outerHeight(true);
			offset += $(this).outerHeight(true);
			$(this).attr('data-height', $(this).outerHeight(true));
			$('body').css('height', totalHeight += $height);
			$(this).css('z-index', $entries.length - iterator);
			$(this).find(".scrollHide").css('z-index', $entries.length - iterator++);
		});
		iterator = offset = totalHeight = 0;
	}

	//Delays implementation of scrolling on pages with lots of images, and avoids scrolling script on mobile.
	if($(window).outerWidth(true) > 700) {
		if($("#v-context img").length) {
			$(window).on('load', function() {
				calcHeights();
			});
		} else {
			calcHeights();
		}
	}

	/*=================================
		AUTOPLAY ANIMATE IN
	**===============================*/

	if($("main").hasClass("autoplay") && !$("main").hasClass("home")) {
		$('html, body').animate({
			scrollTop: $("#v-header").outerHeight(true)
		}, 200);
	}

	/*=================================
		PARALLAX SOME DIVS
	**===============================*/

	function parallax() {
		var scrolled = $(window).scrollTop();
		if (scrolled > $('#home-videos').attr('data-offset') && scrolled < $("#v-header").attr('data-offset')) {
			var oldTop = parseInt($('#home-films').css('top').replace('px', '')),
				inMin = $("#home-videos").attr('data-offset'),
				inMax = parseFloat(inMin) + parseFloat($("#home-videos").outerHeight()),
				outMin = 0,
				outMax = $(window).outerHeight() * 0.8,
				newVal = -scrolled.map(inMin, inMax, outMin, outMax) + 'px';
			$('#home-films').css('margin-top', newVal);
		}
	}

	/*=================================
		SHOW CONTENTS ON SCROLL
	**===============================*/

	function showOnScroll() {
		var page = $("body").attr('class').split(" ")[0],
			offsets = {
				home: [0.5, 0.75],
				italiaIndex: [0, 0.5]
			};

		$entries.each(function(ind, el) {
			var $entry = ind !== 0 ? $entries.eq(ind - 1) : $entries.eq(0),
				$scrollStart = ind !== 0 ? parseFloat($entry.attr('data-offset')) + (parseFloat($entry.attr('data-height')) * offsets[page][0]) : 0,
				$scrollEnd = ind !== 0 ? parseFloat($entry.attr('data-offset')) + (parseFloat($entry.attr('data-height')) * offsets[page][1]) : 0,
				$opacity;
			if(scrollPos > $scrollStart && scrollPos < $scrollEnd) {
				$opacity = ((scrollPos - $scrollStart) / ($scrollEnd - $scrollStart)).toFixed(2);
			} else if(scrollPos <= $scrollStart) {
				$opacity = 0;
			} else if(scrollPos >= $scrollEnd) {
				$opacity = 1;
			}
			$entries.eq(ind).find(".scrollHide").css('opacity', $opacity);
		});
	}

	/*=================================
		EVENT LISTENERS
	**===============================*/

	window.addEventListener('scroll', function () {
		requestAnimationFrame(function () {
			scrollPos = window.pageYOffset;
			$entries.each(function (ind, el) {
				var top = (parseFloat($(this).attr('data-offset')) + (parseFloat($(this).attr('data-height')) * 0.9));
				if(scrollPos < $(this).attr('data-offset')){
					$(this).removeClass('is-scrollable');
					$(this).css('top', 0);
				} else if(scrollPos > $(this).attr('data-offset') && scrollPos < top) {
					$(this).addClass('is-scrollable');
//					$(this).removeClass('top-lock');
//					if(ind !== $entries.length - 2) {
						$(this).css({
							'top': $(this).attr('data-offset')+'px',
							'position': null
						});
//					}
				} else if (scrollPos > top) {
					if($(this).attr('data-offset') !== 0) {
						if(ind === $entries.length - 2 && $entries.length >2) {}
						else {
							$(this).css({
								'top': '-'+ (parseFloat($(this).attr('data-height') * 0.9) + 'px'),
								'position': 'fixed !important'
							});
							$(this).removeClass('is-scrollable');
						}
					}
				}
				//Original implementation if the bugs become a problem.
//				$(this).toggleClass('is-scrollable', scrollPos > $(this).attr('data-offset'))
			});
			parallax();
			if(!$('body').hasClass("team")) showOnScroll();
		});
	});

	//Cards bounce in on page load
	if(!$("main").hasClass("autoplay")) {
		$("[class*='-section']").animateCss("bounceInUp");
	}
});
