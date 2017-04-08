
/**
 *  lib/DOM.js
 *  
 * (c) Gaetan Vigneron <gaetan@webworkshops.fr>
 *  
 **/
'use strict';
var DOM = function () {

    var domExtend = {
        selection: function(bool){DOM.selection(this,bool)}
    };
    var param = {
        fps: 24,
    }
    var events = {
        mouseup: [],
        click: [],
        mousemove: [],
        mousewheel: [],
        refresh: [],
        resize: [],
    }
    var parseEvent = function (e) {

        if (e.touches) {
            var touch = e.touches[0];
            e.touch = {x: touch.pageX, y: touch.pageY};
            if (e.touches.length > 1) {
                var touch = e.touches[1];
                e.touch2 = {x: touch.pageX, y: touch.pageY};
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
            parseEvent(e);
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
            //parseEvent(e);
            for (var i in events.mouseup) {
                events.mouseup[i](e);
            }
        }
    };
    setInterval(EVENT.refresh, param.fps);
    window.addEventListener("resize", EVENT.resize);
    document.addEventListener((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", EVENT.mousewheel);
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        document.addEventListener("touchstart", EVENT.click);
        document.addEventListener("touchmove", EVENT.mousemove);
        document.addEventListener("touchend", EVENT.mouseup);
        document.addEventListener("touchleave", EVENT.mouseup);
    } else {
        document.addEventListener("mousedown", EVENT.click);
        document.addEventListener("mousemove", EVENT.mousemove);
        document.addEventListener("mouseup", EVENT.mouseup);
        document.addEventListener('mouseout', function (e) {
            if (e.toElement === null && e.relatedTarget === null) {
                EVENT.mouseup(e);
            }
        });
    }
    var Interface = function (entity) {
        for (var i in domExtend) {
            entity[i] = domExtend[i];
        }
        return entity;
    };
    Interface.extendDOM = function (fngroup) {
        for (var i in fngroup) {
            domExtend[i] = fngroup[i];
        }
    };
    Interface.extendEVENT = function (fngroup) {
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
    };
    Interface.selection = function (a, boolean) {
        a = a[0]?a[0]:a;
        if (!boolean) {
            a.style.MozUserSelect = "none";
            a.style.webkitUserSelect = "none";
            a.style.oUserSelect = "none";
            a.style.khtmlUserSelect = "none";
            a.style.msUserSelect = "none";
            a.style.userSelect = "none";
        } else {
            a.style.MozUserSelect = "text";
            a.style.webkitUserSelect = "text";
            a.style.oUserSelect = "text";
            a.style.khtmlUserSelect = "text";
            a.style.msUserSelect = "text";
            a.style.userSelect = "text";
        }
    };
    Interface.extend = function (entity) {
        if (entity === HTMLElement) {
            for (var i in domExtend) {
                entity.prototype[i] = domExtend[i];
            }
        } else {
            if (entity.fn && entity.fn.extend) {
                entity.fn.extend(domExtend);
            }
        }
    }
    return Interface;
}();
