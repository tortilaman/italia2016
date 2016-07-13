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
	function getRandomInt(min, max) {
		return Math.round(Math.random() * (max - min + 1) + min);
	}

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
		newArray = new Array();
	$rawData.each(function(int, el) {
		newArray.push($(this).attr('data-title'));
	});

	function showSearch() {
		console.log("show search");
		searching = true;
//		$("#search").val(key);
//		key = "";
		$('article img').addClass("oHidden");
		$('article .entry_title').addClass("oHidden");
		$("#search").addClass("lSearch");
		$("#d_filter").css('height', '1vw');
		$(".design main").css({
			'margin' : '1vw',
			'padding': '5vw'
		});
		$("#d_filter span").removeClass("oHidden");
	}

	function hideSearch() {
		console.log("hide search");
		$('article img').removeClass("oHidden");
		$('article .entry_title').removeClass("oHidden");
		$(".design main").css({
			'margin' : '5vw',
			'padding': '0.25em'
		});
		$("#d_filter").css('height', '5vw');
		$('#search').removeClass("lSearch");
		$("#d_filter span").addClass("oHidden");
		searching = false;
//		$("#search").blur();
//		$(window).focus();
	}

	function $filterResults() {
		if($("#search").val() != '') {
			var $notTyped = "article:not([data-title*='"+$("#search").val()+"'])";
			var $typed = "article[data-title*='"+$("#search").val()+"']";
			$($notTyped).hide("fast").addClass("oHidden");
			$($typed).show("fast").removeClass("oHidden");
		}


		if($("#search").val() == '') {
			$("[data-title]").show("fast");
		}

		if($("#search").val() != '') {
			for( var year = 2012; year < 2016; year++) {
				//All articles are hidden
				if(!$("#flex_grid_"+year+" article").not(".oHidden").length) {
					$("#year_title_"+year).hide("fast");
				} else {
					$("#year_title_"+year).show("fast");
				}
			}
		}
	}

	//AUTOCOMPLETE
	$("#search").autocomplete({
		source: newArray,
		select: function(event, ui) {
			console.log("item selected");
			$("#search").val(ui.item.value);
			hideSearch();
			$(window).focus();
			$filterResults();
		}
	});
	$("#search").focusin(function() {
		console.log("focusin");
		$("#search").val("");
	});
	$("#search").focusout(function() {
		console.log("focusout");
		hideSearch();
	});

	$("#searchForm").submit(function() {
		console.log("submitForm");
		$("#search").blur();
		return false;
	});

	$("search").on("autocompleteselect", function(event, ui) {});

	/* =======================================================
	KEYBOARD EVENT LISTENER
	** =====================================================*/
	$("#search").keyup( function() {
		if(searching == false) {showSearch();}
		$filterResults();
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
