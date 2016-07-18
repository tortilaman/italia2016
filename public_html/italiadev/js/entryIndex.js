//Function to scale numbers between two ranges.
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

//=========================================================================
//
//	88888888ba   88888888888         db         88888888ba,  8b        d8
//	88      "8b  88                 d88b        88      `"8b  Y8,    ,8P
//	88      ,8P  88                d8'`8b       88        `8b  Y8,  ,8P
//	88aaaaaa8P'  88aaaaa          d8'  `8b      88         88   "8aa8"
//	88""""88'    88"""""         d8YaaaaY8b     88         88    `88'
//	88    `8b    88             d8""""""""8b    88         8P     88
//	88     `8b   88            d8'        `8b   88      .a8P      88
//	88      `8b  88888888888  d8'          `8b  88888888Y"'       88
//
//=========================================================================

$(document).ready(function () {
	//Scrolling Variables
	var scrollPos,
		iterator = 0,
		totalHeight = 0,
		$vContainer = $("#v-header");
	//NOTE:For homepage it might make sense to change this value
	var $entries = $("[class*='-section']");

	//Hide / Show Variables
	var $title = $("#v-title"),
		$vTimeCont = $(".v-time-ind"),
		$vProgBarCont = $("#v-progress-bar");
	//Interface Variables
	var vPlayer = document.getElementById("v-player"),
		$vTime = $(".v-cur-time"),
		$vDur = $(".v-duration"),
		$background = $('body'),
		$vProgBar = $("#v-show-progress");
	//Info
	var chapters = $("#v-chapters");

	//========================================================================================
	//
	//	 ad88888ba                                        88  88  88
	//	d8"     "8b                                       88  88  ""
	//	Y8,                                               88  88
	//	`Y8aaaaa,     ,adPPYba,  8b,dPPYba,   ,adPPYba,   88  88  88  8b,dPPYba,    ,adPPYb,d8
	//	  `"""""8b,  a8"     ""  88P'   "Y8  a8"     "8a  88  88  88  88P'   `"8a  a8"    `Y88
	//			`8b  8b          88          8b       d8  88  88  88  88       88  8b       88
	//	Y8a     a8P  "8a,   ,aa  88          "8a,   ,a8"  88  88  88  88       88  "8a,   ,d88
	//	 "Y88888P"    `"Ybbd8"'  88           `"YbbdP"'   88  88  88  88       88   `"YbbdP"Y8
	//	 																			aa,    ,88
	//																				 "Y8bbdP"
	//
	//========================================================================================

	/*=================================
		LAYERS OF DIVS
	**===============================*/

	$entries.each(function () {
		$(this).attr('data-offset', totalHeight);
		var $height = $(this).outerHeight(true);
		$(this).attr('data-height', $height);
		$('body').css('min-height', totalHeight += $height);
		$(this).css('z-index', $entries.length - iterator++);
	});
	iterator = 0;

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

	window.addEventListener('scroll', function () {
		requestAnimationFrame(function () {
			scrollPos = window.pageYOffset;
			$entries.each(function () {
				$(this).toggleClass('is-scrollable', scrollPos > $(this).attr('data-offset'));
			});
			parallax();
		});
	});

	//Force repaint for stupid chrome bug...
	$(".bounceInUp").one('animationend', function() {
		$(this).removeClass('animated bounceInUp');
		$(this).css('opacity', 1);
		$(this).hide().show(0);
	});
});
