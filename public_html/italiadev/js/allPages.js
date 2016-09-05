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
    if ($(window).outerWidth() < 1024) {
        var $nav = $("header.header"),
            $dFilter = $("#d-filter"),
            $yearLinks = $("#year-links");
        $nav.scrollupbar({
            enterViewport: function() {
                $dFilter.css('top', '12vmin');
                $yearLinks.css('top', '12vmin');
            },
            partiallyExitViewport: function() {
                $dFilter.css('top', '0');
                $yearLinks.css('top', '3vmin');
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
