/*88888b.                        888
888   Y88b                       888
888    888                       888
888   d88P .d88b.   8888b.   .d88888 888  888
8888888P" d8P  Y8b     "88b d88" 888 888  888
888 T88b  88888888 .d888888 888  888 888  888
888  T88b Y8b.     888  888 Y88b 888 Y88b 888
888   T88b "Y8888  "Y888888  "Y88888  "Y88888
                                          888
                                     Y8b d88P
                                      "Y88*/

$(document).ready(function() {

  var $entries = $("[class*='-entry']:not(.blank)"),
      $window = $(window),
      breakpoints = {
          phone: 480,
          tablet: 700,
          laptop: 1024,
          desktop: 1600
      },
      iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
  		android = /Android/.test(navigator.userAgent),
  		firefox = /Firefox/.test(navigator.userAgent),
  		mobile = iOS || android ? true : false,
  		$scriptEnable = $window.outerWidth() > 700 && !mobile ? true : false,
      $teamPage = $("body").hasClass("team") ? true : false,
      $designPage = $("body").hasClass("design") ? true : false,
      pImgs = [];
  /*********************************************
    UTILITY FUNCTIONS
  *********************************************/

  //Fit interviewee names to the container
  if($window.outerWidth() < breakpoints.tablet) $(".entry-title h1").fitText(1.4);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Function to scale numbers between two ranges.
  Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  };

  //ANIMATE.CSS JQUERY FUNCTION
  $.fn.extend({
    animateCss: function(fadeDirection) {
      var el = $(this),
        animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      var animationName = "fade" + fadeDirection + el.attr('data-dir');
      el.addClass('animated ' + animationName).one("animationend", function(e) {
        el.removeClass('animated ' + animationName);
      });
    }
  });

  /***************************************************************************
  /*8888b.          d8b      888
  d88P  Y88b         Y8P      888
  888    888                  888
  888        888d888 888  .d88888
  888  88888 888P"   888 d88" 888
  888    888 888     888 888  888
  Y88b  d88P 888     888 Y88b 888
   "Y8888P88 888     888  "Y888*/
  /**************************************************************************/

  /********************
    GRID FUNCTION
  ********************/

  function offsetGrid() {
    var hoLast,
      hoThis,
      voLast,
      voThis;
    if ($window.outerWidth() >= breakpoints.phone) {
      if ($window.outerWidth() >= breakpoints.phone && $window.outerWidth() < breakpoints.tablet) {
        hOffset = ['-3vw', '0', '3vw'];
        vOffset = ['2vw', '6vw', '30vw'];
      } else if ($window.outerWidth() >= breakpoints.tablet && $window.outerWidth() < breakpoints.laptop) {
        hOffset = ['-4vw', '0', '4vw'];
        vOffset = ['2vw', '6vw', '16vw', '30vw'];
      } else if ($window.outerWidth() >= breakpoints.laptop) {
        hOffset = ['-1.5', '0', '1.5vw'];
        vOffset = ['-1vw', '3vw', '5vw', '9vw'];
      }
      $entries.each(function(index, value) {
        var el = $(this);
        while (hoThis == hoLast) hoThis = hOffset[Math.floor(Math.random() * hOffset.length)];
        while (voThis == voLast) voThis = vOffset[Math.floor(Math.random() * vOffset.length)];
        if($designPage) {
          var dict = {
            0: "Up",
            1: "Down",
            2: "Left",
            3: "Right"
          };
          el.attr('data-dir', dict[getRandomInt(0, 3)]);
        }
        el.css({
          'left' : hoThis,
          'margin-top': voThis,
          'opacity': '1'
        });
        hoLast = hoThis;
        voLast = voThis;
      });
    } else {
      $entries.each(function() {
        var el = $(this);
        if($designPage) {
          var dict = {
              0: "Up",
              1: "Down"
            };
          el.attr('data-dir', dict[getRandomInt(0, 1)]);
        }
        el.css({
          'opacity': '1',
          'left': '',
          'margin-top': ''
        });
      });
    }
  }

  if ($scriptEnable) offsetGrid();

  /*88888b.                           888 888 d8b
	d88P  Y88b                          888 888 Y8P
	Y88b.                               888 888
	 "Y888b.    .d8888b 888d888 .d88b.  888 888 888 88888b.   .d88b.
	    "Y88b. d88P"    888P"  d88""88b 888 888 888 888 "88b d88P"88b
	      "888 888      888    888  888 888 888 888 888  888 888  888
	Y88b  d88P Y88b.    888    Y88..88P 888 888 888 888  888 Y88b 888
	 "Y8888P"   "Y8888P 888     "Y88P"  888 888 888 888  888  "Y88888
	                                                              888
	                                                         Y8b d88P
	                                                          "Y88*/

	/********************************
	  Parallax
	********************************/
	function parallax() {
		var scrollPos = $window.scrollTop();
		$.each(pImgs, function(index, pImg) {
			if (scrollPos > pImg.iMin && scrollPos < pImg.iMax) {
				var newVal = parseFloat(scrollPos).map(pImg.iMin, pImg.iMax, 0, pImg.oMax).toFixed(2);
				pImg.el.css('transform', 'translateY(-' + newVal + 'px)');
			} else if (scrollPos < pImg.iMin) {
					pImg.el.css('transform', 'translateY(' + 0 + ')');
			} else if (scrollPos > pImg.iMax) {
					pImg.el.css('transform', 'translateY(-' + pImg.oMax + 'px)');
			}
		});
	}

  /*8      d8b          888
  888      Y8P          888
  888                   888
  888      888 .d8888b  888888 .d88b.  88888b.   .d88b.  888d888
  888      888 88K      888   d8P  Y8b 888 "88b d8P  Y8b 888P"
  888      888 "Y8888b. 888   88888888 888  888 88888888 888
  888      888      X88 Y88b. Y8b.     888  888 Y8b.     888
  88888888 888  88888P'  "Y888 "Y8888  888  888  "Y8888  8*/

  /* =======================================================
     EVENT LISTENERS
  ** =====================================================*/

  //================ REFLOW GRID ON ORIENTATION/SIZE CHANGE ================//
  $window.on('resize', function() {
    $scriptEnable = $window.outerWidth() > 700 && !mobile ? true : false;
    offsetGrid();
  });
  var pCheck = window.matchMedia("(orientation: portrait)");
  pCheck.addListener(orientationChange);
  function orientationChange(mql) {
    if(mql.matches) {
      offsetGrid();
    } else {
      offsetGrid();
    }
  }

  $window.on('grid:loaded', function() {
    //================ SHOW PAGE ================//
    $("main").css('opacity', '1');
    //================ PARALLAX ================//
    if ($scriptEnable) {
      var contOffset = $("#flex-grid-team").attr('data-offset'),
          wHeight = $window.outerHeight();
      $entries.each(function(ind, el) {
          var pImg = {};
          pImg.el = $(this);
          if($teamPage) {
            pImg.imgOffset = pImg.el.offset().top;
            // pImg.iMin = parseFloat(pImg.imgOffset) >  parseFloat(wHeight) ? parseFloat(contOffset) + parseFloat(pImg.imgOffset) - parseFloat(wHeight) : contOffset;
            pImg.iMin = parseFloat(contOffset);
            pImg.iMax = parseFloat(contOffset) + pImg.el.offset().top;
            pImg.oMax = parseFloat(pImg.el.outerHeight()) * 0.2 * parseFloat(getRandomInt(1, 6));
          } else if($designPage) {
            pImg.iMax = pImg.el.offset().top;
      			pImg.iMin = parseFloat(pImg.iMax) > $window.outerHeight() ? parseFloat(pImg.iMax) - $window.outerHeight() : 0;
      			pImg.oMax = parseFloat(pImg.el.outerHeight()) * 0.2 * parseFloat(getRandomInt(1, 5));
          }
          pImgs.push(pImg);
          if (ind == $entries.length - 1) requestAnimationFrame(parallax);
      });
      parallax();
    }

    //================ BACKGROUND HEIGHT ================//
    if($teamPage) {
      var $bg = $("#bg"),
          $footerH = $("#footer").outerHeight(),
          $windowOffset = parseFloat($("#flex-grid-team").attr('data-offset')) + parseFloat($("#flex-grid-team").attr('data-height')) - parseFloat($footerH) - parseFloat($window.outerHeight()),
          $windowH = parseFloat($bg.outerHeight()) - parseFloat($footerH),
          $bgState = "full";
    }

    //================ SCROLL HANDLER ================//
    $window.on('scroll', function(e) {
      //Run Parallax
      if ($window.outerWidth() > breakpoints.laptop) this.requestAnimationFrame(parallax);
      //About page contact info showing
      if ($window.scrollTop() >= $windowOffset && $teamPage) {
        this.requestAnimationFrame(function() {
          $bg.css('height', $windowH );//Space for contact info
        });
      } else if ($teamPage) {
        this.requestAnimationFrame(function() {
          $bg.css('height', '');//Standard full height.
        });
      }
    });
  });
});
