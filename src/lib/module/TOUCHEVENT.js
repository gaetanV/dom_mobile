/**
 *  lib/TOUCHEVENT.js
 *
 *  #touchevent
 *  @target dom | jQueryDom
 *  @syntax  dom.touchevent {function}  
 *  @param eventname{string} 
 *       - Same for MOUSE & TOUCH 
 *         click
 *         longclick
 *         longclickup
 *         touchX
 *         touchY
 *         dbclick
 *         scrollUp
 *         scrollDown
 *         resizeX
 *         resizeY
 *  @param callback{function} 
 *  @exemple : dom.touchevent('dbclick', dbclick);
 *
 **/
(function () {
    'use strict';
    var timeout = false;
    var DEBUG = false;
    var refDom = "data-touchevent";
    var refResizeX = "_resizeX";
    var refResizeY = "_resizeY";
    var param = {
        timeLongclick: 400, //@Time to determinate when is a longClick
        timeDbclick: 200, //@Time to determinate when is a dbclick
        debug: false,
    }
    var event = false;
    var memwindow = {x: window.innerWidth, y: window.innerHeight};
    var EVENT = function (e) {
        this.etat = "init";
        this.target = e.target;
        this.timeStart = performance.now()
        this.mouseStart = e.touch;
        this.mouseEnd = e.touch;
        this.mouseStart2 = false;
        this.mouseEnd2 = false;

        this.vitesse = {x: 0, y: 0};
        this.origin = e.target;
     
        e.touch2 && ( event.etat = "multitouch" );
        timeout && ( clearTimeout(timeout));
    }
    var trace = function (value) {
        param.debug && console.log(value);
    };
    var findParent = function (n, param) {
        while (n !== null) {
            if (n[refDom] && typeof n[refDom][param] === 'function') {
                return n
            }
            var n = n.parentNode;
        }
        return false;
    };
    /**
     -------------------------
     @INIT                   : (touchdown)=> click.etat="init" 
     -------------------------
     @SCROLLUP               : (scrollup)=> click.etat="scrollUp"
     @SCROLLDOWN             : (scrolldown)=> click.etat="scrollDown"
     -------------------------
     ETAT::init
     @INIT                   :  move="whereYouGo"
     @WAITCLICK              : (touchup)                => click.etat="waitclick"
     @LONGCLICK              : (time>timeLongclick)     => click.etat="longclick"
     @MOVEX                  : (touchmove && moveX >4)  => click.etat="moveX"
     @MOVEY                  : (touchmove && moveY >4)  => click.etat="moveY"
     -------------------------
     ETAT::waitclick  
     @INIT                   :  move="waitclick"
     @DBCLICK                : (time>timeDbclick)       => click.etat="dbclick"
     @CLICK                : (not event dbclick)        => click.etat="click" 
     -------------------------
     ETAT::longclick
     @INIT                   :  move="longclick"
     @LONGCLICKUP            : (touchup)                => click.etat="longclickup"
     -------------------------
     **/
    DOM.extendDOM(
            {
                touchevent: function (eventname, callback) {
                    var e = this[0]?this[0]:this;
                    var affectEvent = function (event, callback) {
                        if (typeof callback !== 'function')
                            throw("callback need to be a function");
                        if (!(e === document.body ? false : document.body.contains(e)))
                            throw("We can't register a event on a dom not in body");
                        !e[refDom] && ( e[refDom] = {} );
                        if (e[refDom][event])
                            throw("Event " + event + " is already defined");
                        e[refDom][event] = callback;
                    } 
                    switch (eventname) {
                        default:
                            throw(eventname + "is not a known event try touchX or touchY");
                            break;
                        case "click":
                            affectEvent("click", callback);
                            break;
                        case "longclick":
                            affectEvent("longclick", callback);
                            break;
                        case "longclickup":
                            affectEvent("longclickup", callback);
                            break;
                        case "touchX":
                            affectEvent("touchX", callback);
                            break;
                        case "touchY":
                            affectEvent("touchY", callback);
                            break;
                        case "dbclick":
                            affectEvent("dbclick", callback);
                            break;
                        case "scrollUp":
                            affectEvent("scrollUp", callback);
                            break;
                        case "scrollDown":
                            affectEvent("scrollDown", callback);
                            break;
                        case "resizeX":
                            affectEvent("resizeX", callback);
                            e.setAttribute(refResizeX, true);
                            break;
                        case "resizeY":
                            affectEvent("resizeY", callback);
                            e.setAttribute(refResizeY, true);
                            break;
                        case "zoom":
                            affectEvent("zoom", callback);
                            break;
                        case "DEBUG":
                            DEBUG = callback;
                            break;
                    }
                }
            }
    );
    DOM.extendEVENT({
        resize: function (e) {
            var w = {x: window.innerWidth, y: window.innerHeight};
            if (w.x !== memwindow.x) {
                memwindow.x = w.x;
                var cible = document.querySelectorAll("[" + refResizeX + "]");
                for (var i = 0; i < cible.length; i++) {
                    var node = cible[i];
                    if (node[refDom] && typeof node[refDom].resizeX === 'function') {
                        node[refDom].resizeX(e);
                    }
                }
            }
            if (w.y !== memwindow.y) {
                memwindow.y = w.y;
                var cible = document.querySelectorAll("[" + refResizeY + "]");
                for (var i = 0; i < cible.length; i++) {
                    var node = cible[i];
                    if (node[refDom] && typeof node[refDom].resizeY === 'function') {
                        node[refDom].resizeY(e);
                    }
                }
            }
        },
        click: function (e) {
            if (!event) {
                trace("init");
                event = new EVENT(e);
                if (event.timeout) {
                    clearTimeout(event.timeout);
                }
                timeout = setTimeout(function () {
                    EVENTTOUCH.startLongClick();
                }, param.timeLongclick);
            } else {
                switch (event.etat) {
                    case "waitclick":
                        EVENTTOUCH.stopDbClick();
                        break;
                    case "init":
                        e.touch && (event.etat = "multitouch");
                        break;
                }
            }
        },
        mousemove: function (e) {
            if (event) {
                switch (event.etat) {
                    case "init":
                        if (Math.abs(e.touch.x - event.mouseStart.x) > 4 || Math.abs(e.clientY - event.mouseStart.y) > 4) {
                            EVENTTOUCH.stopFindYourWay(e);
                        }
                        break;
                    case "multitouch":
                        event.mouseEnd = e.touch;
                        event.mouseEnd2 = e.touch2;
                        if (!event.mouseStart2) {
                            event.mouseStart = e.touch;
                            event.mouseStart2 = e.touch2;
                            event.d1 = Math.sqrt(Math.pow(event.mouseStart.x - event.mouseStart2.x, 2) + Math.pow(event.mouseStart.x - event.mouseStart2.x, 2));
                        }
                        e.touch && (e.touch2 && EVENTTOUCH.startZoom());
                    case "zoom":
                        event.mouseEnd = e.touch;
                        event.mouseEnd2 = e.touch2;
                        if (!event.mouseStart2) {
                            event.mouseStart = e.touch;
                            event.mouseStart2 = e.touch2;
                            event.d1 = Math.sqrt(Math.pow(event.mouseStart.x - event.mouseStart2.x, 2) + Math.pow(event.mouseStart.x - event.mouseStart2.x, 2));
                        }
                        EVENTTOUCH.sendZoom();
                        break;
                }
            }
        },
        mouseup: function (e) {
            if (event) {
                switch (event.etat) {
                    default:
                        trace("event end by mouseup");
                        event = false;
                        break;
                    case "multitouch":
                        event = false;
                        break;
                    case "waitlongclick":
                        EVENTTOUCH.stopLongClick();
                        break;
                    case "init":
                        var parent = findParent(event.target, "dbclick");
                        if (parent) {
                            trace("waitclick");
                            event.etat = "waitclick";
                            if (timeout) {
                                clearTimeout(timeout);
                            }
                            timeout = setTimeout(function () {
                                if (event.etat === "waitclick") {
                                    EVENTTOUCH.stopClick();
                                }
                            }, param.timeDbclick);
                        } else {
                            EVENTTOUCH.stopClick();
                        }
                        break;
                }
            }
        },
        mousewheel: function (e) {
            if (!event) {
                event = new EVENT(e);
                event.etat = "scroll";
                e.detail > 0 ? EVENTTOUCH.stopScrollDown() : EVENTTOUCH.stopScrollUp();
                if (event.etat === "scrollUp" || event.etat === "scrollDown") {
                    e.preventDefault();
                }
                event = false;
            }
        }
    });
    var EVENTTOUCH = {
        startZoom: function () {
            if (event && event.etat === "multitouch") {
                var parent = findParent(event.target, "zoom");
                if (parent) {
                    event.etat = "zoom";
                    event.target = parent;
                }
            }
        },
        sendZoom: function () {
            if (event && event.etat === "zoom") {
                event.d2 = Math.sqrt(Math.pow(event.mouseEnd.x - event.mouseEnd2.x, 2) + Math.pow(event.mouseEnd.x - event.mouseEnd2.x, 2));
                event.target[refDom].zoom(event);
            }
        },
        stopScrollUp: function () {
            if (event && event.etat === "scroll") {
                var parent = findParent(event.target, "scrollUp");
                if (parent) {
                    event.target = parent;
                    event.etat = "scrollUp";
                    parent[refDom].scrollUp(event);
                }
            }
        },
        stopScrollDown: function () {
            if (event && event.etat === "scroll") {
                var parent = findParent(event.target, "scrollDown");
                if (parent) {
                    event.target = parent;
                    event.etat = "scrollDown";
                    parent[refDom].scrollDown(event);
                }
            }
        },
        /***
         * @ASYNCH
         **/
        startLongClick: function () {
            if (event) {
                if (event.etat === "init") {
                    var node = event.target;
                    var parent = findParent(event.target, "longclick");
                    if (parent) {
                        event.etat = "waitlongclick";
                        trace("waitlongclick");
                        node[refDom].longclick(event);
                        event.target = parent;
                    }

                }
            }
        },
        stopLongClick: function () {
            if (event) {
                event.etat = "longclick";
                trace("longclick");
                var parent = findParent(event.target, "longclick");
                parent && ( parent[refDom].longclickup(event) );
                event = false;
            } else {
                throw("stopLongClick is call without event");
            }
        },
        /**
         * @ASYNCH
         **/
        stopClick: function () {
            if (event) {
                if (event.etat === "init" || event.etat === "waitclick") {
                    event.etat = "click"
                    trace("click");
                    var parent = findParent(event.target, "click");
                    parent && ( parent[refDom].click(event) );
                }
                event = false;
            }
        },
        /**
         * @ASYNCH
         **/
        stopDbClick: function () {
            if (event) {
                if (event.etat === "waitclick") {
                    event.etat = "dbclick"
                    trace("dbclick");
                    var parent = findParent(event.target, "dbclick");
                    parent && ( parent[refDom].dbclick(event) );
                    event = false;
                }
            }
        },
        stopFindYourWay: function (e) {
            if (event) {
                if (event.etat === "init") {
                    if (Math.abs(e.touch.x - event.mouseStart.x) > Math.abs(e.touch.y - event.mouseStart.y)) {
                        event.etat = "moveX";
                        trace("moveX");
                        var parent = findParent(e.target, "touchX");
                        parent && ( parent[refDom].touchX(event) );
                    } else {
                        event.etat = "moveY";
                        trace("moveY");
                        var parent = findParent(e.target, "touchY");
                        parent && ( parent[refDom].touchY(event) );
                    }
                    event = false;
                }
            }
        }
    }
})();
