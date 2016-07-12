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
});
