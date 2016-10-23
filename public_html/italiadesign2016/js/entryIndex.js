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
			$(this).css('z-index', $entries.length - iterator++);
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

	//Makes it so you can see the transition from the TOC to the video when clicking the link.
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
		console.log("Show on scroll");
		$entries.each(function(ind, el) {
			var $entry = ind !== 0 ? $entries.eq(ind - 1) : $entries.eq(0),
				$scrollStart = ind !== 0 ? parseFloat($entry.attr('data-offset')) + (parseFloat($entry.attr('data-height')) * 3 / 4) : 0;
			console.log($scrollStart);
		});
	}
	
	/*=================================
		EVENT LISTENERS
	**===============================*/

	$(window).addEventListener('scroll', function () {
		console.log("Scrolling handler");
		requestAnimationFrame(function () {
			scrollPos = window.pageYOffset;
			$entries.each(function () {
					$(this).toggleClass('is-scrollable', scrollPos > $(this).attr('data-offset'));
			});
			parallax();
			showOnScroll();
		});
	});

	//Cards bounce in on page load
	if(!$("main").hasClass("autoplay")) {
		$("[class*='-section']").animateCss("bounceInUp");
	}
});
