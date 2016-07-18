// ================================================================
//	MAIN TODO BLOCK
//
// ================================================================

/*=================================
	PROTOTYPE FUNCTIONS
**===============================*/

//Function to scale numbers between two ranges.
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

//Convert seconds to minutes and seconds
String.prototype.toMMSS = function () {
	var sec_num = parseInt(this, 10); // don't forget the second param
	var minutes = Math.floor(sec_num / 60);
	var seconds = sec_num % 60;
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return minutes + ':' + seconds;
};


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

$(document).ready(function () {
	//Video Resizing Variables
	var scrollPos;
	var opacityValue;
	//Other Variables
	var played = false;
	//Scrolling Variables
	var iterator = 0,
		$entries = $("[class*='-section']");

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

	/*=================================
		VIDEO RESIZING
	**===============================*/

	//Function to resize video and change bg color
	function videoResize(sPos) {
		var $vControls = $('.v-controls'),
			$vScrollStart = parseInt($entries.eq(-2).attr('data-offset')),
			pos = parseFloat(sPos).toFixed(2),
			totalHeight = parseFloat($('#v-header').attr('data-offset') + $('#v-header').attr('data-height')).toFixed(2),
			scrollPercent = ((pos - $vScrollStart) / (totalHeight - $vScrollStart)).toFixed(2);

		if (pos > $vScrollStart) {
			//Hide video elements / controls when scrolled
			if (scrollPercent > 0.5) {
				scrollPercent = 1;
				opacityValue = 1;
			} else if (scrollPercent < 0.1) {
				scrollPercent = 0;
				opacityValue = 0;
			} else {
				opacityValue = scrollPercent; //.map(0,1,0,1).toFixed(2);
			}
			$vControls.css('opacity', opacityValue);
		}
	}

	//================================================================================================
	//
	//	88                                                 ad88
	//	88                ,d                              d8"
	//	88                88                              88
	//	88  8b,dPPYba,  MM88MMM  ,adPPYba,  8b,dPPYba,  MM88MMM  ,adPPYYba,   ,adPPYba,   ,adPPYba,
	//	88  88P'   `"8a   88    a8P_____88  88P'   "Y8    88     ""     `Y8  a8"     ""  a8P_____88
	//	88  88       88   88    8PP"""""""  88            88     ,adPPPPP88  8b          8PP"""""""
	//	88  88       88   88,   "8b,   ,aa  88            88     88,    ,88  "8a,   ,aa  "8b,   ,aa
	//	88  88       88   "Y888  `"Ybbd8"'  88            88     `"8bbdP"Y8   `"Ybbd8"'   `"Ybbd8"'
	//
	//================================================================================================

	/*=================================
		HIDE & SHOW CONTROLS
	**===============================*/

	function showControls() {
		$(".v-controls").removeClass("oHidden");
		$("header.header").css('opacity', '1');
	}

	function hideControls() {
		if (vPlayer.paused === false) {
			$(".v-controls").addClass("oHidden");
			$("header.header").css('opacity', '0');
		}
	}

	var i = null;

	function controlsTimeout() {
		clearTimeout(i);
		showControls();
		i = setTimeout(hideControls, 2000);
	}

	//Call controlsTimeout on mouse move or click.
	$("body").on("mousemove click", function () {
		controlsTimeout();
	});

	/*=================================
		VOLUME BUTTON
	**===============================*/

	$(".v-vol-btn").click(function () {
		$(".svg-volume-icon .group-wave").toggleClass(" mute-anim");
		vPlayer.muted = vPlayer.muted ? false : true;
	});

	/*=================================
		VIDEO PROGRESS BAR
	**===============================*/

	function timeUpdate() {
		$vProgBar.css('width', ((vPlayer.currentTime / vPlayer.duration) * 100) + '%');
	}

	$vProgBarCont.onclick = function (e) {
		var newTime = (((e.pageX - $vProgBarCont.offset().left) / $vProgBarCont.outerWidth()) * vPlayer.duration);
		vPlayer.currentTime = newTime;
	};

	/*=================================
		PLAY BUTTON
	**===============================*/

	/* global d3, document */
	var playButton = {
		el: document.querySelector(".js-button"),

		iconEls: {
			playing: document.querySelector("#pause-icon"),
			paused: document.querySelector("#play-icon")
		},

		nextState: {
			playing: "paused",
			paused: "playing"
		},

		animationDuration: 350,

		vidPlayer: document.querySelector("#v-player"),

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
			//VIDEO TIME
			var updateTime;
			//Play
			if (this.vidPlayer.paused) {
				if (played === false) {
					updateTime = setInterval(function () {
						$vTime.text(vPlayer.currentTime.toFixed(0).toMMSS());
						$vDur.text(vPlayer.duration.toFixed(0).toMMSS());
						$vTimeCont.css('opacity', '1');
					}, 1000);
					played = true;
				}
				this.vidPlayer.play();
				//$("header.header").css('opacity', '0');
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

	/*=================================
		EVENT LISTENERS
	**===============================*/

	if($("main").hasClass("home")) {
		//Scroll progress even tlistener
		window.addEventListener('scroll', function () {
			requestAnimationFrame(function () {
				scrollPos = window.pageYOffset;
				videoResize(scrollPos);
			});
		});
	}

	//Play Progress event listener
	vPlayer.addEventListener("timeupdate", function () {
		requestAnimationFrame(function () {
			timeUpdate();
		});
	});
});
