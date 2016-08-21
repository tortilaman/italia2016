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
                hOffset = ['-4vw', '0', '4vw'];
                vOffset = ['2vw', '6vw', '30vw', '60vw'];
            } else if ($window.outerWidth() >= breakpoints.tablet && $window.outerWidth() < breakpoints.laptop) {
                hOffset = ['-4vw', '0', '4vw'];
                vOffset = ['2vw', '6vw', '9vw', '15vw'];
            } else if ($window.outerWidth() >= breakpoints.laptop) {
                hOffset = ['-1.5vw', '0', '2vw'];
                vOffset = ['2vw', '3vw', '5vw', '9vw'];
            }
            $entries.each(function(index, value) {
                while (hoThis == hoLast) hoThis = hOffset[Math.floor(Math.random() * hOffset.length)];
                while (voThis == voLast) voThis = vOffset[Math.floor(Math.random() * vOffset.length)];
                $(this).css('left', hoThis);
                $(this).css('margin-top', voThis);
                hoLast = hoThis;
                voLast = voThis;
                var dict = {
                    0: "Up",
                    1: "Down",
                    2: "Left",
                    3: "Right"
                };
                $(this).attr('data-dir', dict[getRandomInt(0, 3)]);
                $(this).css('opacity', '1');
            });
        } else {
            $entries.each(function() {
                var dict = {
                    0: "Up",
                    1: "Down"
                };
                $(this).attr('data-dir', dict[getRandomInt(0, 1)]);
                $(this).css('opacity', '1');
            });
        }
    };

    offsetGrid();

    /************************************************
    	PARALLAX
    ************************************************/

    pImgs = [];
    $entries.each(function(index) {
        var pImg = {};
        pImg.el = $(this);
        pImg.iMax = pImg.el.offset().top;
        pImg.iMin = parseFloat(pImg.iMax) > $window.outerHeight() ? parseFloat(pImg.iMax) - $window.outerHeight() : 0;
        pImg.oMax = parseFloat(pImg.el.outerHeight()) * 0.2 * parseFloat(pImg.el.offset().top < 75 ? getRandomInt(1, 6) : getRandomInt(1, 3));
        pImgs.push(pImg);
    });

    function parallax() {
        var scrollPos = $window.scrollTop();
        $.each(pImgs, function(index, pImg) {
            if (scrollPos > pImg.iMin && scrollPos < pImg.iMax) {
                var newVal = parseFloat(scrollPos).map(pImg.iMin, pImg.iMax, 0, pImg.oMax).toFixed(2);
                pImg.el.css('transform', 'translateY(-' + newVal + 'px)');
            } else if (scrollPos < pImg.iMin) pImg.el.css('transform', 'translateY(' + 0 + ')');
            else if (scrollPos > pImg.iMax) pImg.el.css('transform', 'translateY(-' + pImg.oMax + 'px)');
        });
    }

    parallax();

    /************************************************
    	EVENT LISTENERS
    ************************************************/

    //Reflow grid on window resize or orientation change
    $window.on('resize', offsetGrid());
    var pCheck = window.matchMedia("(orientation: portrait)");
    var lCheck = window.matchMedia("(orientation: landscape)");
    pCheck.addListener(offsetGrid);
    lCheck.addListener(offsetGrid);

    $window.on('scroll', function(e) {
        if ($window.outerWidth() > breakpoints.laptop) this.requestAnimationFrame(function() {
            parallax();
        });
    });
});
