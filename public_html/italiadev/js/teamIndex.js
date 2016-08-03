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
	var $entries = $("[class*='-entry']"),
		hOffset = ['-2vw', '0', '2vw'],
		vOffset = ['-2vw', '0', '2vw', '9vw', '16vw', '18vw'];

	function getRandomInt(min, max) {
		return Math.round(Math.random() * (max - min + 1) + min);
	}

	//ANIMATE.CSS JQUERY FUNCTION
	/*$.fn.extend({
		animateCss: function (fadeDirection) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			var animationName = "fade" + fadeDirection + $(this).attr('data-dir');
			$(this).addClass('animated ' + animationName).one("animationend", function (e) {
				$(this).removeClass('animated ' + animationName);
			});
		}
	});*/

	/* ==================
		GRID FUNCTION
	** ================*/

	$entries.each(function (index, value) {
		$(this).css('left', hOffset[Math.floor(Math.random() * hOffset.length)]);
		$(this).css('margin-top', vOffset[Math.floor(Math.random() * vOffset.length)]);
		$(this).css('z-index', index + 1);
		//Prevent consecutive overlaps.
		if (index > 0) {
			var oldMargin = $entries.get(index - 1).style.marginLeft;
		}
		$(".film-entry + .design-entry").css('left', getRandomInt(-4, 0).toFixed(1) + 'vw');

		/*var dict = {
			0: "Up",
			1: "Down",
			2: "Left",
			3: "Right"
		};
		$(this).attr('data-dir', dict[getRandomInt(0, 3)]);*/
	});
});
