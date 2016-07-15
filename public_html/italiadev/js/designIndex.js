function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {
	var searching = false,
		keyPlace = "",
		key = "",
		$entries = $("[class*='_entry']");
	$("#search").focus();

	function findWithAttr(array, attr, value) {
		for(var i = 0; i < array.length; i += 1) {
			if(array[i][attr] == value) {
				return i;
			}
		}
	}

	function getRandomInt(min, max) {
		return Math.round(Math.random() * (max - min + 1) + min);
	}

	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			$(this).addClass('animated ' + animationName).one(animationEnd, function() {
				$(this).removeClass('animated ' + animationName);
			});
		}
	});

/* =========================================================================

  ,ad8888ba,               88           88
 d8"'    `"8b              ""           88
d8'                                     88
88             8b,dPPYba,  88   ,adPPYb,88
88      88888  88P'   "Y8  88  a8"    `Y88
Y8,        88  88          88  8b       88
 Y8a.    .a88  88          88  "8a,   ,d88
  `"Y88888P"   88          88   `"8bbdP"Y8

** =======================================================================*/

	$entries.each(function(index, value) {
		$(this).css('left', getRandomInt(-2, 2).toFixed(1)+'vw');
		$(this).css('margin-top', getRandomInt(0, 4).toFixed(1)+'rem');
		$(this).css('z-index', index+1);
		//Prevent consecutive overlaps.
		if(index > 0) {
			var oldMargin = $entries.get(index-1).style.marginLeft;
		}
		$(".film_entry + .design_entry").css('left', getRandomInt(-4, 0).toFixed(1)+'vw');
	});

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

	var $rawData = $("[data-title]"),
		newArray = new Array(),
		tagsArr = [],
		wordsToSkip = ['is', 'in'];
	//Populate newArray with data.
	$rawData.each(function(int, el) {
		newArray.push({label : $(this).attr('data-title'), category: "Interviewees"});
		var tags = $(this).attr("data-tags").split(",");
		tags.forEach(function(element, index, array) {
			if($.inArray(element, tagsArr) === -1 && element != "") {
				newArray.push({label : element, category : "Disciplines"});
				tagsArr.push(element);
			}
		});
	});

	//Sort first by category and then alphabetically.
	newArray.sort(function(a,b) {
		if(a.category == "Disciplines" && b.category == "Interviewees") {
			return -1
		} else if(a.category == "Interviewees" && b.category == "Disciplines") {
			return 1
		} else if(a.category == "Interviewees" && b.category == "Interviewees") {
			var aName = a.label.split(' ');
			var bName = b.label.split(' ');
			if(aName[aName.length - 1] < bName[bName.length - 1]) return -1;
			if(aName[aName.length - 1] > bName[bName.length - 1]) return 1;
			return 0;
		} else if(a.category == "Disciplines" && b.category == "Disciplines") {
			if(a.label < b.label) return -1;
			if(a.label > b.label) return 1;
			return 0;
		}
	});

	function showSearch() {
		searching = true;
		$('article img').addClass("oHidden");
		$('article .entry_title').addClass("oHidden");
		$("#search").addClass("lSearch");
		$("#d_filter").css('height', '1vw');
		$(".design main").css({
			'margin' : '1vw',
			'padding': '5vw'
		});
		$("#d_filter span").addClass("active");
	}

	function hideSearch() {
		$('article img').removeClass("oHidden");
		$('article .entry_title').removeClass("oHidden");
		$(".design main").css({
			'margin' : '5vw',
			'padding': '0.25em'
		});
		$("#d_filter").css('height', '5vw');
		$('#search').removeClass("lSearch");
		$("#d_filter span").removeClass("active");
		searching = false;
	}

	/* ===========================================================
		PAGE ITEM FILTER
	** =========================================================*/

	function $filterResults() {
		//Interviewees & Films
		console.log("======Filtering=====");
		$("article[data-title]").each(function() {
			var tags = $(this).attr("data-tags"),
				names = $(this).attr("data-title").toLowerCase(),
				//Merge names and tags if there are tags.
				data = tags == "" ? names : names.concat(" ", tags),
				show = false,
				changed;

			var $search = $("#search").val().toLowerCase();
			//Match using the search term starting at the beginning of every word.
			var matcher = new RegExp('(^|)'+$search,'i');

			if(matcher.test(data)) {
				if($(this).attr('data-show') == "true") {changed = false;} else {changed = true;}
				console.log("Show is true and Changed is "+changed+" for "+names);
				$(this).attr('data-show', "true");
				show = true;
			} else {
				if($(this).attr('data-show') == "false"){changed = false;} else{changed = true;}
				console.log("Show is false and Changed is "+changed+" for "+names);
				$(this).attr('data-show', "false");
				show = false;
			}

			if($("#search").val() == '') {
				if($(this).attr('data-show') == "true") {changed = false;} else {changed = true;}
				console.log("Show is false and Changed is "+changed+" for "+names);
				$(this).attr('data-show', "true");
				show = true;
			}

			if(show == true && changed == true) {
				var dict = {0: "fadeInDown", 1: "fadeInLeft", 2: "fadeInRight", 3: "fadeInUp"};
				$(this).removeClass("dHidden").animateCss(dict[getRandomInt(0,3)]);
			} else if(show == false && changed == true) {
				var dict = {0: "fadeOutDown", 1: "fadeOutLeft", 2: "fadeOutRight", 3: "fadeOutUp"};
				$(this).addClass("dHidden").animateCss(dict[getRandomInt(0,3)]);
			} else if(show == true) {
				$(this).removeClass("dHidden");
			} else if(show == false) {
				$(this).addClass("dHidden");
			} else {
				console.log(names+" wasn't filtered")
			}
		});
		//Year Titles
		for( var year = 2012; year < 2016; year++) {
			//All articles are hidden
			if(!$("#flex_grid_"+year+" article").not(".dHidden").length) {
				$("#year_title_"+year).hide("fast");
			} else {
				$("#year_title_"+year).show("fast");
			}
		}
		//Empty search results. Can't have that!
		if(!$("[id*='flex_grid_'] article").not(".dHidden").length) {
			$('main').addClass("noResults");
		} else {
			$('main').removeClass("noResults");
		}
	}

	/* =========================================
		AUTOCOMPLETE / LIST FILTER
	** =======================================*/

	$("#search").autocomplete({
		source: function(request, response) {
			var results = $.ui.autocomplete.filter(newArray, request.term);
			if(request.term == 0) {
				var index = newArray.map(function(e) { return e.category; }).indexOf('Interviewees');
				results = newArray.slice(0, index);
			}

			if (!results.length) {
				results = [NoResultsLabel];
			}

			response(results);
		},
		minLength: 0,
		delay: 0,
		select: function(event, ui) {
			$("#search").val(ui.item.label);
			$("#d_filter span").addClass("hideActive");
			requestAnimationFrame($filterResults);
			hideSearch();
			$(window).focus();
		}
	}).data('ui-autocomplete')._renderItem = function( ul, item ) {
		var term = $('#search').val();
		var label = item.label
		.replace(new RegExp('(^| )' + '(' + term + ')', 'ig'), '$1<span class="highlight">$2</span>');

		return $( '<li></li>' )
			.data( 'item.autocomplete', item )
			.append( '<a>' + label + '</a>' )
			.appendTo( ul );
	};

	$("#search").data('ui-autocomplete')._renderMenu = function( ul, items ) {
		var that = this,
			currentCategory = "";
		$.each( items, function( index, item ) {
			var li;
			if ( item.category != currentCategory ) {
				ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
				currentCategory = item.category;
			}
			li = that._renderItemData( ul, item );
			if ( item.category ) {
				li.attr( "aria-label", item.category + " : " + item.label );
			}
		});
	}

	// Overrides the default autocomplete filter function to search only from the beginning of the string
	$.ui.autocomplete.filter = function (array, term) {
		var matcher = new RegExp('(^| )' + $.ui.autocomplete.escapeRegex(term), 'i');
		return $.grep(array, function (value) {
			var val = (value.label)
			.split(' ') // You'll get an array of all words here
			.filter(function(word) { return wordsToSkip.indexOf(word) < 0; }) // Remove skip words
			.join(' '); // Join the remaining words back together
			return matcher.test(val);
		});
	};

	/* =======================================================
		EVENT LISTENERS
	** =====================================================*/

	$("#d_filter span").on("click", function(e) {
		$("#search").val("");
		requestAnimationFrame($filterResults);
		hideSearch();
		$(this).removeClass("hideActive, active");
	});

	$("#search").focusin(function() {
		$(this).val("");
		$('main').removeClass("noResults");
	});

	$("#search").focusout(function() {
		hideSearch();
	});

	$("#searchForm").submit(function() {
		$("#search").blur();
		return false;
	});

	$("#search").on("click", function() {
		$(this).val("");
		$('main').removeClass("noResults");
		showSearch();
		$(this).autocomplete("search", "");
		requestAnimationFrame($filterResults);
	});

	$("#search").on("keyup", function(e) {
		if(e.keyCode === 27) {
			$(this).val("")
			hideSearch();
		} else {
			if(searching == false) {showSearch();}
			requestAnimationFrame($filterResults);
		}
	});

	$(window).on("keyup", function(e) {
		if(searching == false && e.keyCode >= 65 && e.keyCode <=90) {
			key = String.fromCharCode(e.keyCode).toLowerCase();
			$("#search").focus();
			$("#search").val(key);
			showSearch();
		}
	})
});
