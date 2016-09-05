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
	/*********************************************
	  "GLOBAL" VARIABLES
	*********************************************/
	var searching = false,
		searchPos = "",
		keyPlace = "",
		key = "",
		$window = $(window),
		iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
		android = /Android/.test(navigator.userAgent),
		firefox = /Firefox/.test(navigator.userAgent),
		mobile = iOS || android ? true : false,
		$scriptEnable = $window.outerWidth() > 700 && !mobile ? true : false,
		$search = $("#search"),
		$sForm = $("#d-filter form"),
		$sUL = $("ul.ui-autocomplete"),
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

	$search.focus();
	if(mobile) {
		$(".entry-thumb-cont video").remove();
	} else if (!mobile) {
		$(".entry-thumb-cont .iosThumb").remove();
	}

	/*********************************************
	  UTILITY FUNCTIONS
	*********************************************/

	//Fit tags to the container
	// $(".design-entry ul").fitText(1);

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
	  Year link underline
	********************************/

	yearLinksLoc = function() {

		yearLinkList.each(function(index) {
			var year = {};
			var sel = $("[id^='year-title-']");
			year.el = $(this);
			if(index >= 1) {
				if(sel.eq(index).offset().top - sel.eq(index - 1).offset().top < $window.outerHeight()) {
					year.begin = sel.eq(index).offset().top - $window.outerHeight() * 0.2;
				} else {
					year.begin = sel.eq(index).offset().top - $window.outerHeight() * 0.7;
				}
			} else {
				year.begin = 0;
			}
			years.push(year);
		});
	};

	yearLinks = function() {
		var scrollPos = $window.scrollTop();
		$.each(years, function(index, year) {
			if (scrollPos > year.begin) {
				yearLinkList.removeClass("active");
				year.el.addClass("active");
			}
		});
		if (scrollPos < years[0].begin) {
			years[0].el.addClass("active");
		}
	};

	if ($scriptEnable) {
		years = [];
		yearLinkList = $("#year-links a");

		yearLinksLoc();
		yearLinks();
	}

	/********************************
	  Scroll while searching
	********************************/

	searchScroll = function() {
		var scrollPos = $window.scrollTop(),
			scrollDelta = scrollPos - searchPos,
			formPos = $window.outerHeight() * 0.18 - scrollDelta,
			ulTrans = 'translateY(' + formPos + 'px)';
		$sForm.css('transform', ulTrans);
		// $("ul.ui-autocomplete").css('transform', ulTrans);
	};

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
			category: "1",
			topic: "2",
			designer: "3",
			company: "4"
		};
	//Populate newArray with data.
	$rawData.each(function(ind) {
		var el = $(this);
		if (el.attr('data-name')) {
			var name = el.attr('data-name');
			if ($.inArray(name, nameArr) === -1 && name !== "") {
				newArray.push({
					label: el.attr('data-name'),
					category: "designer"
				});
				nameArr.push(name);
			}
		}
		if (el.attr('data-company')) {
			var company = el.attr('data-company');
			if ($.inArray(company, compArr) === -1 && company !== "") {
				newArray.push({
					label: el.attr('data-company'),
					category: "company"
				});
				compArr.push(company);
			}
		}
		if (el.attr('data-tags')) {
			var tags = el.attr('data-tags').split(',');
			tags.forEach(function(tag, index, array) {
				if ($.inArray(tag, tagsArr) === -1 && tag !== "") {
					newArray.push({
						label: tag,
						category: "category"
					});
					tagsArr.push(tag);
				}
			});
		}
		if (el.attr('data-topics')) {
			var topics = el.attr('data-topics').split(',');
			topics.forEach(function(topic, index, array) {
				if ($.inArray(topic, topicsArr) === -1 && topic !== "") {
					newArray.push({
						label: topic,
						category: "topic"
					});
					topicsArr.push(topic);
				}
			});
		}
	});

	//Sort first by category and then alphabetically.
	newArray.sort(function(a, b) {
		if (a.category != b.category) {
			return categories[a.category] - categories[b.category];
		} else if (a.category == "category" && b.category == "category") {
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		} else if (a.category == "topic" && b.category == "topic") {
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		} else if (a.category == "designers" && b.category == "designers") {
			var aName = a.label.split(' ');
			var bName = b.label.split(' ');
			if (aName[aName.length - 1] < bName[bName.length - 1]) return -1;
			if (aName[aName.length - 1] > bName[bName.length - 1]) return 1;
			return 0;
		} else if (a.category == "company" && b.category == "company") {
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
		$("article img, article video, article .entry-description, article .entry-title, #page-info h1, #page-info p, [id*='year-title-'], article .entry-tags, article .entry-meet, #year-links").addClass("oHidden");
		if ($window.outerWidth() < 700) $("#search-btn").css('opacity', 0);
		$("#d-filter").addClass("static");
		searchSize();
		$("#d-filter form").addClass("lSearch")/*.css('top', $window.outerHeight() * 0.08)*/;
		$("#d-filter #search").addClass("active").css('font-size', '');
		searchPos = $window.scrollTop();
		searchScroll();
		// $formTop = searchPos + ($window.outerHeight() * 0.18);
		// $ulTop = 'translateY(' + ($window.outerHeight() * 0.18) + 'px)';
		// $("ul.ui-autocomplete").css('transform', $ulTop);
		$search.focus();
		$("#close-btn").addClass("active");
	}

	function mobShowResults() {
		$('#search-btn, #year-links').addClass('oHidden');
		$('#page-info+.design-entry').css('margin-top', '1.5vh');
		$('#d-filter form').css({
				'top': '2vmin',
				'width' : '88vw'
		});
		$('#search').css({
			'width' : '88vw',
			'display' : 'block'
		});
		$window.focus();
	}

	function hideSearch() {
		$("article img, article video, article .entry-description, article .entry-title, #page-info h1, #page-info p, [id*='year-title-'], article .entry-tags, article .entry-meet, #year-links").removeClass("oHidden");
		$("#d-filter form").css('transform', '');
		// $("#d-filter form, ul.ui-autocomplete").css('transform', '');
		if ($window.outerWidth() < 700) $("#search-btn").css('opacity', 1);
		$("#d-filter").removeClass('static');
		searchSize();
		$("#d-filter form").removeClass("lSearch");
		$window.focus();
		searching = false;
	}

	function mobHideResults() {
		$('#search-btn, #year-links').removeClass('oHidden');
		$('#page-info+.design-entry').css('margin-top', '');
		$('#d-filter form').css({
				'top': '',
				'width' : ''
		});
		$('#search').css({
			'width' : '',
			'display' : ''
		});
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
			var el = $(this),
				tags = el.attr("data-tags"),
				topics = el.attr('data-topics'),
				names = el.attr("data-name") ? el.attr("data-name").toLowerCase() : "",
				company = el.attr("data-company") ? el.attr("data-company").toLowerCase() : "",
				//Merge various names and tags if there are tags.
				data1 = tags === "" ? names : names.concat(" ", tags),
				data2 = topics === "" ? data1 : data1.concat(" ", topics),
				data = company === "" ? data2 : data2.concat(" ", company),
				show = false,
				changed,
				$searchVal = $search.val().toLowerCase(),
				//Match using the search term starting at the beginning of every word.
				matcher = new RegExp('(^| )' + $searchVal, 'i');

			//Should this thumbnail show, and has that changed?
			if (matcher.test(data)) {
				if (el.attr('data-show') == "true") {
					changed = false;
				} else {
					changed = true;
				}
				el.attr('data-show', "true");
				show = true;
			} else {
				if (el.attr('data-show') == "false") {
					changed = false;
				} else {
					changed = true;
				}
				el.attr('data-show', "false");
				show = false;
			}

			//Trigger the animations
			if (show && changed) {
				el.animateCss('In');
				el.removeClass("dHidden");
				el.next('.blank').removeClass("dHidden");
			} else if (show === false && changed === true) {
				el.animateCss('Out');
				el.addClass("dHidden");
				el.next('.blank').addClass("dHidden");
			}
		});

		//Hide the interviews explanation box
		if ($("article[data-title]").hasClass("dHidden")) {
			$("#page-info div").addClass("dHidden");
		} else {
			$("#page-info div").removeClass("dHidden");
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

		//Update the positions of year links when they change.
		if($scriptEnable) yearLinksLoc();
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

	$search.autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(newArray, request.term);
			//If search is empty, give list of categories by default.
			if (request.term === "") {
				//creates a new array of just category data
				var index = newArray.map(function(e) {
					return e.category;
					//The first index of Topic shows where the end of the categories is.
				}).indexOf('topic');
				results = newArray.slice(0, index);
			}

			if (!results.length) {
				results = [{
					label: " ",
					category: "Sorry, I couldn't find anything."
        }];
			}
			response(results);
		/**********************************************
			Selected a result
		**********************************************/
		},
		appendTo: "#searchForm",
		minLength: 0,
		delay: 0,
		select: function(event, ui) {
			$search.val(ui.item.label);
			requestAnimationFrame($filterResults);
			hideSearch();
			$window.focus();
			if(mobile) mobShowResults();
			$('#close-btn').addClass("active");
		},
		open: function( event, ui) {
			var calcHeight = parseFloat($('.ui-autocomplete').offset().top) + parseFloat($('.ui-autocomplete').outerHeight());
			$("body").css('min-height', calcHeight);
		},
		close: function( event, ui) {
			$("body").css('min-height', '');
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

	$search.data('ui-autocomplete')._renderMenu = function(ul, items) {
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

	var fSizeIn = $search.css('font-size').replace('px', '');
	searchSize = function() {
		if ($search.hasClass('active') && $search.val().length !== 0) {
			var len = $search.val().length,
					lenOffset = Math.floor(len.map(8, 40, 2, -3));
					if(len > 20) {
						var fSizeOut = parseFloat(parseFloat(fSizeIn) * 0.7),
								newFSize = Math.floor(len.map(20, 40, parseInt(fSizeIn),parseFloat(fSizeOut)));
						console.log("original size: " + fSizeIn +", min size: " + fSizeOut + ", new size: "+newFSize);
						$search.css('font-size', newFSize+'px');
						$cBtn.css('font-size', newFSize+'px');
					}
			$search.attr('size', len + parseFloat(lenOffset));

			// $cBtn.css({
			// 	'left' : cBtnLeft+"px",
			// 	'right' : 'auto'
			// });
		}
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

	$window.on('load', function() {
		$(document).trigger('grid:loaded');
	});

	//Scroll events...
		$window.on('scroll', function(e) {
			if ($scriptEnable) {
				// this.requestAnimationFrame(parallax);
				this.requestAnimationFrame(yearLinks);
			}
			if ($sForm.hasClass('lSearch')) {
				this.requestAnimationFrame(searchScroll);
			}
		});

	//Mobile year navigation menu
	var $mMenu = $(".mobile-year-menu"),
		$mMenuUL = $("#year-links ul"),
		$mMenuA = $("#year-links a");

	$mMenu.on('click', function(e) {
		$mMenuUL.toggleClass("open");
	});

	$mMenuA.on('click', function(e) {
		$mMenuUL.removeClass("open");
		$mMenuA.removeClass("active");
	});

	/*******************************
	  SEARCH LISTENERS
	*******************************/
	var $sBtn = $('#search-btn'),
		$cBtn = $('#close-btn'),
		$sInput = $('#search'),
		$main = $('main'),
		$sAutoUL = $("ul.ui-autocomplete");
	//Search Button
	$main = $('main');
	$("#search, #search-btn").on("click", function() {
		$main.removeClass("noResults");
		showSearch();
		$sInput.autocomplete("search", "");
		requestAnimationFrame($filterResults);
	});

	//Clicked search close button.
	$cBtn.on("click", function(e) {
		$main.removeClass("noResults");
		$cBtn.removeClass("active");
		$sInput.val('');
		if (mobile) mobHideResults();
		$search.attr('size', 12);
		$search.css('font-size', '');
		requestAnimationFrame($filterResults);
		if ($sForm.hasClass('lSearch')) hideSearch();
		if (!$scriptEnable) $sBtn.css('opacity', 1);
	});

	deFocus = function(event) {
		if($(event.target).attr('id') != 'close-btn' && $sForm.hasClass('lSearch')) {
			$sInput.val('');
			hideSearch();
			$("body").off('click', deFocus());
		}
	};

	$sInput.focusin(function() {
		$main.removeClass("noResults");
	});

	$sForm.submit(function() {
		$sInput.blur();
		if ($sInput.val() !== '') $cBtn.addClass("active");
		if (!$scriptEnable) $sBtn.css('opacity', 0);
		return false;
	});

	/*******************************
	  KEYBOARD LISTENERS
	*******************************/

	// if ($scriptEnable) {
		$window.on("keyup", function(event) {
			//Hit an alphanumeric key
			if (event.which >= 65 && event.which <= 90) {
				if (!searching && $scriptEnable) {
					showSearch();
					key = String.fromCharCode(event.which).toLowerCase();
					$search.focus();
					$search.val(key);
				}
				requestAnimationFrame($filterResults);
				searchSize();
			}
			//Pressed Enter
			else if (event.which == '13') {
				if(searching) {
					requestAnimationFrame($filterResults);
					hideSearch();
					$window.focus();
					if(mobile) mobShowResults();
					$('#close-btn').addClass("active");
				}
			}
			//Pressed Escape
			else if (event.which == '27') {
				if(searching) {
					$search.val('');
					hideSearch();
				}
			}
			else if (event.which == 38 || event.which <= 40) {
				searchSize();
			}
		});
	// }
});
