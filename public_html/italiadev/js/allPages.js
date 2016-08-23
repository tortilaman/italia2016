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
    if ($(window).outerWidth() < 480) {
        var $homeBtn = $(".home-btn"),
            $homeURL = $homeBtn.attr('href'),
            $nav = $("header.header");
        $homeBtn.attr('href', null);

        //Click event listener.
        $("button.tcon-menu--xcross").on('click', function(e) {
            $nav.toggleClass("menuOpen");
            $(this).toggleClass("menuOpen");
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

/*=======================================================
8888888
  888
  888
  888   .d8888b .d88b.  88888b.  .d8888b
  888  d88P"   d88""88b 888 "88b 88K
  888  888     888  888 888  888 "Y8888b.
  888  Y88b.   Y88..88P 888  888      X88
8888888 "Y8888P "Y88P"  888  888  88888P'
=======================================================*/
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD module
        define(factory);
    } else if (typeof exports === 'object') {
        // CommonJS-like environment (i.e. Node)
        module.exports = factory();
    } else {
        // Browser global
        root.transformicons = factory();
    }
}(this || window, function() {

    // ####################
    // MODULE TRANSFORMICON
    // ####################
    'use strict';

    var
        tcon = {}, // static class
        _transformClass = 'tcon-transform',

        // const
        DEFAULT_EVENTS = {
            transform: ['click'],
            revert: ['click']
        };

    // ##############
    // private methods
    // ##############

    /**
     * Normalize a selector string, a single DOM element or an array of elements into an array of DOM elements.
     * @private
     *
     * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements
     * @returns {array} Array of DOM elements
     */
    var getElementList = function(elements) {
        if (typeof elements === 'string') {
            return Array.prototype.slice.call(document.querySelectorAll(elements));
        } else if (typeof elements === 'undefined' || elements instanceof Array) {
            return elements;
        } else {
            return [elements];
        }
    };

    /**
     * Normalize a string with eventnames separated by spaces or an array of eventnames into an array of eventnames.
     * @private
     *
     * @param {(string|array)} elements - String with eventnames separated by spaces or array of eventnames
     * @returns {array} Array of eventnames
     */
    var getEventList = function(events) {
        if (typeof events === 'string') {
            return events.toLowerCase().split(' ');
        } else {
            return events;
        }
    };

    /**
     * Attach or remove transformicon events to one or more elements.
     * @private
     *
     * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
     * @param {object} [events] - An Object containing one or more special event definitions
     * @param {boolean} [remove=false] - Defines wether the listeners should be added (default) or removed.
     */
    var setListeners = function(elements, events, remove) {
        var
            method = (remove ? 'remove' : 'add') + 'EventListener',
            elementList = getElementList(elements),
            currentElement = elementList.length,
            eventLists = {};

        // get events or use defaults
        for (var prop in DEFAULT_EVENTS) {
            eventLists[prop] = (events && events[prop]) ? getEventList(events[prop]) : DEFAULT_EVENTS[prop];
        }

        // add or remove all events for all occasions to all elements
        while (currentElement--) {
            for (var occasion in eventLists) {
                var currentEvent = eventLists[occasion].length;
                while (currentEvent--) {
                    elementList[currentElement][method](eventLists[occasion][currentEvent], handleEvent);
                }
            }
        }
    };

    /**
     * Event handler for transform events.
     * @private
     *
     * @param {object} event - event object
     */
    var handleEvent = function(event) {
        tcon.toggle(event.currentTarget);
    };

    // ##############
    // public methods
    // ##############

    /**
     * Add transformicon behavior to one or more elements.
     * @public
     *
     * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
     * @param {object} [events] - An Object containing one or more special event definitions
     * @param {(string|array)} [events.transform] - One or more events that trigger the transform. Can be an Array or string with events seperated by space.
     * @param {(string|array)} [events.revert] - One or more events that trigger the reversion. Can be an Array or string with events seperated by space.
     * @returns {transformicon} transformicon instance for chaining
     */
    tcon.add = function(elements, events) {
        setListeners(elements, events);
        return tcon;
    };

    /**
     * Remove transformicon behavior from one or more elements.
     * @public
     *
     * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
     * @param {object} [events] - An Object containing one or more special event definitions
     * @param {(string|array)} [events.transform] - One or more events that trigger the transform. Can be an Array or string with events seperated by space.
     * @param {(string|array)} [events.revert] - One or more events that trigger the reversion. Can be an Array or string with events seperated by space.
     * @returns {transformicon} transformicon instance for chaining
     */
    tcon.remove = function(elements, events) {
        setListeners(elements, events, true);
        return tcon;
    };

    /**
     * Put one or more elements in the transformed state.
     * @public
     *
     * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be transformed
     * @returns {transformicon} transformicon instance for chaining
     */
    tcon.transform = function(elements) {
        getElementList(elements).forEach(function(element) {
            element.classList.add(_transformClass);
        });
        return tcon;
    };

    /**
     * Revert one or more elements to the original state.
     * @public
     *
     * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be reverted
     * @returns {transformicon} transformicon instance for chaining
     */
    tcon.revert = function(elements) {
        getElementList(elements).forEach(function(element) {
            element.classList.remove(_transformClass);
        });
        return tcon;
    };

    /**
     * Toggles one or more elements between transformed and original state.
     * @public
     *
     * @param {(string|element|array)} elements - Selector, DOM element or Array of DOM elements to be toggled
     * @returns {transformicon} transformicon instance for chaining
     */
    tcon.toggle = function(elements) {
        getElementList(elements).forEach(function(element) {
            tcon[element.classList.contains(_transformClass) ? 'revert' : 'transform'](element);
        });
        return tcon;
    };

    return tcon;
}));
