// ================================================================
//	MAIN TODO BLOCK
//
// ================================================================

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
Number.prototype.map = function (in-min, in-max, out-min, out-max) {
	return (this - in-min) * (out-max - out-min) / (in-max - in-min) + out-min;
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
	var iterator = 0,
		totalHeight = 0,
		$vContainer = $("#v_header");
	//NOTE:For homepage it might make sense to change this value
	var $entries = $(".italia_entry");

	//Hide / Show Variables
	var $title = $("#v_title"),
		$vTimeCont = $(".v_time_ind"),
		$vProgBarCont = $("#v_progress_bar");
	//Interface Variables
	var vPlayer = document.getElementById("v_player"),
		$vTime = $(".v_cur_time"),
		$vDur = $(".v_duration"),
		$background = $("#v_header"),
		$vProgBar = $("#v_show_progress");
	//Info
	var chapters = $("#v_chapters");

/* ======================================================================================

 ad88888ba                                        88  88  88
d8"     "8b                                       88  88  ""
Y8,                                               88  88
`Y8aaaaa,     ,adPPYba,  8b,dPPYba,   ,adPPYba,   88  88  88  8b,dPPYba,    ,adPPYb,d8
  `"""""8b,  a8"     ""  88P'   "Y8  a8"     "8a  88  88  88  88P'   `"8a  a8"    `Y88
		`8b  8b          88          8b       d8  88  88  88  88       88  8b       88
Y8a     a8P  "8a,   ,aa  88          "8a,   ,a8"  88  88  88  88       88  "8a,   ,d88
 "Y88888P"    `"Ybbd8"'  88           `"YbbdP"'   88  88  88  88       88   `"YbbdP"Y8
																			aa,    ,88
																			 "Y8bbdP"

** ====================================================================================*/

	/*=================================
		LAYERS OF DIVS
	**===============================*/

	$entries.each(function() {
		$(this).attr('data-offset', totalHeight);
		var $height = $(this).outerHeight();
		$(this).attr('data-height', $height);
		$('body').css('min-height', totalHeight+=$height);
		$(this).css('z-index', 4 - iterator++);
	})

	//TODO: Maybe figure out how the video can just use the code that's for $entries?
	//Give the video some space
	$vContainer.attr('data-offset', totalHeight);
	$vContainer.attr('data-height', $vContainer.outerHeight());
	var h = totalHeight + $vContainer.outerHeight();
	$('body').css('min-height', h );
	iterator = 0;



/* ======================	Everything below here is for the homepage only	==========*/

	/*=================================
		VIDEO RESIZING
	**===============================*/

	//Function to resize video and change bg color
	function videoResize(sPos) {
		var	$vWrapper = $("#v_wrapper"),
			$nav = $('header.header'),
			$vControls = $('.v_controls'),
			$vScrollStart = parseInt($entries.last().attr('data-offset'));
			pos = sPos;

		if(sPos > $vScrollStart) {
			scrollPercent = ((sPos - $vScrollStart) / (totalHeight - $vScrollStart)).toFixed(2);

			//Hide video elements / controls when scrolled
			if (scrollPercent > 0.95) {
				scrollPercent = 1;
				bgColor = 000;
				opacityValue = 1;
//				hideControls(); //Not sure what to do with these...
			} else if(scrollPercent < 0.05) {
				scrollPercent = 0;
				bgColor = 255;
				opacityValue = 0;
			} else {
				bgColor = parseFloat(scrollPercent).map(1, 0, 0, 255).toFixed(0);
				opacityValue = scrollPercent;//.map(0,1,0,1).toFixed(2);
//				showControls();
			}

			var wrapStyles = {
				transform : 'scale('+scrollPercent+')',
				opacity: opacityValue
			};

			$vWrapper.css(wrapStyles);
			$background.css( 'background', 'rgb('+bgColor+', '+bgColor+', '+bgColor+')');
			$nav.css('opacity', 1-opacityValue);
			$vControls.css('opacity', opacityValue);
		}
	}

	window.addEventListener('scroll', function(){
		requestAnimationFrame(function() {
			var scrollPos = window.pageYOffset;
			$entries.each(function() {
				$(this).toggleClass('is_scrollable', scrollPos > $(this).attr('data-offset'));
			});
			videoResize(scrollPos);
			controlsTimeout;
		});
	});

	/* ========================================================================================

88                                                 ad88
88                ,d                              d8"
88                88                              88
88  8b,dPPYba,  MM88MMM  ,adPPYba,  8b,dPPYba,  MM88MMM  ,adPPYYba,   ,adPPYba,   ,adPPYba,
88  88P'   `"8a   88    a8P_____88  88P'   "Y8    88     ""     `Y8  a8"     ""  a8P_____88
88  88       88   88    8PP"""""""  88            88     ,adPPPPP88  8b          8PP"""""""
88  88       88   88,   "8b,   ,aa  88            88     88,    ,88  "8a,   ,aa  "8b,   ,aa
88  88       88   "Y888  `"Ybbd8"'  88            88     `"8bbdP"Y8   `"Ybbd8"'   `"Ybbd8"'

** ======================================================================================*/

	/*=================================
		HIDE & SHOW CONTROLS
	**===============================*/

	function showControls() {
		$(".v_controls").removeClass("oHidden");
	}

	function hideControls() {
		$(".v_controls").addClass("oHidden");
	}

	var i = null;

	function controlsTimeout() {
		clearTimeout(i);
		showControls();
		i = setTimeout(hideControls, 2000);
	}

	//Call controlsTimeout on mouse move or click.
	$("body").mousemove(controlsTimeout).click(controlsTimeout);

	/*=================================
		VOLUME BUTTON
	**===============================*/

	$(".v_vol_btn").click(function() {
		$(".svg_volume_icon .group_wave").toggleClass(" mute_anim");
		vPlayer.muted ? vPlayer.muted = false : vPlayer.muted = true;
	})

	/*=================================
		VIDEO PROGRESS BAR
	**===============================*/

	function timeUpdate() {
		$vProgBar.css('width', ((vPlayer.currentTime / vPlayer.duration) *100) + '%');
	}

	//Play Progress event listener
	vPlayer.addEventListener("timeupdate", function() {
		requestAnimationFrame(function() {
			timeUpdate();
		});
	});

	$vProgBarCont.onclick = function(e) {
		var newTime = (((e.pageX - $vProgBarCont.offset().left) / $vProgBarCont.outerWidth()) * vPlayer.duration);
		vPlayer.currentTime = newTime;
	};

	/*=================================
		PLAY BUTTON
	**===============================*/

	//TODO: Redo this code so it matches everything else

	"use strict";

	/* global d3, document */
	var playButton = {
		el: document.querySelector(".js_button"),

		iconEls: {
			playing: document.querySelector("#pause_icon"),
			paused:  document.querySelector("#play_icon")
		},

		nextState: {
			playing: "paused",
			paused:  "playing"
		},

		animationDuration: 350,

		vidPlayer: document.querySelector("#v_player"),

		init: function () {
			this.setInitialState();
			this.replaceUseEl();
			this.el.addEventListener("click", this.toggle.bind(this));
		},

		setInitialState: function () {
			var initialIconRef = this.el.querySelector("use").getAttribute("xlink:href");
			this.state = this.el.querySelector(initialIconRef).getAttribute("data-state");
		},

		replaceUseEl: function () {
			d3.select(this.el.querySelector("use")).remove();
			d3.select(this.el.querySelector("svg")).append("path")
				.attr("class", "js_icon")
				.attr("d", this.stateIconPath());
		},

		//Button Functionality
		toggle: function () {
			this.goToNextState();

			d3.select(this.el.querySelector(".js_icon")).transition()
				.duration(this.animationDuration)
				.attr("d", this.stateIconPath());
			//Play
			if(this.vidPlayer.paused) {
				if(played == false) {
					$('html,body').animate({
						scrollTop: $("#v_wrapper").attr('data-offset')},'slow');
					played=true;
				}
				this.vidPlayer.play()
				//VIDEO TIME
				var updateTime = setInterval(function() {
					$vTime.text(vPlayer.currentTime.toFixed(0).toMMSS());
					$vDur.text(vPlayer.duration.toFixed(0).toMMSS());
					$vTimeCont.css('opacity', '1');
				}, 1000);
			//Pause
			} else {
				clearInterval(updateTime);
				this.vidPlayer.pause();
			}
		},

		goToNextState: function () {
			this.state = this.nextState[this.state];
		},

		stateIconPath: function () {
			return this.iconEls[this.state].getAttribute("d");
		}
	};
	playButton.init();
});
