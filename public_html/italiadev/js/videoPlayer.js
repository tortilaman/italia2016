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
		var $vControls = $('.v-ui'),
			$vOverlay = $('.v-overlay'),
			$vScrollStart = parseInt($entries.eq(-2).attr('data-offset')),
			$zVal = 0,
			pos = parseFloat(sPos).toFixed(2),
			totalHeight = parseFloat($('#v-header').attr('data-offset') + $('#v-header').attr('data-height')).toFixed(2),
			scrollPercent = ((pos - $vScrollStart) / (totalHeight - $vScrollStart)).toFixed(2);

		if (pos > $vScrollStart) {
			//Hide video elements / controls when scrolled
			if (scrollPercent > 0.5) {
				scrollPercent = 1;
				opacityValue = 1;
				$zVal = 1;
			} else if (scrollPercent < 0.1) {
				scrollPercent = 0;
				opacityValue = 0;
				$zVal = 6;
			} else {
				opacityValue = scrollPercent; //.map(0,1,0,1).toFixed(2);
				$zVal = 6;
			}
			$vControls.css('opacity', opacityValue);
			$vOverlay.css('opacity', 1 - opacityValue);
			$vOverlay.css('z-index', $zVal);
			console.log("Opacity Value is: " + opacityValue);

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
		if (played === true) {
			$("#v-title, #v-interviewee, #v-share, a.v-prev-link, .v-controls").removeClass("oHidden");
		}
	}

	function hideControls() {
		if (vPlayer.paused === false) {
			$("#v-title, #v-interviewee, #v-share, a.v-prev-link, .v-controls").addClass("oHidden");
		}
	}

	var i = null;
	var prev_x = null;

	//Fix for chrome mousemove event call while in fullscreen
	function controlsTimeout(e) {
		if ((prev_x !== null) && (prev_x != e.x)) {
			clearTimeout(i);
			showControls();
			i = setTimeout(hideControls, 2000);
		}
		prev_x = e.x;
	}

	//Call controlsTimeout on mouse move or click.
	document.addEventListener("mousemove", controlsTimeout, false);

	/*=================================
		SOCIAL MEDIA
	**===============================*/

	$(".v-share-btn-open").on("click", function() {
		$(this).css('transform', 'rotateY(90deg)');
		$(".v-share-btn-close").css('transform', 'rotateY(180deg)');
		for(var i = 0; i < $(".v-share-btns-container a").length; i++) {
			$(".v-share-btns-container a").eq(i).css('top', (i*1.5)+'em');
		}
	});

	$(".v-share-btn-close").on("click", function() {
		$(this).css('transform', 'rotateY(90deg)');
		$(".v-share-btn-open").css('transform', 'rotateY(0deg)');
		for(var i = 0; i < $(".v-share-btns-container a").length; i++) {
			$(".v-share-btns-container a").eq(i).css('top', -1.5+'em');
		}
	});


	/*=================================
		FULLSCREEN BUTTON
	**===============================*/

	// Find the right method, call on correct element
	$("#v-full-btn").on("click", function() {
		var el = document.querySelector("#v-container");
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if(!fullscreenElement) {
			if(el.requestFullscreen) {
				el.requestFullscreen();
			} else if(el.mozRequestFullScreen) {
				el.mozRequestFullScreen();
			} else if(el.webkitRequestFullscreen) {
				el.webkitRequestFullscreen();
			} else if(el.msRequestFullscreen) {
				el.msRequestFullscreen();
			}
			$("#v-full-btn polygon").css('transform', 'rotate(180deg)');
		} else {
			if(document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.mozExitFullscreen) {
				document.mozExitFullscreen();
			} else if(document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if(document.msExitFullscreen) {
				document.msExitFullscreen();
			}
			$("#v-full-btn polygon").css('transform', 'rotate(0deg)');
		}
	});

	/*=================================
		VIDEO PROGRESS BAR
	**===============================*/

	function timeUpdate() {
		$vProgBar.css('width', ((vPlayer.currentTime / vPlayer.duration) * 100) + '%');
	}

	$vProgBarCont.click(function (e) {
		if(!vPlayer.paused && !vPlayer.ended){
			var newTime = (((e.pageX - $vProgBarCont.offset().left) / $vProgBarCont.outerWidth()) * vPlayer.duration);
			vPlayer.currentTime = newTime;
		}
	});

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

	if($("main").hasClass("child")) {
		playButton.toggle();
	}

	/*=================================
		INITIAL STATE & PLAY BUTTON
	**===============================*/

	if($(".v-init-play").length) {
		$("#v-title, #v-interviewee, #v-share, a.v-prev-link, .v-controls").addClass("oHidden");
		$(".v-init-play").one("click", function() {
			playButton.toggle();
			$(this).addClass("oHidden").remove();
			showControls();
		});
	}

	/*=================================
		NEXT VIDEO F'N
	**===============================*/

	var cdTime = 5;
	var initOffset = '440';
	var count = 1;

	/* Need initial run as interval hasn't yet occured... */
	$('.circle-animation').css('stroke-dashoffset', initOffset-(1*(initOffset/cdTime)));

	document.querySelector("#v-player").onended = function() {
		$(".v-ended").removeClass("oHidden");
		$(".v-ended").css('z-index', '5');
		var interval = setInterval(function() {
			$('.v-ended-cd-num').text(cdTime - count);
			$('.v-ended-cancel').one("click", function() {
				clearInterval(interval);
				$(".v-ended").addClass("oHidden").remove();
				$(".v-suggestions").css('z-index', 5).removeClass("oHidden");
			});
			if (count == cdTime) {
				$('.v-ended-cd-num').text('GO!');
				clearInterval(interval);
				window.location.href = $('.v-ended').attr('data-url');
				return;
			}
			$('.circle-animation').css('stroke-dashoffset', initOffset-((count+1)*(initOffset/cdTime)));
			count++;
		}, 1000);
	};

	/*=================================
		EVENT LISTENERS
	**===============================*/

	if($("#v-intro").length == 1 || $("main").hasClass("home")) {
		//Scroll progress even tlistener
		window.addEventListener('scroll', function () {
			requestAnimationFrame(function () {
				scrollPos = window.pageYOffset;
				videoResize(scrollPos);
			});
		});
	} else {
		$(".v-overlay").remove();
	}
	console.log($("#v-intro").length);

	//Play Progress event listener
	vPlayer.addEventListener("timeupdate", function () {
		requestAnimationFrame(function () {
			timeUpdate();
		});
	});
});
