//Function to scale numbers between two ranges.
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

$.fn.extend({
    animateCss: function(animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            $(this).css('opacity', 1);
        });
    }
});

/*=================================
	DOCUMENT READY
**===============================*/

$(document).ready(function() {
    //Scrolling Variables
    var scrollPos,
        iterator = 0,
        totalHeight = 0,
        offset = 0,
        $entries = $("section[class*='-section']");

    /*=================================
    	SCROLLING F'NS
    **===============================*/

    function calcHeights() {
        $entries.each(function() {
            $(this).attr('data-offset', offset);
            var $height = $(this).is($entries.first()) && $entries.length > 2 ? $(this).outerHeight() : $(this).outerHeight(true);
            offset += $(this).outerHeight(true);
            $(this).attr('data-height', $(this).outerHeight(true));
            $('body').css('height', totalHeight += $height);
            $(this).css('z-index', $entries.length - iterator);
            $(this).find(".scrollHide").css('z-index', $entries.length - iterator++);
        });
        iterator = offset = totalHeight = 0;
    }

    //Delays implementation of scrolling on pages with lots of images, and avoids scrolling script on mobile.
    if ($(window).outerWidth(true) > 700) {
        if ($("#v-context img").length) {
            $(window).on('load', function() {
                calcHeights();
            });
        } else {
            calcHeights();
        }
    }

    /*=================================
    	PARALLAX SOME DIVS
    **===============================*/

    //Parent needs to be a section level element
    function parallax(parentDiv) {
        var scrolled = $(window).scrollTop(),
            $parent = $(parentDiv),
            $dynDiv = $(parentDiv + ' > div:nth-of-type(2)'),
            $scrollRefDiv = $(parentDiv + ' + section');
        // var $dynDiv = $parent.find()

        if (scrolled > $parent.attr('data-offset') && scrolled < $scrollRefDiv.attr('data-offset')) {
            var oldTop = parseInt($dynDiv.css('top').replace('px', '')),
                inMin = $parent.attr('data-offset'),
                inMax = parseFloat(inMin) + parseFloat($parent.outerHeight()),
                outMin = 0,
                outMax = parseFloat($dynDiv.position().top),
                newVal = -scrolled.map(inMin, inMax, outMin, outMax) + 'px';
            console.log($dynDiv.position().top + ", " + $parent.attr('data-offset'));
            $dynDiv.css('transform', 'translateY(' + newVal + ')');
        } else if (scrolled > $scrollRefDiv.attr('data-offset')) {
            $dynDiv.css('transform', 'translateY(' + -$dynDiv.position().top + ')');
        } else if (scrolled < $parent.attr('data-offset')) {
            $dynDiv.css('margin-top', 0);
        }
    }

    /*=================================
    	SHOW CONTENTS ON SCROLL
    **===============================*/

    function showOnScroll() {
        var page = $("body").attr('class').split(" ")[0],
            offsets = {
                home: [0.5, 0.75],
                italiaIndex: [0, 0.5]
            };

        if (offsets[page]) {
            $entries.each(function(ind, el) {
                var $entry = ind !== 0 ? $entries.eq(ind - 1) : $entries.eq(0),
                    $scrollStart = ind !== 0 ? parseFloat($entry.attr('data-offset')) + (parseFloat($entry.attr('data-height')) * offsets[page][0]) : 0,
                    $scrollEnd = ind !== 0 ? parseFloat($entry.attr('data-offset')) + (parseFloat($entry.attr('data-height')) * offsets[page][1]) : 0,
                    $opacity;
                if (scrollPos > $scrollStart && scrollPos < $scrollEnd) {
                    $opacity = ((scrollPos - $scrollStart) / ($scrollEnd - $scrollStart)).toFixed(2);
                } else if (scrollPos <= $scrollStart) {
                    $opacity = 0;
                } else if (scrollPos >= $scrollEnd) {
                    $opacity = 1;
                }
                $entries.eq(ind).find(".scrollHide").css('opacity', $opacity);
            });
        }
    }

    /*=================================
    	AUTOPLAY ANIMATE IN
    **===============================*/

    if ($("main").hasClass("autoplay") && !$("main").hasClass("home")) {
        $('html, body').animate({
            scrollTop: $("#v-header").outerHeight(true)
        }, 200);
    }

    /*=================================
    	EVENT LISTENERS
    **===============================*/

    //Keep cards at top of page / Control is-scrollable scrolling
    window.addEventListener('scroll', function() {
        this.requestAnimationFrame(function() {
            scrollPos = window.pageYOffset;
            //If we're not on mobile
            if ($(window).outerWidth() > 480) {
                $entries.each(function(ind, el) {
                    var top = parseFloat($(this).attr('data-offset')) + parseFloat($(this).attr('data-height'));

                    if (scrollPos < $(this).attr('data-offset')) { //Fixed
                        $(this).removeClass('is-scrollable');
                        $(this).removeClass('fixedTop');
                        $(this).css('top', 0);
                    } else if (scrollPos > $(this).attr('data-offset') && scrollPos < top) { //Scroll
                        $(this).addClass('is-scrollable');
                        $(this).removeClass('fixedTop');
                        $(this).css({
                            'top': $(this).attr('data-offset') + 'px',
                            'position': null //Remove any js position
                        });
                    } else if (scrollPos > top) { //Stick-to-top
                        $(this).removeClass('is-scrollable');
                        $(this).addClass('fixedTop');
                    }
                    //Original implementation if the bugs become a problem.
                    //$(this).toggleClass('is-scrollable', scrollPos > $(this).attr('data-offset'))
                });
            }
            if ($('body').hasClass('home')) {
                parallax('#home-videos');
            }
            if ($('body').hasClass('v')) {
                parallax('#v-intro');
            }
            //Don't show on scroll on team page.
            if (!$('body').hasClass("team")) showOnScroll();
        });
    });

    //Cards bounce in on page load
    if (!$("main").hasClass("autoplay")) {
        $("[class*='-section']").animateCss("bounceInUp");
    }
});
