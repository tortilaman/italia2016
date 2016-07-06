/* ================================================================
	MAIN TODO BLOCK

	TODO: Combine scroll event listeners

** ==============================================================*/

/*=================================
	BLANK VARIABLE DECLARATIONS
**===============================*/

//Video Resizing Variables
var scrollPos;
var scrollPercent;
var scrollPercentInv;
var scaleValue;
var opacityValue;
var bgColor;
//Other Variables
var played = false;
var resizeTimeout;

/*=================================
	PROTOTYPE FUNCTIONS
**===============================*/

//Function to scale numbers between two ranges.
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//Convert seconds to minutes and seconds
String.prototype.toMMSS = function () {
	var sec_num = parseInt(this, 10); // don't forget the second param
	var minutes = Math.floor(sec_num / 60);
	var seconds = sec_num % 60;

	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	return minutes+':'+seconds;
}

/*=================================

88888888ba   88888888888         db         88888888ba,  8b        d8
88      "8b  88                 d88b        88      `"8b  Y8,    ,8P
88      ,8P  88                d8'`8b       88        `8b  Y8,  ,8P
88aaaaaa8P'  88aaaaa          d8'  `8b      88         88   "8aa8"
88""""88'    88"""""         d8YaaaaY8b     88         88    `88'
88    `8b    88             d8""""""""8b    88         8P     88
88     `8b   88            d8'        `8b   88      .a8P      88
88      `8b  88888888888  d8'          `8b  88888888Y"'       88

**===============================*/

$(document).ready(function() {
	//Scrolling Variables
	var scrollPos,
		iterator = 0,
		totalHeight = 0,
		$nav = $('header.header'),
		$controls = $('.v_controls');
	//NOTE:For homepage it might make sense to change this value
	var $entries = $(".italia_entry");
	//Resizing Variables
	var	$vWrapper = $("#v_wrapper"),
		$vContainer = $("#v_header");
	//Hide / Show Variables
	var $title = $("#v_title"),
		$vTimeCont = $(".v_time_ind"),
		$vProgBarCont = $("#v_progress_bar");
	//Interface Variables
	//vPlayer is a js (not jQuery) object b/c it's more concise later.
	var vPlayer = document.getElementById("v_player"),
		$vTime = $(".v_cur_time"),
		$vDur = $(".v_duration"),
		$vTimeCont = $(".v_time_ind"),
		$background = $("#v_header"),
		$vProgBar = $("#v_show_progress");
	//Info
	var chapters = $("#v_chapters");

	/*=================================
		SCROLL FUNCTIONALITY
	**===============================*/

	$entries.each(function() {
		$(this).attr('data-offset', totalHeight);
		var $height = $(this).outerHeight();
		$(this).attr('data-height', $height);
		$('body').css('min-height', totalHeight+=$height);
		$(this).css('z-index', 4 - iterator++);
	})

	//Give the video some space
	$vContainer.attr('data-offset', totalHeight);
	$vContainer.attr('data-height', $vContainer.outerHeight());
	var h = totalHeight + $vContainer.outerHeight();
	$('body').css('min-height', h );

	iterator = 0;

	window.addEventListener('scroll', function(){
		requestAnimationFrame(function() {
			scrollPos = window.pageYOffset;
			$entries.each(function() {
				$(this).toggleClass('is_scrollable', scrollPos > $(this).attr('data-offset'));
			});
		});
	});

/* ======================	Everything below here is for the homepage only	==========*/

	/*=================================
		VIDEO RESIZING
	**===============================*/

	var vScrollStart = parseInt($entries.last().attr('data-offset'));

	//Function to resize video and change bg color
	var videoResize = window.requestAnimationFrame(function() {
		console.log("You're resizing!");
		scrollPos = window.pageYOffset; // get number of pixels document has scrolled vertically

		if(scrollPos > vScrollStart) {
			scrollPercent = (scrollPos - vScrollStart) / (totalHeight - vScrollStart);

			if (scrollPercent < 1) {
				//Scale Video Player
				$vWrapper.css( 'transform', 'scale('+scrollPercent.toFixed(2)+')');
			}

			//Hide video elements / controls when scrolled
			//TODO: Optimize how often this is called.
			//NOTE: Are all these conditionals necessary?
			if (scrollPercent > 0.95) {
				bgColor = 000;
				opacityValue = 1;
//				hideControls();
			} else if(scrollPercent < 0.5) {
				bgColor = 255;
				opacityValue = 0;
			} else {
				bgColor = scrollPercent.map(1, 0, 0, 255).toFixed(0);
				opacityValue = scrollPercent.map(0,1,0,1).toFixed(2);
//				showControls();
			}
			$background.css( 'background', 'rgb('+bgColor+', '+bgColor+', '+bgColor+')');
			$vWrapper.css( 'opacity', opacityValue);
			$nav.css('opacity', 1-opacityValue);
			$controls.css('opacity', opacityValue);
		}
	});

	//Scrolling event listener
	window.addEventListener('scroll', function(){
		clearTimeout(resizeTimeout);
		videoResize;
		//The animationFrame makes it miss the final position. Let's fix that.
		resizeTimeout = setTimeout(videoResize, 100);
	});
});
