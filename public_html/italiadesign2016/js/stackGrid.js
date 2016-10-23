//Function to scale numbers between two ranges.
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

$.fn.extend({
	animateCss: function(animationName) {
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

$(document).ready(function() {
	var $window = $(window);
	//Scrolling Variables
	var scrollPos,
		iterator = 0,
		totalHeight = 0,
		offset = 0,
	$entries = $("main>section[class*='-section']");
	var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
			android = /Android/.test(navigator.userAgent),
			firefox = /Firefox/.test(navigator.userAgent),
			mobile = iOS || android ? true : false;

	/*********************************************************************
	 .d8888b.                           888 888 d8b
	d88P  Y88b                          888 888 Y8P
	Y88b.                               888 888
	 "Y888b.    .d8888b 888d888 .d88b.  888 888 888 88888b.   .d88b.
	    "Y88b. d88P"    888P"  d88""88b 888 888 888 888 "88b d88P"88b
	      "888 888      888    888  888 888 888 888 888  888 888  888
	Y88b  d88P Y88b.    888    Y88..88P 888 888 888 888  888 Y88b 888
	 "Y8888P"   "Y8888P 888     "Y88P"  888 888 888 888  888  "Y88888
	                                                              888
	                                                         Y8b d88P
	                                                          "Y88P"
	*******************************************************************/

	/*******************
	  Calculate Heights
	*******************/
	function calcHeights() {
		$entries.each(function(index) {
			var el = $(this);
			el.attr('data-offset', totalHeight);
			var $height = el.outerHeight(true);
			el.attr('data-height', $height);
			$('body').css('height', totalHeight += $height);
			el.css('z-index', $entries.length - iterator++);
		});
		if ($entries.last().outerHeight(true) < $window.outerHeight()) {
			var xHeight = $window.outerHeight() - $entries.last().outerHeight(true) + ($window.outerWidth() * 0.02);
			$('body').css('height', totalHeight += xHeight);
		}
		iterator = offset = totalHeight = 0;
	}

	if ($window.outerWidth() >= 1024 && !mobile) {
		calcHeights();
	}

	//Delays implementation of scrolling on pages with lots of images, and avoids scrolling script on mobile.
	// if ($window.outerWidth() >= 1024 && !mobile) {
	if ($window.outerWidth() >= 1024) {
		$window.on('load', function() {
			calcHeights();
			//NOTE: Now autoplay can wait until there's something to scroll to.
			$(document).trigger("grid:loaded");
		});
	} else {
		$window.on('load', function() {
			$(document).trigger("grid:loaded");
		});
	}

	/**********************************
	  Scrollable Toggle
	**********************************/

	scrollToggle = function() {
		$entries.each(function(ind) {
			var el = $(this),
				elOffset = el.attr('data-offset'),
				elHeight = el.attr('data-height'),
				top = parseFloat(elOffset) + parseFloat(elHeight);

			if (scrollPos < elOffset /*&& el.hasClass('is-scrollable')*/) { //Fixed
				el.removeClass('is-scrollable');
				el.removeClass('fixedTop');
				el.css('top', '');
				el.trigger('scrollable:no');
			} else if (scrollPos > elOffset && scrollPos < top && !el.hasClass('is-scrollable')) { //Scroll
				el.addClass('is-scrollable');
				el.removeClass('fixedTop');
				var offsetTop = /*ind > 0 ? parseFloat(elOffset) + parseFloat(el.css('margin-top').replace('px', '')) :*/ elOffset;
				el.css({
					'top': offsetTop + 'px',
					'position': null //Remove any js position
				});
				el.trigger('scrollable:yes');
			} else if (scrollPos > top /*&& el.hasClass('is-scrollable')*/) { //Stick-to-top
				el.removeClass('is-scrollable');
				el.addClass('fixedTop');
				el.trigger('scrollable:no');
			}
		});
	};

	/**********************************
		PARALLAX SOME DIVS
	**********************************/
	pDivs = [];
	pPars = [];

	//Actually do some parallaxing.
	parallax = function() {
		var scrollPos = $window.scrollTop();
		$.each(pDivs, function(index, pDiv) {
			if (scrollPos > pDiv.iMin && scrollPos < pDiv.iMax) {
				var newVal = parseFloat(scrollPos).map(pDiv.iMin, pDiv.iMax, pDiv.oMax, 0).toFixed(2);
				pDiv.el.css('transform', 'translateY(' + newVal + 'px)');
			} else if (scrollPos < pDiv.iMin) {
				pDiv.el.css('transform', 'translateY(' + pDiv.oMax + 'px)');
			} else if (scrollPos > pDiv.iMax) {
				pDiv.el.css('transform', 'translateY(' + 0 + ')');
			} else {
				pDiv.el.css('transform', 'translateY(' + pDiv.oMax + 'px)');
			}
		});
	};

	//Setup the array we'll be parallaxing with.
	$(document).on('grid:loaded', function() {
		// if ($('body').hasClass('v')) pPars.push('#v-intro');

		$.each(pPars, function(index, pPar) {
			var pDiv = {};
			pDiv.par = $(pPar);
			pDiv.el = $(pPar + ' > div:nth-of-type(2)');
			pDiv.iMin = pDiv.par.attr('data-offset');
			pDiv.iMax = parseFloat(pDiv.iMin) + parseFloat(pDiv.par.outerHeight());
			pDiv.oMax = parseFloat(pDiv.el.outerHeight());
			pDivs.push(pDiv);
		});
		parallax();
	});

	/**********************************
		SHOW CONTENTS ON SCROLL
	**********************************/

	function showOnScroll() {
		var page = $("body").attr('class').split(" ")[0],
			offsets = {
				'home' : [0.5, 0.75],
				'italiaIndex' : [0, 0.5],
				'team' : [0, 0.5],
				'team-vid': [0, 0.5],
				'v' : [0.5, 0.75]
			};

		if (offsets[page]) {
			$entries.each(function(ind, el) {
				var $entry = ind !== 0 ? $entries.eq(ind - 1) : $entries.eq(0),
					$scrollStart = ind !== 0 ? parseFloat($entry.attr('data-offset')) + (parseFloat($entry.attr('data-height')) * offsets[page][0]) : 0,
					$scrollEnd = ind !== 0 ? parseFloat($entry.attr('data-offset')) + (parseFloat($entry.attr('data-height')) * offsets[page][1]) : 0,
					$opacity;
				if (scrollPos > $scrollStart && scrollPos < $scrollEnd) {
					$opacity = ((scrollPos - $scrollStart) / ($scrollEnd - $scrollStart)).toFixed(2);
				} else if (scrollPos <= $scrollStart) {
					$opacity = 0;
				} else if (scrollPos >= $scrollEnd) {
					$opacity = 1;
				}
				$entries.eq(ind).find(".scrollHide").css('opacity', $opacity);
			});
		}
	}

	/***********************************************
		Mobile device orientation change functions
	***********************************************/
	function mobLandscape() {
		this.requestAnimationFrame(function() {
			scrollPos = window.pageYOffset;
			scrollToggle();
			showOnScroll();
		});
	}

	function orientationChange(mql) {
		if(mql.matches) {
			$window.scrollTop(0);
			$("body").css('height', '');
			$entries.find(".scrollHide").css('opacity', 1);
			$window.off('scroll', mobLandscape);
		} else {
			calcHeights();
			$window.on('scroll', mobLandscape);
		}
	}

	/***************************************************************
	888      d8b          888
	888      Y8P          888
	888                   888
	888      888 .d8888b  888888 .d88b.  88888b.   .d88b.  888d888
	888      888 88K      888   d8P  Y8b 888 "88b d8P  Y8b 888P"
	888      888 "Y8888b. 888   88888888 888  888 88888888 888
	888      888      X88 Y88b. Y8b.     888  888 Y8b.     888
	88888888 888  88888P'  "Y888 "Y8888  888  888  "Y8888  888
	***************************************************************/

	if(mobile && $window.outerWidth() > 700) {
		var pCheck = window.matchMedia("(orientation: portrait)");
		pCheck.addListener(orientationChange);
		orientationChange(pCheck);
	} else {
		//Keep cards at top of page / Control is-scrollable scrolling
		window.addEventListener('scroll', function() {
			this.requestAnimationFrame(function() {
				scrollPos = window.pageYOffset;
				scrollToggle();
				parallax();
				showOnScroll();
			});
		});
	}

	// Cards bounce in on page load
	if (window.location.search != '?autoplay' && !mobile) {
	    $("[class*='-section']").animateCss("bounceInUp");
	} else {
		$("[class*='-section']").css('opacity', 1);
	}
});
