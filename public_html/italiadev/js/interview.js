/*=================================

88888888ba   88888888888         db         88888888ba,  8b        d8
88      "8b  88                 d88b        88      `"8b  Y8,    ,8P
88      ,8P  88                d8'`8b       88        `8b  Y8,  ,8P
88aaaaaa8P'  88aaaaa          d8'  `8b      88         88   "8aa8"
88""""88'    88"""""         d8YaaaaY8b     88         88    `88'
88    `8b    88             d8""""""""8b    88         8P     88
88     `8b   88            d8'        `8b   88      .a8P      88
88      `8b  88888888888  d8'          `8b  88888888Y"'       88

**===============================*/

$(document).ready(function () {

	$(".v-chapter").mouseover(function() {
		var index = $(this).attr('data-chapter'),
			offset = $(this).attr('data-offset');
		$("#v-chapter-ind").css('margin-top', offset+'em');
		$("#v-description .inner").addClass("dHidden");
		$("#v-description .inner:eq("+index+")").removeClass("dHidden");
	});
});
