function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* ============================================================

88888888ba                                   88
88      "8b                                  88
88      ,8P                                  88
88aaaaaa8P'  ,adPPYba,  ,adPPYYba,   ,adPPYb,88  8b       d8
88""""88'   a8P_____88  ""     `Y8  a8"    `Y88  `8b     d8'
88    `8b   8PP"""""""  ,adPPPPP88  8b       88   `8b   d8'
88     `8b  "8b,   ,aa  88,    ,88  "8a,   ,d88    `8b,d8'
88      `8b  `"Ybbd8"'  `"8bbdP"Y8   `"8bbdP"Y8      Y88'
													 d8'
													d8'

** ==========================================================*/
$(document).ready(function () {
	var searching = false,
		keyPlace = "",
		key = "",
		$entries = $("[class*='-entry']:not(.blank)"),
		breakpoints = {phone: 480, tablet: 700, laptop: 1024, desktop: 1600},
		hOffset,
		vOffset;

	$("#search").focus();

	function findWithAttr(array, attr, value) {
		for (var i = 0; i < array.length; i += 1) {
			if (array[i][attr] == value) {
				return i;
			}
		}
	}

	function getRandomInt(min, max) {
		return Math.round(Math.random() * (max - min + 1) + min);
	}

	//ANIMATE.CSS JQUERY FUNCTION
	$.fn.extend({
		animateCss: function (fadeDirection) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			var animationName = "fade" + fadeDirection + $(this).attr('data-dir');
			$(this).addClass('animated ' + animationName).one("animationend", function (e) {
				$(this).removeClass('animated ' + animationName);
			});
		}
	});

	/* ==================
		GRID FUNCTION
	** ================*/

	function offsetGrid() {
		var hoLast,
			hoThis,
			voLast,
			voThis;
		if($(window).outerWidth() >= breakpoints.phone) {
			if($(window).outerWidth() >= breakpoints.phone && $(window).outerWidth() < breakpoints.tablet) {
				hOffset = ['-4vw', '0', '4vw'];
				vOffset = ['2vw', '6vw', '30vw', '60vw'];
			}
			else if($(window).outerWidth() >= breakpoints.tablet && $(window).outerWidth() < breakpoints.laptop) {
				hOffset = ['-4vw', '0', '4vw'];
				vOffset = ['2vw', '6vw', '16vw', '30vw'];
			}
			else if($(window).outerWidth() >= breakpoints.laptop) {
				hOffset = ['-1.5vw', '0', '2vw'];
				vOffset = ['2vw', '3vw', '9vw', '15vw'];
			}
			$entries.each(function (index, value) {
				while(hoThis == hoLast) hoThis = hOffset[Math.floor(Math.random() * hOffset.length)];
				while(voThis == voLast) voThis = vOffset[Math.floor(Math.random() * vOffset.length)];
				$(this).css('left', hoThis);
				$(this).css('margin-top', voThis);
				hoLast = hoThis;
				voLast = voThis;

				var dict = { 0: "Up", 1: "Down", 2: "Left", 3: "Right" };
				$(this).attr('data-dir', dict[getRandomInt(0, 3)]);
			});
		}
	}

	offsetGrid();


	/* =======================================================

	 ad88888ba                                                   88
	d8"     "8b                                                  88
	Y8,                                                          88
	`Y8aaaaa,     ,adPPYba,  ,adPPYYba,  8b,dPPYba,   ,adPPYba,  88,dPPYba,
	  `"""""8b,  a8P_____88  ""     `Y8  88P'   "Y8  a8"     ""  88P'    "8a
			`8b  8PP"""""""  ,adPPPPP88  88          8b          88       88
	Y8a     a8P  "8b,   ,aa  88,    ,88  88          "8a,   ,aa  88       88
	 "Y88888P"    `"Ybbd8"'  `"8bbdP"Y8  88           `"Ybbd8"'  88       88

	** =====================================================*/

	/* ==============================
		CREATING AUTOCOMPLETE DATA
	** ============================*/

	var $rawData = $("[data-title]"),
		newArray =[],
		tagsArr = [],
		wordsToSkip = ['is', 'in'];
	//Populate newArray with data.
	$rawData.each(function (int, el) {
		newArray.push({
			label: $(this).attr('data-title'),
			category: "Interviewees"
		});
		var tags = $(this).attr("data-tags").split(",");
		tags.forEach(function (element, index, array) {
			if ($.inArray(element, tagsArr) === -1 && element !== "") {
				newArray.push({
					label: element,
					category: "Category"
				});
				tagsArr.push(element);
			}
		});
	});

	//Sort first by category and then alphabetically.
	newArray.sort(function (a, b) {
		if (a.category == "Category" && b.category == "Interviewees") {
			return -1;
		} else if (a.category == "Interviewees" && b.category == "Category") {
			return 1;
		} else if (a.category == "Interviewees" && b.category == "Interviewees") {
			var aName = a.label.split(' ');
			var bName = b.label.split(' ');
			if (aName[aName.length - 1] < bName[bName.length - 1]) return -1;
			if (aName[aName.length - 1] > bName[bName.length - 1]) return 1;
			return 0;
		} else if (a.category == "Category" && b.category == "Category") {
			if (a.label < b.label) return -1;
			if (a.label > b.label) return 1;
			return 0;
		}
	});

	/* ==============================
		SHOW & HIDE SEARCH F'NS
	** ============================*/

	function showSearch() {
		searching = true;
		$("article img, article .entry-title, #page-info h1, #page-info p, [id*='year-title-']").addClass("oHidden");
		$("#d-filter form").addClass("lSearch");
		$("#search").focus();
		if($(window).outerWidth() > breakpoints.phone) {
			$("#d-filter").css({
				'height': '1vw',
				'width': '98vw',
				'right': '1vw',
				'left': '1vw'
			});
			console.log("width > 480px");
			$(".design main").css({
				'margin': '1vw',
				'padding': '5vw 4vw'
			});
		}
		$("#d-filter span").addClass("active");
	}

	function hideSearch() {
		$("article img, article .entry-title, #page-info h1, #page-info p, [id*='year-title-']").removeClass("oHidden");
		if($(window).outerWidth() > breakpoints.phone) {
			$("#d-filter").css({
				'height': '6vw',
				'width': '90vw',
				'right': '5vw',
				'left': '5vw'
			});
			$(".design main").css({
				'margin': '6vw 5vw',
				'padding': '0.25em'
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
		$("#d-filter span").removeClass("active");
		$(window).focus();
		searching = false;
	}

	/* ===========================================================
		THUMBNAIL FILTER
	** =========================================================*/

	function $filterResults() {
		//Interviewees & Films
		$("article[data-title]").each(function () {
			var tags = $(this).attr("data-tags"),
				names = $(this).attr("data-title").toLowerCase(),
				//Merge names and tags if there are tags.
				data = tags === "" ? names : names.concat(" ", tags),
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
			} else if (!show && changed) {
				$(this).animateCss('Out');
				$(this).addClass("dHidden");
				$(this).next('.blank').addClass("dHidden");
			}
		});

		//Year Titles
		for (var year = 2012; year < 2016; year++) {
			//All articles are hidden
			if (!$("#flex-grid-" + year + " article").not(".dHidden").length) {
				$("#year-title-" + year).hide("fast");
			} else {
				$("#year-title-" + year).show("fast");
			}
		}

		//Hide the interviews explanation box
		if($("article[data-title]").hasClass("dHidden")) {
			$("#page-info").addClass("dHidden");
		} else {
			$("#page-info").removeClass("dHidden");
		}

		//Empty search results. Let's make this interesting!
		if (!$("[id*='flex-grid-'] article").not(".dHidden").length) {
			$('main').addClass("noResults");
		} else {
			$('main').removeClass("noResults");
		}
	}

	/* =========================================
		AUTOCOMPLETE SEARCH F'N
	** =======================================*/

	$("#search").autocomplete({
		source: function (request, response) {
			var results = $.ui.autocomplete.filter(newArray, request.term);
			//If search is empty, give list of categories by default.
			if (request.term === "") {
				//creates a new array of just category data
				var index = newArray.map(function (e) {
					return e.category;
				}).indexOf('Interviewees'); //find first instance of Interviewees (end of categories)
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
		select: function (event, ui) {
			$("#search").val(ui.item.label);
			$("#d-filter span").addClass("active");
			requestAnimationFrame($filterResults);
			hideSearch();
			$(window).focus();
		}
	}).data('ui-autocomplete')._renderItem = function (ul, item) {
		var term = $('#search').val();
		var label = item.label
			.replace(new RegExp('(^| )' + '(' + term + ')', 'ig'), '$1<span class="highlight">$2</span>');

		return $('<li></li>')
			.data('item.autocomplete', item)
			.append('<a>' + label + '</a>')
			.appendTo(ul);
	};

	$("#search").data('ui-autocomplete')._renderMenu = function (ul, items) {
		var that = this,
			currentCategory = "";
		$.each(items, function (index, item) {
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
	$.ui.autocomplete.filter = function (array, term) {
		var matcher = new RegExp('(^| )' + $.ui.autocomplete.escapeRegex(term), 'i');
		return $.grep(array, function (value) {
			var val = (value.label)
				.split(' ') // You'll get an array of all words here
				.filter(function (word) {
					return wordsToSkip.indexOf(word) < 0;
				}) // Remove skip words
				.join(' '); // Join the remaining words back together
			return matcher.test(val);
		});
	};

	/* =======================================================
		EVENT LISTENERS
	** =====================================================*/

	//Mobile year menu
	$(".mobile-year-menu").on('click', function(e) {
		$("#year-links ul").toggleClass("open");
	});

	$("#year-links a").on('click', function(e) {
		$("#year-links ul").removeClass("open");
	});

	//Reflow grid on window resize or orientation change
	$(window).on('resize', offsetGrid());
	var orientationCheck = window.matchMedia("(orientation: portrait)");
	orientationCheck.addListener(offsetGrid);

	//Clicked search close button.
	$("#searchForm > span").on("click", function (e) {
		$("#search").val('');
		requestAnimationFrame($filterResults);
		if ($("#searchForm").hasClass('lSearch')) hideSearch();
		$(this).removeClass("active");
	});

	$("#search").focusin(function () {
		$(this).val("");
		$('main').removeClass("noResults");
	});

	$("#search").focusout(function () {
		hideSearch();
	});

	$("#searchForm").submit(function () {
		$("#search").blur();
		if ($("#search").val() !== '') $("#d-filter span").addClass("active");
		return false;
	});

	$("#search, #search-btn").on("click", function () {
		$("#search").val("");
		$('main').removeClass("noResults");
		showSearch();
		$("#search").autocomplete("search", "");
		requestAnimationFrame($filterResults);
	});

	//You hit the enter key
	$("#search").on("keyup", function (e) {
		if (e.keyCode === 27) {
			$(this).val("");
			hideSearch();
		} else {
			if (!searching) {
				showSearch();
			}
			requestAnimationFrame($filterResults);
		}
	});

	//Hit a number key
	$(window).on("keyup", function (e) {
		if (!searching && e.keyCode >= 65 && e.keyCode <= 90) {
			key = String.fromCharCode(e.keyCode).toLowerCase();
			$("#search").focus();
			$("#search").val(key);
			showSearch();
		}
	});
});
