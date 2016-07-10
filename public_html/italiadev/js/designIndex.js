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
			/*if(oldMargin.slice(0,oldMargin.length-3)< 0) {
				$(this).css('margin-left', getRandomInt(0, 4).toFixed(1)+'vw');
			}
			else{
				$(this).css('margin-left', getRandomInt(-4, 0).toFixed(1)+'vw');
			}*/
		}
		$(".film_entry + .design_entry").css('left', getRandomInt(-4, 0).toFixed(1)+'vw');
	});
});
