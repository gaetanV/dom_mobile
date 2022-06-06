/**
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
*         zoom
*  @param callback{function} 
*  @exemple : dom.touchevent('dbclick', dbclick);
**/
(function () {
    'use strict';
    var timeout = false;
    var DEBUG = false;
    var refDom = "data-touchevent";
    var param = {
        timeLongclick: 400, //@Time to determinate when is a longClick
        timeDbclick: 200, //@Time to determinate when is a dbclick
        debug: false,
    }
    var event = false;
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
        if(event && e.touch2) {
            event.etat = "multitouch";
        }
        timeout && (clearTimeout(timeout));
    }
    var trace = function (value) {
        param.debug && console.log(value);
    };
    /**
     -------------------------
     @INIT                   : (touchdown)=> click.etat="init" 
     -------------------------
     ETAT::init
     @INIT                   :  move="whereYouGo"
     @WAITCLICK              : (touchup)                => click.etat="waitclick"
     @LONGCLICK              : (time>timeLongclick)     => click.etat="longclick"
     @MOVEX                  : (touchmove && moveX >4)  => click.etat="moveX"
     @MOVEY                  : (touchmove && moveY >4)  => click.etat="moveY"
     @MULTITOUCH             : (e.touch)                => click.etat="multitouch"
     -------------------------
     ETAT::waitclick  
     @INIT                   :  move="waitclick"
     @DBCLICK                : (time>timeDbclick)       => click.etat="dbclick"
     @CLICK                  : (not event dbclick)      => click.etat="click"   
     -------------------------
     ETAT:multitouch  
     @ZOOM                   : (e.touch)                => click.etat="zoom"
     -------------------------
     ETAT:zoom  
     @SENDZOOM               :                          => click.etat="zoom"
     -------------------------
     ETAT::longclick
     @INIT                   :  move="longclick"
     @LONGCLICKUP            : (touchup)                => click.etat="longclickup"
     -------------------------
     **/
    DOM.extendDOM(
            {
                touchevent: function (eventname, callback) {
                    var e = this[0] ? this[0] : this;  
                    switch (eventname) {
                        default:
                            throw(eventname + "is not a known event try touchX or touchY");
                            break;
                        case "click":
                            DOM.register.setReference(e, "click", callback);
                            break;
                        case "longclick":
                            DOM.register.setReference(e, "longclick", callback);
                            break;
                        case "longclickup":
                            DOM.register.setReference(e, "longclickup", callback);
                            break;
                        case "touchX":
                            DOM.register.setReference(e, "touchX", callback);
                            break;
                        case "touchY":
                            DOM.register.setReference(e, "touchY", callback);
                            break;
                        case "dbclick":
                            DOM.register.setReference(e, "dbclick", callback);
                            break;
                        case "zoom":
                            DOM.register.setReference(e, "zoom", callback);
                            break;
                        case "DEBUG":
                            DEBUG = callback;
                            break;
                    }
                }
            }
    );
    DOM.extendEVENT({
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
                        var parent = DOM.register.findEvent(event.target, "dbclick");
                        
                        if (parent) {
                            trace("waitclick");
                            event.etat = "waitclick";
                            event.traget = parent;
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
        }
    });
    var EVENTTOUCH = {
        startZoom: function () {
            if (event && event.etat === "multitouch") {
                DOM.register.emitEvent(event.target, "zoom",event);
            }
        },
        sendZoom: function () {
            if (event && event.etat === "zoom") {
                event.d2 = Math.sqrt(Math.pow(event.mouseEnd.x - event.mouseEnd2.x, 2) + Math.pow(event.mouseEnd.x - event.mouseEnd2.x, 2));
                DOM.register.emitEvent(event.target, "zoom",event);
            }
        },
        /***
         * @ASYNCH
         **/
        startLongClick: function () {
            if (event) {
                if (event.etat === "init") {
                    var parent = DOM.register.findEvent(event.target,"longclick",event);
                    if(parent){
                         DOM.register.emitEvent(event.target,"longclick",event);
                         event.target = parent;
                         trace("waitlongclick");
                         event.etat = "waitlongclick";
                    };
                }
            }
        },
        stopLongClick: function () {
            if (event) {
                event.etat = "longclick";
                trace("longclick");
                DOM.register.emitEvent(event.target, "longclickup",event);
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
                    DOM.register.emitEvent(event.target, "click",event);
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
                    DOM.register.emitEvent(event.target, "dbclick",event);
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
                        DOM.register.emitEvent(event.target, "touchX",event);
                    } else {
                        event.etat = "moveY";
                        trace("moveY");
                        DOM.register.emitEvent(event.target, "touchY",event);
                    }
                    event = false;
                }
            }
        }
    }
})();
