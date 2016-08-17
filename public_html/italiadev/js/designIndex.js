function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Function to scale numbers between two ranges.
Number.prototype.map = function(in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

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
    var searching = false,
        keyPlace = "",
        key = "",
        $window = $(window),
        $entries = $("[class*='-entry']:not(.blank)"),
        $dEntries = $(".design-entry:not(.blank)"),
        breakpoints = {
            phone: 480,
            tablet: 700,
            laptop: 1024,
            desktop: 1600
        },
        hOffset,
        vOffset;

    $("#search").focus();

    //Fit interviewee names to the container
    $(".design-entry .entry-title h1").fitText(0.9);

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] == value) {
                return i;
            }
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //ANIMATE.CSS JQUERY FUNCTION
    $.fn.extend({
        animateCss: function(fadeDirection) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            var animationName = "fade" + fadeDirection + $(this).attr('data-dir');
            $(this).addClass('animated ' + animationName).one("animationend", function(e) {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });

    /*8888b.          d8b      888
    d88P  Y88b         Y8P      888
    888    888                  888
    888        888d888 888  .d88888
    888  88888 888P"   888 d88" 888
    888    888 888     888 888  888
    Y88b  d88P 888     888 Y88b 888
     "Y8888P88 888     888  "Y888*/

    /* ==================
    	GRID FUNCTION
    ** ================*/

    function offsetGrid() {
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
                vOffset = ['2vw', '6vw', '16vw', '30vw'];
            } else if ($window.outerWidth() >= breakpoints.laptop) {
                hOffset = ['0', '2vw'];
                vOffset = ['-1vw', '3vw', '9vw', '15vw'];
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
    }

    offsetGrid();

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

    pImgs = [];
    $dictPar = {
        "Left": 1,
        "Right": 2,
        "Up": 4,
        "Down": 6
    };
    $dEntries.each(function(index) {
        var pImg = {};
        pImg.el = $(this);
        pImg.iMax = pImg.el.offset().top;
        pImg.iMin = parseFloat(pImg.iMax) - $window.outerHeight();
        pImg.oMax = parseFloat(pImg.el.outerHeight()) * 0.2 * parseFloat($dictPar[pImg.el.attr('data-dir')]);
        pImgs.push(pImg);
    });

    parallax = function() {
        var scrollPos = $window.scrollTop();
        $.each(pImgs, function(index, pImg) {
            if (scrollPos > pImg.iMin && scrollPos < pImg.iMax) {
                var newVal = parseFloat(scrollPos).map(pImg.iMin, pImg.iMax, 0, pImg.oMax).toFixed(2);
                pImg.el.css('transform', 'translateY(-' + newVal + 'px)');
            } else if (scrollPos < pImg.iMin) pImg.el.css('transform', 'translateY(' + 0 + ')');
            else if (scrollPos > pImg.iMax) pImg.el.css('transform', 'translateY(-' + pImg.oMax + 'px)');
        });
    };

    years = [];
    yearLinks = $("#year-links a");

    $("#year-links a").each(function(index) {
        var year = {};
        year.el = $(this);
        year.begin = $("[id^='year-title-']").eq(index).offset().top;
        years.push(year);
    });

    yearLinks = function() {
        var scrollPos = $window.scrollTop();
        $.each(years, function(index, year) {
            if (scrollPos > year.begin) {
                $("#year-links a").removeClass("active");
                year.el.addClass("active");
            }
        });
    };

    yearLinks();

    /*888
          d88888
         d88P888
        d88P 888 888d888 888d888 8888b.  888  888
       d88P  888 888P"   888P"      "88b 888  888
      d88P   888 888     888    .d888888 888  888
     d8888888888 888     888    888  888 Y88b 888
    d88P     888 888     888    "Y888888  "Y88888
                                              888
                                         Y8b d88P
                                          "Y88*/

    /* ==============================
    	CREATING AUTOCOMPLETE DATA
    ** ============================*/

    var $rawData = $("[data-title]"),
        newArray = [],
        nameArr = [],
        compArr = [],
        tagsArr = [],
        topicsArr = [],
        wordsToSkip = [],
        categories = {
            Category: "1",
            Topic: "2",
            Interviewees: "3",
            Company: "4"
        };
    //Populate newArray with data.
    $rawData.each(function(ind, el) {
        if ($(this).attr('data-title')) {
            var name = $(this).attr('data-title');
            if ($.inArray(name, nameArr) === -1 && name !== "") {
                newArray.push({
                    label: $(this).attr('data-title'),
                    category: "Interviewees"
                });
                nameArr.push(name);
            }
        }
        if ($(this).attr('data-company')) {
            var company = $(this).attr('data-company');
            if ($.inArray(company, compArr) === -1 && company !== "") {
                newArray.push({
                    label: $(this).attr('data-company'),
                    category: "Company"
                });
                compArr.push(company);
            }
        }
        if ($(this).attr('data-tags')) {
            var tags = $(this).attr('data-tags').split(',');
            tags.forEach(function(element, index, array) {
                if ($.inArray(element, tagsArr) === -1 && element !== "") {
                    newArray.push({
                        label: element,
                        category: "Category"
                    });
                    tagsArr.push(element);
                }
            });
        }
        if ($(this).attr('data-topics')) {
            var topics = $(this).attr('data-topics').split(',');
            topics.forEach(function(element, index, array) {
                if ($.inArray(element, topicsArr) === -1 && element !== "") {
                    newArray.push({
                        label: element,
                        category: "Topic"
                    });
                    topicsArr.push(element);
                }
            });
        }
    });

    //Sort first by category and then alphabetically.
    newArray.sort(function(a, b) {
        //		if (a.category == "Category" && b.category == "Interviewees") {
        if (a.category != b.category) {
            //			return -1;
            return categories[a.category] - categories[b.category];
            //		} else if (a.category == "Interviewees" && b.category == "Category") {
            //			return 1;
        } else if (a.category == "Category" && b.category == "Category") {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;
            return 0;
        } else if (a.category == "Topic" && b.category == "Topic") {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;
            return 0;
        } else if (a.category == "Interviewees" && b.category == "Interviewees") {
            var aName = a.label.split(' ');
            var bName = b.label.split(' ');
            if (aName[aName.length - 1] < bName[bName.length - 1]) return -1;
            if (aName[aName.length - 1] > bName[bName.length - 1]) return 1;
            return 0;
        } else if (a.category == "Company" && b.category == "Company") {
            var aCompany = a.label.split(' ');
            var bCompany = b.label.split(' ');
            if (aCompany[aCompany.length - 1] < bCompany[bCompany.length - 1]) return -1;
            if (aCompany[aCompany.length - 1] > bCompany[bCompany.length - 1]) return 1;
            return 0;
        }
    });

    /*8888b.  888                             8888888888 d8b
    d88P  Y88b 888                             888        88P
    Y88b.      888                             888        8P
     "Y888b.   88888b.   .d88b.  888  888  888 8888888    "  88888b.  .d8888b
        "Y88b. 888 "88b d88""88b 888  888  888 888           888 "88b 88K
          "888 888  888 888  888 888  888  888 888           888  888 "Y8888b.
    Y88b  d88P 888  888 Y88..88P Y88b 888 d88P 888           888  888      X88
     "Y8888P"  888  888  "Y88P"   "Y8888888P"  888           888  888  88888*/

    /* ==============================
      SHOW & HIDE SEARCH F'NS
    ** ============================*/

    function showSearch() {
        searching = true;
        $("article img, article video, article .entry-description, article .entry-title, #page-info h1, #page-info p, [id*='year-title-'], article .entry-tags, article .entry-meet").addClass("oHidden");
        $("#d-filter form").addClass("lSearch");
        $("#search").focus();
        if ($window.outerWidth() > breakpoints.phone) {
            $("#d-filter").css({
                'position': 'absolute',
                'height': '6vw',
                'width': '100vw',
                'right': '0',
                'left': '0'
            });
            $(".design main").css({
                'margin': '1vw',
                'padding': '5vw 4vw',
                'width': '98vw'
            });
        }
        $("#d-filter span").addClass("active");
    }

    function hideSearch() {
        $("article img, article video, article .entry-description, article .entry-title, #page-info h1, #page-info p, [id*='year-title-'], article .entry-tags, article .entry-meet").removeClass("oHidden");
        if ($window.outerWidth() > breakpoints.phone) {
            $("#d-filter").css({
                'position': 'fixed',
                'height': '6vw',
                'width': '88vw',
                'right': '6vw',
                'left': '6vw'
            });
            $(".design main").css({
                'margin': '6vw',
                'padding': '0.25em',
                'width': '88vw'
            });
        } else {
            $("#d-filter").css({
                'height': '12vmin',
                'width': '90%',
                'right': '8%',
                'left': '2%'
            });
        }
        $("#d-filter form").removeClass("lSearch");
        $window.focus();
        searching = false;
    }

    /*888888888 888                             888
        888     888                             888
        888     888                             888
        888     88888b.  888  888 88888b.d88b.  88888b.  .d8888b
        888     888 "88b 888  888 888 "888 "88b 888 "88b 88K
        888     888  888 888  888 888  888  888 888  888 "Y8888b.
        888     888  888 Y88b 888 888  888  888 888 d88P      X88
        888     888  888  "Y88888 888  888  888 88888P"   88888*/

    /* ==============================
    	FILTER THUMBNAIL F'N
    ** ============================*/

    function $filterResults() {
        //Interviewees & Films
        $("article[data-title]").each(function() {
            var tags = $(this).attr("data-tags"),
                topics = $(this).attr('data-topics'),
                names = $(this).attr("data-title").toLowerCase(),
                company = $(this).attr("data-company") ? $(this).attr("data-company").toLowerCase() : "",
                //Merge various names and tags if there are tags.
                data1 = tags === "" ? names : names.concat(" ", tags),
                data2 = topics === "" ? data1 : data1.concat(" ", topics),
                data = company === "" ? data2 : data2.concat(" ", company),
                show = false,
                changed,
                $search = $("#search").val().toLowerCase(),
                //Match using the search term starting at the beginning of every word.
                matcher = new RegExp('(^| )' + $search, 'i');

            //Should this thumbnail show, and has that changed?
            if (matcher.test(data)) {
                if ($(this).attr('data-show') == "true") {
                    changed = false;
                } else {
                    changed = true;
                }
                $(this).attr('data-show', "true");
                show = true;
            } else {
                if ($(this).attr('data-show') == "false") {
                    changed = false;
                } else {
                    changed = true;
                }
                $(this).attr('data-show', "false");
                show = false;
            }

            //Trigger the animations
            if (show && changed) {
                $(this).animateCss('In');
                $(this).removeClass("dHidden");
                $(this).next('.blank').removeClass("dHidden");
            } else if (show === false && changed === true) {
                $(this).animateCss('Out');
                $(this).addClass("dHidden");
                $(this).next('.blank').addClass("dHidden");
            }
        });

        //Hide the interviews explanation box
        if ($("article[data-title]").hasClass("dHidden")) {
            $("#page-info").addClass("dHidden");
        } else {
            $("#page-info").removeClass("dHidden");
        }

        //Year Titles
        for (var year = 2012; year <= 2016; year++) {
            //All articles are hidden
            if (!$("#flex-grid-" + year + " article").not(".dHidden").length) {
                $("#year-title-" + year).hide("fast");
                $("#flex-grid-" + year).hide("fast");
            } else {
                $("#flex-grid-" + year).show("fast");
                $("#year-title-" + year).show("fast");
            }
        }

        //Empty search results. Let's make this interesting!
        if (!$("[id*='flex-grid-'] article").not(".dHidden").length) {
            $('main').addClass("noResults");
        } else {
            $('main').removeClass("noResults");
        }
    }

    /*     /*888          888             .d8888b.
          d88888          888            d88P  Y88b
         d88P888          888            888    888
        d88P 888 888  888 888888 .d88b.  888         .d88b.  88888b.d88b.  88888b.
       d88P  888 888  888 888   d88""88b 888        d88""88b 888 "888 "88b 888 "88b
      d88P   888 888  888 888   888  888 888    888 888  888 888  888  888 888  888
     d8888888888 Y88b 888 Y88b. Y88..88P Y88b  d88P Y88..88P 888  888  888 888 d88P
    d88P     888  "Y88888  "Y888 "Y88P"   "Y8888P"   "Y88P"  888  888  888 88888P"
                                                                           888
                                                                           888
                                                                           8*/

    $("#search").autocomplete({
        source: function(request, response) {
            var results = $.ui.autocomplete.filter(newArray, request.term);
            //If search is empty, give list of categories by default.
            if (request.term === "") {
                //creates a new array of just category data
                var index = newArray.map(function(e) {
                    return e.category;
                    //The first index of Topic shows where the end of the categories is.
                }).indexOf('Topic');
                results = newArray.slice(0, index);
            }

            if (!results.length) {
                results = [{
                    label: "Nothing to see here",
                    category: "Oops!"
                }];
            }
            response(results);
        },
        minLength: 0,
        delay: 0,
        select: function(event, ui) {
            $("#search").val(ui.item.label);
            requestAnimationFrame($filterResults);
            hideSearch();
            $window.focus();
            $("#d-filter span").addClass("active");
        }
    }).data('ui-autocomplete')._renderItem = function(ul, item) {
        var term = $('#search').val();
        var label = item.label
            .replace(new RegExp('(^| )' + '(' + term + ')', 'ig'), '$1<span class="highlight">$2</span>');

        return $('<li></li>')
            .data('item.autocomplete', item)
            .append('<a>' + label + '</a>')
            .appendTo(ul);
    };

    $("#search").data('ui-autocomplete')._renderMenu = function(ul, items) {
        var that = this,
            currentCategory = "";
        $.each(items, function(index, item) {
            var li;
            if (item.category != currentCategory) {
                ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                currentCategory = item.category;
            }
            li = that._renderItemData(ul, item);
            if (item.category) {
                li.attr("aria-label", item.category + " : " + item.label);
            }
        });
    };

    // Overrides the default autocomplete filter function to search only from the beginning of the string
    $.ui.autocomplete.filter = function(array, term) {
        var matcher = new RegExp('(^| )' + $.ui.autocomplete.escapeRegex(term), 'i');
        return $.grep(array, function(value) {
            var val = (value.label)
                .split(' ') // You'll get an array of all words here
                .filter(function(word) {
                    return wordsToSkip.indexOf(word) < 0;
                }) // Remove skip words
                .join(' '); // Join the remaining words back together
            return matcher.test(val);
        });
    };
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

    $window.on('scroll', function(e) {
        if ($window.outerWidth() > breakpoints.laptop) this.requestAnimationFrame(parallax);
        this.requestAnimationFrame(yearLinks);
    });

    //Mobile year navigation menu
    $(".mobile-year-menu").on('click', function(e) {
        $("#year-links ul").toggleClass("open");
    });

    $("#year-links a").on('click', function(e) {
        $("#year-links ul").removeClass("open");
    });

    //Reflow grid on window resize or orientation change
    $window.on('resize', offsetGrid());
    var orientationCheck = window.matchMedia("(orientation: portrait)");
    orientationCheck.addListener(offsetGrid);

    //Clicked search close button.
    $("#searchForm > span").on("click", function(e) {
        $('main').removeClass("noResults");
        $("#search").val('');
        requestAnimationFrame($filterResults);
        if ($("#searchForm").hasClass('lSearch')) hideSearch();
        $(this).removeClass("active");
    });

    $("#search").focusin(function() {
        $('main').removeClass("noResults");
    });

    $("#search").focusout(function() {
        hideSearch();
        if ($(this).val() === '') {
            $("#searchForm > span").removeClass("active");
        }
    });

    $("#searchForm").submit(function() {
        $("#search").blur();
        if ($("#search").val() !== '') $("#d-filter span").addClass("active");
        return false;
    });

    $("#search, #search-btn").on("click", function() {
        $('main').removeClass("noResults");
        showSearch();
        $("#search").autocomplete("search", "");
        requestAnimationFrame($filterResults);
    });

    //You hit the enter key
    $("#search").on("keyup", function(e) {
        if (e.which === 27) {
            $(this).val("");
            hideSearch();
        } else {
            if (!searching) {
                showSearch();
            }
            requestAnimationFrame($filterResults);
        }
    });

    //Hit an alphanumeric key
    $window.on("keyup", function(e) {
        if (e.which >= 65 && e.which <= 90) {
            if (!searching) {
                key = String.fromCharCode(e.which).toLowerCase();
                $("#search").focus();
                $("#search").val(key);
                showSearch();
            }

            console.log("changing text size");
        }
    });
});
