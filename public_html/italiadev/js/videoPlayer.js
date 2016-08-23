// ================================================================
//	MAIN TODO BLOCK
//
// ================================================================

/*=================================
	PROTOTYPE FUNCTIONS
**===============================*/

//Function to scale numbers between two ranges.
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

//Convert seconds to minutes and seconds
String.prototype.toMMSS = function() {
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

8888888b.                        888
888   Y88b                       888
888    888                       888
888   d88P .d88b.   8888b.   .d88888 888  888
8888888P" d8P  Y8b     "88b d88" 888 888  888
888 T88b  88888888 .d888888 888  888 888  888
888  T88b Y8b.     888  888 Y88b 888 Y88b 888
888   T88b "Y8888  "Y888888  "Y88888  "Y88888
                                          888
                                     Y8b d88P
                                      "Y88P"

**===============================*/

$(document).ready(function() {
    var $window = $(window),
        $vCont = $("#v-middle.v21-9"),
        $vPlayer = $("#v-player");
    //Video Resizing Variables
    var scrollPos;
    var opacityValue = 0;
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
    var vidIndex;
    //Kids, do as I say not as I do...(mobile responsive stuff).
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        android = /Android/.test(navigator.userAgent),
        firefox = /Firefox/.test(navigator.userAgent),
        mobile = iOS || android ? true : false;

    //Figure out which item in $entries is the video so videoResize can work properly.
    $entries.each(function(ind, el) {
        if ($(this).is($("#v-header"))) {
            vidIndex = ind;
        }
    });

    /**********************************
    	MOBILE VIDEO HANDLING
    **********************************/

    if (iOS || android) {
        $vPlayer.attr('controls', 'controls');
        $vCont.addClass("mobile");
        $(".v-controls, .v-init-play, .v-ended, .v-suggestions").remove();
    } else {
        $vPlayer.removeAttr("controls");
    }

    /*=================================
    	VIDEO RESIZING
    **===============================*/

    //Function to resize video and change bg color
    function videoResize(sPos) {
        var $vControls = $('.v-ui'),
            $vOverlay = $('.v-overlay'),
            $vScrollStart = parseInt($entries.eq(vidIndex - 1).attr('data-offset')),
            $zVal = 0,
            pos = parseFloat(sPos).toFixed(2),
            totalHeight = parseFloat($('#v-header').attr('data-offset')),
            scrollPercent = ((pos - $vScrollStart) / (totalHeight - $vScrollStart)).toFixed(2);

        if (pos > $vScrollStart) {
            //Hide video elements / controls when scrolled
            if (scrollPercent > 0.5) {
                scrollPercent = 1;
                opacityValue = 1;
                $zVal = -1;
                if (!played && $("main").hasClass("home")) {
                    playButton.toggle();
                    $(".v-init-play").addClass("oHidden").remove();
                }
            } else if (scrollPercent < 0.1) {
                scrollPercent = 0;
                opacityValue = 0;
                $zVal = 6;
            } else {
                opacityValue = parseFloat(scrollPercent);
                $zVal = 6;
            }
            $vControls.css('opacity', opacityValue);
            $vOverlay.css('opacity', 1 - opacityValue);
            $vOverlay.css('z-index', $zVal);
        }
    }

    /***************************************************************************

     .d8888b.                    888                    888
    d88P  Y88b                   888                    888
    888    888                   888                    888
    888         .d88b.  88888b.  888888 888d888 .d88b.  888 .d8888b
    888        d88""88b 888 "88b 888    888P"  d88""88b 888 88K
    888    888 888  888 888  888 888    888    888  888 888 "Y8888b.
    Y88b  d88P Y88..88P 888  888 Y88b.  888    Y88..88P 888      X88
     "Y8888P"   "Y88P"  888  888  "Y888 888     "Y88P"  888  88888P'

    ***************************************************************************/

    /*=================================
    	HIDE & SHOW CONTROLS
    **===============================*/

    function showControls() {
        if (played === true) {
            $("#v-title, #v-interviewee, #v-share, a.v-prev-link, .v-controls, .v-nextVid, .v-prevVid").removeClass("oHidden");
        }
    }

    function hideControls() {
        if (vPlayer.paused === false) {
            $("#v-title, #v-interviewee, #v-share, a.v-prev-link, .v-controls, .v-nextVid, .v-prevVid").addClass("oHidden");
        }
    }

    var i = null;
    var prev_x = null;

    //CHROMEBUG: Fix for chrome mousemove event call while in fullscreen
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
    	FULLSCREEN BUTTON
    **===============================*/

    // Find the right method, call on correct element
    $("#v-full-btn").on("click", function() {
        var el = document.querySelector("#v-container");
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        if (!fullscreenElement) {
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }
            $("#v-full-btn polygon").css('transform', 'rotate(180deg)');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozExitFullscreen) {
                document.mozExitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
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

    $vProgBarCont.click(function(e) {
        var newTime = (((e.pageX - $vProgBarCont.offset().left) / $vProgBarCont.outerWidth()) * vPlayer.duration);
        vPlayer.currentTime = newTime;
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

        init: function() {
            this.setInitialState();
            this.replaceUseEl();
            this.el.addEventListener("click", this.toggle.bind(this));
        },

        setInitialState: function() {
            var initialIconRef = this.el.querySelector("use").getAttribute("xlink:href");
            this.state = this.el.querySelector(initialIconRef).getAttribute("data-state");
        },

        replaceUseEl: function() {
            d3.select(this.el.querySelector("use")).remove();
            d3.select(this.el.querySelector("svg")).append("path")
                .attr("class", "js-icon")
                .attr("d", this.stateIconPath());
        },

        //Button Functionality
        toggle: function() {
            this.goToNextState();

            d3.select(this.el.querySelector(".js-icon")).transition()
                .duration(this.animationDuration)
                .attr("d", this.stateIconPath());
            //VIDEO TIME
            var updateTime;
            //Play
            if (this.vidPlayer.paused) {
                if (played === false) {
                    updateTime = setInterval(function() {
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

        goToNextState: function() {
            this.state = this.nextState[this.state];
        },

        stateIconPath: function() {
            return this.iconEls[this.state].getAttribute("d");
        }
    };

    if (playButton.el !== null) playButton.init();

    /***************************************************************************

    888     888 d8b      888 8888888888                           888
    888     888 Y8P      888 888                                  888
    888     888          888 888                                  888
    Y88b   d88P 888  .d88888 8888888   888  888  .d88b.  88888b.  888888 .d8888b
     Y88b d88P  888 d88" 888 888       888  888 d8P  Y8b 888 "88b 888    88K
      Y88o88P   888 888  888 888       Y88  88P 88888888 888  888 888    "Y8888b.
       Y888P    888 Y88b 888 888        Y8bd8P  Y8b.     888  888 Y88b.       X88
        Y8P     888  "Y88888 8888888888  Y88P    "Y8888  888  888  "Y888  88888P'

    ***************************************************************************/

    /*=================================
    	AUTOPLAY FUNCTIONALITY
    **===============================*/
    autoplayVid = function() {
        // if (window.location.hash.length >= 1 && !mobile) {
        var offset = 0;
        for (var i = 0; i < vidIndex; i++) {
            offset += $entries.eq(i).outerHeight(true);
        }
        $("#v-play-btn").focus();
        $("#v-intro").css('opacity', 1);
        if (firefox) {
            $("html").animate({
                scrollTop: offset
            }, 1000, 'swing', function() {
                playButton.toggle();
                $(".v-init-play").addClass("oHidden").remove();
                showControls();
            });
        } else {
            $("body").animate({
                scrollTop: offset
            }, 1000, 'swing', function() {
                playButton.toggle();
                $(".v-init-play").addClass("oHidden").remove();
                showControls();
            });
        }
        // }
    };

    /*=================================
    	INITIAL STATE & PLAY BUTTON
    **===============================*/

    if ($(".v-init-play").length) {
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

    var cdTime = 10,
        count = 1;

    document.querySelector("#v-player").onended = function() {
        //Show end of video UI everywhere but about / bio pages
        if (!$("body").hasClass("team") && !$("body").hasClass("team-vid")) {
            $(".v-controls").css('opacity', 0);
            $(".suggested h1").fitText(0.5);
            $(".suggested h2").fitText(1.2);
            $(".v-ended").css('z-index', '5').removeClass("oHidden");
            if ($(".v-ended h2").length > 0) {
                var interval = setInterval(function() {
                    //Set text in middle
                    $('.v-ended-cd-num').text(cdTime - count);
                    //If cancel is clicked
                    $('.v-ended-cd-cancel').one("click", function() {
                        clearInterval(interval);
                        $(".v-ended span, [class^='v-ended-']").css('visibility', 'hidden').hide("fast");
                    });
                    if (count == cdTime) {
                        clearInterval(interval);
                        window.location.href = $('.v-ended').attr('data-url');
                        return;
                    }
                    count++;
                }, 1000);
            }
        } else {
            $(".v-ended span, .v-ended-nextTitle, .v-ended-cd-num, .v-ended-cd-cancel").css('z-index', 5).addClass("oHidden");
        }
    };

    /**********************************
    	EVENT LISTENERS
    **********************************/

    $(document).one("grid:loaded", autoplayVid);
    // $("video#v-player").on('load', autoplayVid());

    if ($("#v-intro").length || $("main").hasClass("home")) {
        //Scroll progress even tlistener
        window.addEventListener('scroll', function() {
            requestAnimationFrame(function() {
                scrollPos = window.pageYOffset;
                videoResize(scrollPos);
            });
        });
    } else {
        $(".v-overlay").remove();
    }

    //Play Progress event listener
    vPlayer.addEventListener("timeupdate", function() {
        requestAnimationFrame(function() {
            timeUpdate();
        });
    });
});
