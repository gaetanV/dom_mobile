var DOM;
/**
 *  lib/DOM.js
 *  This file is part of the DOM MOBILE package.
 *  
 * (c) Gaetan Vigneron <gaetan@webworkshops.fr>
 *  V 0.3.0
 *  
 *  09/10/2016 
 **/
(function () {
    'use strict';

    DOM = function () {
        var param = {
            touch: 'ontouchstart' in window || navigator.maxTouchPoints,
            jQuery: false,
            fps: 30,
        }
        if (typeof jQuery !== 'undefined') {
            param.jQuery = true;
        } else {
            console.log("WORK WITHOUT JQUERY BUT IT'S COMPATIBLE");
        };
        var events = {
            mouseup: [],
            click: [],
            mousemove: [],
            mousewheel: [],
            refresh: [],
            resize: [],
        }
        var parseEvent = function (e) {
            if (e.targetTouches) {
                if (e.targetTouches.length == 1) {
                    var touch = e.targetTouches[0];
                    e.touch = {x: touch.pageX, y: touch.pageY};
                }
            } else {
                e.touch = {x: e.clientX, y: e.clientY};
            }
        };
        var EVENT = {
            refresh: function () {
                for (var i in events.refresh) {
                    events.refresh[i]();
                }
            },
            click: function (e) {
                parseEvent(e);
                for (var i in events.click) {
                    events.click[i](e);
                }
                return false;
            },
            resize: function (e) {
                for (var i in events.resize) {
                    events.resize[i](e);
                }
                return false;
            },
            mousemove: function (e) {
                parseEvent(e);
                for (var i in events.mousemove) {
                    events.mousemove[i](e);
                }
            },
            mousewheel: function (e) {
                parseEvent(e);
                for (var i in events.mousewheel) {
                    events.mousewheel[i](e);
                }
            },
            mouseup: function (e) {
                parseEvent(e);
                for (var i in events.mouseup) {
                    events.mouseup[i](e);
                }
            }
        };
        setInterval(EVENT.refresh, param.fps);
        //@DOM EVENT 
        window.addEventListener("resize", EVENT.resize);
        document.addEventListener((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", EVENT.mousewheel);
        if (param.touch) {
            document.addEventListener("touchstart", EVENT.click);
            document.addEventListener("touchmove", EVENT.mousemove);
            document.addEventListener("touchend", EVENT.mouseup);
            document.addEventListener("touchleave", EVENT.mouseup);
        } else {
            document.addEventListener("mousedown", EVENT.click);
            document.addEventListener("mousemove", EVENT.mousemove);
            document.addEventListener("mouseup", EVENT.mouseup);
            document.addEventListener('mouseout', function (e) {
                if (e.toElement == null && e.relatedTarget == null) {
                    EVENT.mouseup(e);
                }
            });
            //document.querySelector("*").onmousedown=function() {return false;} //NO SELECT

        }
        var extendDOM = function (fngroup) {
            if (param.jQuery) {
                jQuery.fn.extend(fngroup);
            }
            for (var i in fngroup) {
                    HTMLElement.prototype[i] = fngroup[i];
            }
          
        }
        var extendEVENT = function (fngroup) {
            for (var i in fngroup) {
                switch (i) {
                    default:
                        throw(i + " is not a known extendEVENT");
                        break;
                    case "click":
                        events.click.push(fngroup[i]);
                        break;
                    case "mouseup":
                        events.mouseup.push(fngroup[i]);
                        break;
                    case "mousemove":
                        events.mousemove.push(fngroup[i]);
                        break;
                    case "mousewheel":
                        events.mousewheel.push(fngroup[i]);
                        break;
                    case "refresh":
                        events.refresh.push(fngroup[i]);
                        break;
                    case "resize":
                        events.resize.push(fngroup[i]);
                        break;

                }
            }
        }
        extendDOM({
            toNatif: function () {
                if (typeof jQuery !== 'undefined' && this instanceof jQuery) {
                    return this[0];
                }
                return this;
            }
        });
        return({
            extendDOM: extendDOM,
            extendEVENT: extendEVENT,
            selection: function (boolean) {
                if (!boolean) {
                    var a = document.querySelector("*");
                    a.style.MozUserSelect = "none";
                    a.style.webkitUserSelect = "none";
                    a.style.oUserSelect = "none";
                    a.style.khtmlUserSelect = "none";
                    a.style.msUserSelect = "none";
                    a.style.userSelect = "none";

                } else {
                    var a = document.querySelector("*");
                    a.style.MozUserSelect = "text";
                    a.style.webkitUserSelect = "text";
                    a.style.oUserSelect = "text";
                    a.style.khtmlUserSelect = "text";
                    a.style.msUserSelect = "text";
                    a.style.userSelect = "text";
                }
            },
            getTime: function () {
                return performance.now()
            },
        });
    }();
})();









