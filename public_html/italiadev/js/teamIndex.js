/************************************************

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

************************************************/
$(document).ready(function() {
    var $entries = $("[class*='-entry']:not(.blank)"),
        $window = $(window),
        breakpoints = {
            phone: 480,
            tablet: 700,
            laptop: 1024,
            desktop: 1600
        };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* ==================
    	GRID FUNCTION
    ** ================*/

    offsetGrid = function() {
        var hoLast,
            hoThis,
            voLast,
            voThis;

        if ($window.outerWidth() >= breakpoints.phone) {
          if ($window.outerWidth() >= breakpoints.phone && $window.outerWidth() < breakpoints.tablet) {
            hOffset = ['-3vw', '0', '3vw'];
            vOffset = ['2vw', '6vw', '30vw', '60vw'];
          } else if ($window.outerWidth() >= breakpoints.tablet && $window.outerWidth() < breakpoints.laptop) {
            hOffset = ['-4vw', '0', '4vw'];
            vOffset = ['2vw', '6vw', '16vw', '30vw'];
          } else if ($window.outerWidth() >= breakpoints.laptop) {
            hOffset = ['0', '2vw'];
            vOffset = ['-1vw', '3vw', '5vw', '9vw'];
          }
            $entries.each(function(ind, el) {
                while (hoThis == hoLast) hoThis = hOffset[Math.floor(Math.random() * hOffset.length)];
                while (voThis == voLast) voThis = vOffset[Math.floor(Math.random() * vOffset.length)];
                hoLast = hoThis;
                voLast = voThis;
                $(el).css({
                  'left': hoThis,
                  'margin-top': voThis,
                  'opacity': '1'
                });
            });
        } else {
            $entries.each(function(ind, el) {
                $(el).css('opacity', '1');
            });
        }
    };

    offsetGrid();

    /************************************************
    	PARALLAX
    ************************************************/
    pImgs = [];

    parallax = function() {
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
            // else {
            //     pImg.el.css('transform', 'translateY(' + 0 + ')');
            // }
        });
    };

    /************************************************
    	EVENT LISTENERS
    ************************************************/

    //Reflow grid on window resize or orientation change
    $window.on('resize', offsetGrid());
    var pCheck = window.matchMedia("(orientation: portrait)");
    var lCheck = window.matchMedia("(orientation: landscape)");
    pCheck.addListener(offsetGrid);
    lCheck.addListener(offsetGrid);

    $window.on('grid:loaded', function() {
      //================ SHOW PAGE ================//
      $("main").css('opacity', '1');
      //================ PARALLAX ================//
      $entries.each(function(ind, el) {
          var pImg = {};
          pImg.el = $(this);
          pImg.offset = $("#flex-grid-team").attr('data-offset');
          pImg.iMin = pImg.offset;
          pImg.iMax = parseFloat(pImg.offset) + pImg.el.offset().top;
          // pImg.iMin = parseFloat(pImg.iMax) > $window.outerHeight() ? parseFloat(pImg.iMax) - $window.outerHeight() : 0;
          pImg.oMax = parseFloat(pImg.el.outerHeight()) * 0.2 * parseFloat(getRandomInt(1, 6));
          pImgs.push(pImg);
      });
      parallax();
      //================ BACKGROUND HEIGHT ================//
      var $bg = $("#bg"),
          $footerH = $("#footer").outerHeight(),
          $windowOffset = parseFloat($("#flex-grid-team").attr('data-offset')) + parseFloat($("#flex-grid-team").attr('data-height')) - parseFloat($footerH) - parseFloat($window.outerHeight()),
          $windowH = parseFloat($bg.outerHeight()) - parseFloat($footerH),
          $bgState = "full";

      $window.on('scroll', function(e) {
          if ($window.outerWidth() > breakpoints.laptop) this.requestAnimationFrame(parallax);
          if ($window.scrollTop() >= $windowOffset) {
            this.requestAnimationFrame(function() {
              $bg.css('height', $windowH );//Space for contact info
            });
          } else {
            this.requestAnimationFrame(function() {
              $bg.css('height', '');//Standard full height.
            });
          }
      });
    });
});
