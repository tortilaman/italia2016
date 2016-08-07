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
	var $entries = $("[class*='-entry']");

	function getRandomInt(min, max) {
		return Math.round(Math.random() * (max - min + 1) + min);
	}

	/* ==================
		GRID FUNCTION
	** ================*/

	function offsetGrid() {
		var hoLast,
			hoThis,
			voLast,
			voThis,
			breakpoints = {phone: 480, tablet: 700, laptop: 1024, desktop: 1600};

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
		} else {
			$entries.each(function() {
				var dict = { 0: "Up", 1: "Down"};
				$(this).attr('data-dir', dict[getRandomInt(0, 1)]);
			});
		}
	}

	offsetGrid();

	/* =======================================================
		EVENT LISTENERS
	** =====================================================*/

	//Reflow grid on window resize or orientation change
	$(window).on('resize', offsetGrid());
	var orientationCheck = window.matchMedia("(orientation: portrait)");
	orientationCheck.addListener(offsetGrid);
});
