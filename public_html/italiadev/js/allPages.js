/* ============================================================
8888888b.                        888
888   Y88b                       888
888    888                       888
888   d88P .d88b.   8888b.   .d88888 888  888
8888888P" d8P  Y8b     "88b d88" 888 888  888
888 T88b  88888888 .d888888 888  888 888  888
888  T88b Y8b.     888  888 Y88b 888 Y88b 888
888   T88b "Y8888  "Y888888  "Y88888  "Y88888
                                          888
                                     Y8b d88P
                                      "Y88P"
** ==========================================================*/

$(document).ready(function() {
    if ($(window).outerWidth() < 700) {
        var $homeBtn = $("#home-btn"),
            $homeURL = $homeBtn.attr('href'),
            $nav = $("header.header"),
            $filters = $("#d-filter, #year-links");
        $homeBtn.attr('href', null);
        $nav.scrollupbar({
            enterViewport: function() {
                $("#d-filter").css('top', '12vmin');
                $("#year-links").css('top', '15vmin');
            },
            partiallyExitViewport: function() {
                $("#d-filter").css('top', '0');
                $("#year-links").css('top', '3vmin');
            }
        });
    }

    $(".v-share-fb").on('click', function() {
        FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: window.location.href,
        }, function(response) {});
    });
});
