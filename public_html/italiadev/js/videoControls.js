/*=================================
	BLANK VARIABLE DECLARATIONS
**===============================*/

var scrollPos;
var scrollPercent;
var scrollPercentInv;
var scaleValue;
var opacityValue;
var bgColor;
var played = false;

/*=================================
	PROTOTYPE FUNCTIONS
**===============================*/

//Function to scale numbers between two ranges.
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
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
	var seconds = sec_num - (minutes * 60);

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
	//VARIABLE DECLARATIONS
	var windowheight = window.innerHeight // height of browser window
		vidScroll = document.getElementById("v_content").offsetTop //Height of chapter vid section
		vWrapper = document.querySelector("#v_wrapper")
		vPlayer = document.querySelector("#v_player");
	//Controls
	var vTime = $(".v_cur_time")
		vDur = $(".v_duration")
		vTimeCont = document.querySelector(".v_time_ind")
		background = document.querySelector("#v_header")
		vProgBarCont = document.querySelector("#v_progress_bar")
		vProgBar = document.querySelector("#v_show_progress");
	//Info
	var title = document.querySelector("#v_title")
		chapters = document.querySelector("#v_chapters");

	//Scroll window to where we want it to start.
	$(window).scrollTop(chapters.scrollHeight); //FIXME: Make sure this is the right value.


	/*=================================
		VIDEO RESIZING
	**===============================*/

	//Function to resize video and change bg color
	function videoResize() {
		scrollPos = window.pageYOffset; // get number of pixels document has scrolled vertically
		scrollPercent = scrollPos / vidScroll;
		scrollPercentInv = 1-scrollPercent;

		if (scrollPercent > 0 && scrollPercent < 1) {
			//Scale Video Player
			scaleValue = scrollPercentInv.map(0,1, 0.7, 1).toFixed(2);
			vWrapper.style.transform = 'scale('+scaleValue+')';

			if (scrollPercent <0.5) {
				bgColor = scrollPercent.map(0, 0.5, 0, 255).toFixed(0);
				opacityValue = scrollPercentInv.map(0.5,1,0.2,1).toFixed(2);
			}
			else {
				bgColor = 255;
				opacityValue = 0.2;
			}

			background.style.background = 'rgb('+bgColor+', '+bgColor+', '+bgColor+')';
			vWrapper.style.opacity = opacityValue;
		}

		//Hide video elements / controls when scrolled
		//TODO: Optimize how often this is called.
		if (scrollPercent > 0.5) {
			title.style.opacity = "0";
			vTimeCont.style.opacity = "0";
			vProgBarCont.style.opacity = "0";

		} else {
			title.style.opacity = "1";
			vTimeCont.style.opacity = "1";
			vProgBarCont.style.opacity = "1"
		}
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

	/*=================================
		VOLUME BUTTON
	**===============================*/

	$(".v_vol_btn").click(function() {
		$(".svg_volume_icon .group-wave").toggleClass(" mute-anim");
		vPlayer.muted ? vPlayer.muted = false : vPlayer.muted = true;
	})

	/*=================================
		VIDEO TIME
	**===============================*/

	function timeUpdate() {
		vProgBar.style.width = ((vPlayer.currentTime / vPlayer.duration) *100) + '%';
	}

	//Play Progress event listener
	vPlayer.addEventListener("timeupdate", function() {
		requestAnimationFrame(function() {
			timeUpdate();
		});
	});

	vProgBarCont.onclick = function(e) {
		var newTime = (((e.pageX - vProgBarCont.offsetLeft) / vProgBarCont.offsetWidth) * vPlayer.duration);
		console.log(e.pageX+', '+vProgBarCont.offsetLeft+', '+vProgBarCont.offsetWidth+', '+newTime);
		vPlayer.currentTime = newTime;

	};

	/*=================================
		HIDE & SHOW CONTROLS
	**===============================*/

	function showControls() {
		$("#v_title").removeClass("oHidden");
		$(".v_time_ind").removeClass("oHidden");
		$("#v_progress_bar").removeClass("oHidden");
	}

	function hideControls() {
		$("#v_title").addClass("oHidden");
		$(".v_time_ind").addClass("oHidden");
		$("#v_progress_bar").addClass("oHidden");
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
					vTime.text(vPlayer.currentTime.toFixed(0).toMMSS());
					vDur.text(vPlayer.duration.toFixed(0).toMMSS());
					vTimeCont.style.opacity = '1';
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
















