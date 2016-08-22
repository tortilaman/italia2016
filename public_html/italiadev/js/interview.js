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
    var $window = $(window),
        $items = $("#v-context > div");
    $(".v-chapter").mouseover(function() {
        var index = $(this).attr('data-chapter'),
            offset = $(this).attr('data-offset');
        $("#v-chapter-ind").css('margin-top', offset + 'em');
        $("#v-description .inner").addClass("dHidden");
        $("#v-description .inner:eq(" + index + ")").removeClass("dHidden");
    });

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* ==================
    	GRID FUNCTION
    ** ================*/

    function offsetGrid() {
        var hoLast,
            hoThis;
        if ($(window).outerWidth() >= "480") {
            hOffset = ['-1vw', '0', '1vw'];
            $items.each(function(index, value) {
                while (hoThis == hoLast) hoThis = hOffset[Math.floor(Math.random() * hOffset.length)];
                $(this).css('transform', 'translateX(' + hoThis + ')');
                hoLast = hoThis;
            });
        }
        // $(window).trigger('loaded');
    }

    offsetGrid();

    /* ==================
    	PARALLAX FUNCTION
    ** ================*/

    pImgs = [];
    $("#v-context").on('scrollable:yes', function() {
        $items.each(function(index) {
            pImg = {};
            pImg.el = $(this);
            pImg.iMax = pImg.el.offset().top;
            pImg.iMin = parseFloat(pImg.iMax) > $window.outerHeight() ? parseFloat(pImg.iMax) - $window.outerHeight() : 0;
            pImg.oMax = parseFloat(pImg.el.outerHeight()) * 0.2 * parseFloat(getRandomInt(1, 6));
            pImgs.push(pImg);
        });
    });
    $("#v-context").on('scrollable:no', function() {
        pImgs = [];
    });

    function parallax() {
        var scrollPos = $window.scrollTop();
        $.each(pImgs, function(index, pImg) {
            if (scrollPos > pImg.iMin && scrollPos < pImg.iMax) {
                var newVal = parseFloat(scrollPos).map(pImg.iMin, pImg.iMax, pImg.oMax, 0).toFixed(2);
                pImg.el.css('transform', 'translateY(' + newVal + 'px)');
            } else if (scrollPos < pImg.iMin) pImg.el.css('transform', 'translateY(' + pImg.oMax + 'px)');
            else if (scrollPos > pImg.iMax) pImg.el.css('transform', 'translateY(' + 0 + ')');
        });
    }

    $window.on('scroll', function(e) {
        if ($window.outerWidth() > 1024) this.requestAnimationFrame(parallax);
    });
});
