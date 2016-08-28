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

	/*********************************************
	  UTILITY FUNCTIONS
	*********************************************/

	//Fit interviewee names to the container
	$(".design-entry .entry-title h1").fitText(0.9);

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

	// var bLazy = new Blazy({
	// 	offset: 600,
	// 	container: "[id^='flex-grid-']",
	// 	saveViewportOffsetDelay: 25,
	// 	selector: 'video, img',
	// 	success: function(ele){
  //       console.log(ele+" has loaded");
  //   },
	// 	error: function(ele, msg){
  //     if(msg === 'missing'){
  //         console.log("Data-src is  for " + ele);
  //     }
  //     else if(msg === 'invalid'){
  //         console.log("Data-src is invalid for " + ele);
  //     }
	// 		else {
	// 			console.log("unknown error for " + ele);
	// 		}
  // 	}
	// });

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
				hOffset = ['-4vw', '0', '4vw'];
				vOffset = ['2vw', '6vw', '30vw', '60vw'];
			} else if ($window.outerWidth() >= breakpoints.tablet && $window.outerWidth() < breakpoints.laptop) {
				hOffset = ['-4vw', '0', '4vw'];
				vOffset = ['2vw', '6vw', '16vw', '30vw'];
			} else if ($window.outerWidth() >= breakpoints.laptop) {
				hOffset = ['0', '2vw'];
				vOffset = ['-1vw', '3vw', '5vw', '9vw'];
			}
			$entries.each(function(index, value) {
				var el = $(this);
				while (hoThis == hoLast) hoThis = hOffset[Math.floor(Math.random() * hOffset.length)];
				while (voThis == voLast) voThis = vOffset[Math.floor(Math.random() * vOffset.length)];
				el.css('left', hoThis);
				el.css('margin-top', voThis);
				hoLast = hoThis;
				voLast = voThis;
				var dict = {
					0: "Up",
					1: "Down",
					2: "Left",
					3: "Right"
				};
				el.attr('data-dir', dict[getRandomInt(0, 3)]);
				el.css('opacity', '1');
			});
		} else {
			$entries.each(function() {
				var el = $(this),
					dict = {
						0: "Up",
						1: "Down"
					};
				el.attr('data-dir', dict[getRandomInt(0, 1)]);
				el.css('opacity', '1');
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
				var newVal = parseFloat(scrollPos).map(pImg.iMin, pImg.iMax, pImg.oMax, 0).toFixed(2);
				pImg.el.css('transform', 'translateY(' + newVal + 'px)');
			} else if (scrollPos < pImg.iMin) pImg.el.css('transform', 'translateY(' + pImg.oMax + 'px)');
			else if (scrollPos > pImg.iMax) pImg.el.css('transform', 'translateY(' + 0 + ')');
		});
	}

	if ($scriptEnable) {
		pImgs = [];
		$entries.each(function(index) {
			var pImg = {};
			pImg.el = $(this);
			pImg.iMax = pImg.el.offset().top;
			pImg.iMin = parseFloat(pImg.iMax) > $window.outerHeight() ? parseFloat(pImg.iMax) - $window.outerHeight() : 0;
			pImg.oMax = parseFloat(pImg.el.outerHeight()) * 0.2 * parseFloat(getRandomInt(1, 6));
			pImgs.push(pImg);
			if (index == $entries.length - 1) requestAnimationFrame(parallax);
		});
	}



	/********************************
	  Year link underline
	********************************/

	if ($scriptEnable) {
		years = [];
		yearLinks = $("#year-links a");

		$("#year-links a").each(function(index) {
			var year = {};
			year.el = $(this);
			year.begin = $("[id^='year-title-']").eq(index).offset().top;
			years.push(year);
		});
	}

	yearLinks = function() {
		var scrollPos = $window.scrollTop();
		$.each(years, function(index, year) {
			if (scrollPos > year.begin) {
				$("#year-links a").removeClass("active");
				year.el.addClass("active");
			}
		});
		if (scrollPos < years[0].begin) {
			years[0].el.addClass("active");
		}
	};

	if ($scriptEnable) yearLinks();

	/********************************
	  Open search scrolling
	********************************/

	searchScroll = function() {
		var scrollPos = $window.scrollTop(),
			scrollDelta = scrollPos - searchPos,
			formPos = $window.outerHeight() * 0.18 - scrollDelta,
			ulTrans = 'translateY(' + formPos + 'px)';
		$sForm.css('transform', ulTrans);
		$("ul.ui-autocomplete").css('transform', ulTrans);
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
		$('#search-btn').addClass('oHidden');
		$('#d-filter form').css({
				'top': '2vmin',
				'width' : '67vw'
		});
		$('#search').css({
			'width' : '67vw',
			'display' : 'block'
		});
		$window.focus();
	}

	function hideSearch() {
		$("article img, article video, article .entry-description, article .entry-title, #page-info h1, #page-info p, [id*='year-title-'], article .entry-tags, article .entry-meet, #year-links").removeClass("oHidden");
		$("#d-filter form, ul.ui-autocomplete").css('transform', '');
		if ($window.outerWidth() < 700) $("#search-btn").css('opacity', 1);
		$("#d-filter").removeClass('static');
		if ($search.hasClass('active') && $search.val().length !== 0) {
			$search.attr('size', $search.val().length);
		}
		$("#d-filter form").removeClass("lSearch");
		$window.focus();
		searching = false;
	}

	function mobHideResults() {
		$('#search-btn').removeClass('oHidden');
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

		bLazy.revalidate();
		bLazy.load($("[data-show=true]"));

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
		minLength: 0,
		delay: 0,
		select: function(event, ui) {
			$search.val(ui.item.label);
			requestAnimationFrame($filterResults);
			hideSearch();
			$window.focus();
			mobShowResults();
			$('#close-btn').addClass("active");
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

	//Scroll events...
		$window.on('scroll', function(e) {
			if ($scriptEnable) {
				this.requestAnimationFrame(parallax);
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

	//Reflow grid on window resize or orientation change
	$window.on('resize', function() {
		$scriptEnable = $window.outerWidth() > 700 ? true : false;
		offsetGrid();
	});
	var orientationCheck = window.matchMedia("(orientation: portrait)");
	orientationCheck.addListener(offsetGrid);

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
		mobHideResults();
		$search.attr('size', 12);
		$search.css('font-size', '');
		requestAnimationFrame($filterResults);
		if ($sForm.hasClass('lSearch')) hideSearch();
		if ($scriptEnable) $sBtn.css('opacity', 1);
	});

	$sInput.focusin(function() {
		$main.removeClass("noResults");
	});

	$sInput.focusout(function() {
		hideSearch();
		if ($sInput.val() === '') {
			$cBtn.removeClass("active");
		}
	});

	$sForm.submit(function() {
		$sInput.blur();
		if ($sInput.val() !== '') $cBtn.addClass("active");
		if ($scriptEnable) $sBtn.css('opacity', 0);
		return false;
	});

	/*******************************
	  KEYBOARD LISTENERS
	*******************************/

	//You hit the enter key
	$search.on("keyup", function(e) {
		if (e.which === 27) {
			$search.val("");
			hideSearch();
			mobShowResults();
			if ($scriptEnable) $sBtn.css('opacity', 0);
		} else {
			if (!searching) {
				showSearch();
			}
			requestAnimationFrame($filterResults);
		}
	});

	if ($scriptEnable) {
		//Hit an alphanumeric key
		$window.on("keyup", function(e) {
			if (e.which >= 65 && e.which <= 90) {
				if (!searching) {
					key = String.fromCharCode(e.which).toLowerCase();
					$search.focus();
					$search.val(key);
					showSearch();
				}
				requestAnimationFrame($filterResults);
				// $sForm.css('top', '');
				// $sAutoUL.css('top', '');
				// if ($search.hasClass('active') && $search.val().length > 20) {
				// 	$fSize = $search.innerWidth() / $search.val().length * 2;
				// 	$search.css('font-size', $fSize);
				// }
				if ($search.hasClass('active') && $search.val().length > 12) {
					$search.attr('size', $search.val().length + 1);
				}
			}
		});
	}
});
