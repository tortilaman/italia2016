/* ================================================================
	MAIN TODO BLOCK

	TODO: Timeline bar isn't hidden when you go to a video page

** ==============================================================*/

/*=================================
	BLANK VARIABLE DECLARATIONS
**===============================*/

//Scrolling Variables
var scrollPos;
var scrollPercent;
var scrollPercentInv;
var scaleValue;
var opacityValue;
var bgColor;
//Other Variables
var played = false;

/*=================================
	PROTOTYPE FUNCTIONS
**===============================*/

//Function to scale numbers between two ranges.
Number.prototype.map = function (in-min, in-max, out-min, out-max) {
	return (this - in-min) * (out-max - out-min) / (in-max - in-min) + out-min;
}

//Only runs if it hasn't been called for the wait duration
function debounce(callback, wait) {
	var time;
	return function() {
		clearTimeout(time);
		time = setTimeout(function() {
			time = null;
			callback.call();
		}, wait);
	}
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
	//SCROLLING VARIABLES
	var	$vidScroll = $("#v_content").offset().top //Height of chapter vid section
		$vWrapper = $("#v_wrapper");
	//HIDE & SHOW CONTROLS VARIABLES
	var $title = $("#v_title")
		$vTimeCont = $(".v_time_ind")
		$vProgBarCont = $("#v_progress_bar");
	//INTERFACE VARIABLES
	//vPlayer is a js (not jQuery) object b/c it's more concise later.
	var vPlayer = document.getElementById("v_player")
		$vTime = $(".v_cur_time")
		$vDur = $(".v_duration")
		$vTimeCont = $(".v_time_ind")
		$background = $("#v_header")
		$vProgBar = $("#v_show_progress");
	//Info
	var chapters = $("#v_chapters");

	//Scroll window to where we want it to start.
	$(window).scrollTop(chapters.outerHeight()); //FIXME: Make sure this is the right value.

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

	//Function to resize video and change bg color
	function videoResize() {
		scrollPos = window.pageYOffset; // get number of pixels document has scrolled vertically
		scrollPercent = scrollPos / $vidScroll;
		scrollPercentInv = 1-scrollPercent;

		if (scrollPercent < 1) {
			//Scale Video Player
			scaleValue = scrollPercentInv.map(0,1, 0.7, 1).toFixed(2);
			$vWrapper.css( 'transform', 'scale('+scaleValue+')');
		}

		//Hide video elements / controls when scrolled
		//TODO: Optimize how often this is called.
		if (scrollPercent > 0.5) {
			bgColor = 255;
			opacityValue = 0.2;
			hideControls();
		} else {
			bgColor = scrollPercent.map(0, 0.5, 0, 255).toFixed(0);
			opacityValue = scrollPercentInv.map(0.5,1,0.2,1).toFixed(2);
			showControls();

		}
		$background.css( 'background', 'rgb('+bgColor+', '+bgColor+', '+bgColor+')');
		$vWrapper.css( 'opacity', opacityValue);
	}

	//One last run of videoResize() to catch any straggling changes.
	var scrollDebounce = debounce(function(){
		videoResize()
	}, 100);

	//Scrolling event listener
	window.addEventListener('scroll', function(){
		requestAnimationFrame(function() {
			videoResize();
			scrollDebounce;
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
		$title.removeClass("oHidden");
		$vTimeCont.removeClass("oHidden");
		$vProgBarCont.removeClass("oHidden");
	}

	function hideControls() {
		$title.addClass("oHidden");
		$vTimeCont.addClass("oHidden");
		$vProgBarCont.addClass("oHidden");
	}

	var i = null;
	$("body").mousemove(function() {
		clearTimeout(i);
		showControls();
		i = setTimeout(hideControls, 2000);
	}).click(function() {
		clearTimeout(i);
		showControls();
		i = setTimeout(hideControls, 2000);
	});

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
		console.log(e.pageX+', '+$vProgBarCont.offset.left+', '+$vProgBarCont.outerWidth()+', '+newTime);
		vPlayer.currentTime = newTime;

	};

	/*=================================
		PLAY BUTTON
	**===============================*/

	//TODO: Redo this code so it matches everything else

	"use strict";

	/* global d3, document */
	var playButton = {
		el: document.querySelector(".js-button"),

		iconEls: {
			playing: document.querySelector("#pause-icon"),
			paused:  document.querySelector("#play-icon")
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
				.attr("class", "js-icon")
				.attr("d", this.stateIconPath());
		},

		//Button Functionality
		toggle: function () {
			this.goToNextState();

			d3.select(this.el.querySelector(".js-icon")).transition()
				.duration(this.animationDuration)
				.attr("d", this.stateIconPath());
			//Play
			if(this.vidPlayer.paused) {
				if(played == false) {
					$('html,body').animate({
						scrollTop: 0},'slow');
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
















