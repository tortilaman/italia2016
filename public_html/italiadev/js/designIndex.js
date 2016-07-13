$(document).ready(function() {
	var $entries = $("[class*='_entry']");
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
	$("#search").focusin(function() {
		$('article img').addClass("oHidden");
		$('article .entry_title').addClass("oHidden");
		$("#search").addClass("lSearch");
		$("#d_filter").css('height', '1vw');
		$(".design main").css({
			'margin' : '1vw',
			'padding': '5vw'
		});
		$("#d_filter span").removeClass("oHidden");
	});
	$("#search").focusout(function() {
		$('article img').removeClass("oHidden");
		$('article .entry_title').removeClass("oHidden");
		$(".design main").css({
			'margin' : '5vw',
			'padding': '0.25em'
		});
		$("#d_filter").css('height', '5vw');
		$('#search').removeClass("lSearch");
		$("#d_filter span").addClass("oHidden");
	});

	$(".ui-auto-complete").click(function() {
		console.log("Submitting supposedly");
		$("#d_filter form").submit();
	})

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
	})
	$("#search").autocomplete({
		source: newArray/*,
			minLength: 1,
			focus: function( event, ui) {
				$("#search").val(ui.item.title);
				return false;
			},
			select: function( event, ui ) {
				$("#search").val(ui.item.title);
				return false;
			}*/
	})/*.autocomplete("instance")._renderItem = function(ul, item) {
			return $("<li>").append("<div>" + item.title + "</div>").appendTo(ul);
			console.log(item.title);
		}*/;

	/* =======================================================
	KEYBOARD EVENT LISTENER
	** =====================================================*/
	$("#search").keyup(function() {
		console.log("key pressed");
		var $notTyped = "article:not([data-title*='"+$(this).val()+"'])";
		var $typed = "article[data-title*='"+$(this).val()+"']";
		$($notTyped).hide("fast").addClass("oHidden");
		$($typed).show("fast").removeClass("oHidden");

		if($(this).val() == '') {
			$("[data-title]").show("fast");
		}

		if($(this).val() != '') {
			for( var year = 2012; year < 2016; year++) {
				//All articles are hidden
				console.log("#flex_grid_"+year+" article");
				if(!$("#flex_grid_"+year+" article").not(".oHidden").length) {
					$("#year_title_"+year).hide("fast");
					console.log("Everything in "+year+" is hidden");
				} else {
					console.log("Not everything is hidden");
					$("#year_title_"+year).show("fast");
				}
			}
		}
	})
});
