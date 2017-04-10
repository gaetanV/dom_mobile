/**
 * (c) Gaetan Vigneron 
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

DOM.register = function () {
    var refDom = "data-touchevent";

    var find = function (e, eventName) {
        if (e instanceof HTMLElement === false) {
                throw("emitEvent need a dom element");
        }
        var node = e;
        while (node !== null || node) {
            if (node[refDom] && typeof node[refDom][eventName] === 'function') {
                return node;
            }
            node = node.parentNode;
        }
        return false;
    };
    return {
        findEvent: function (e, eventName){
           return find(e, eventName);
        },
        emitEvent: function (e, eventName, params) {
            !params && (params = e);
            var node = find(e, eventName);
            if(node){
                params.target = node;
                params.etat = eventName;
                node[refDom][eventName](params);
                return true;
            }
            return false;
        },
        setReference: function (e, eventName, callback) {
            
            if (typeof callback !== 'function') {
                throw("callback need to be a function");
            }
            if (!(e === document.body ? false : document.body.contains(e))) {
                throw("We can't register a event on a dom not in body");
            }
            
            !e[refDom] && (e[refDom] = {});

            if (e[refDom][eventName]) {
                throw("Event " + eventName + " is already defined");
            }

            e[refDom][eventName] = callback;
        }
    }
}();
/**
*  @target dom | jQueryDom
*  @syntax  dom.move {function}  
*  @param way{string} 
*         x
*         -x
*         y
*         -y
*         xy
*  @param speed{integer}        
*  @param callback{function} 
*  @exemple : dom.move("xy", 1, callback);
**/
(function () {
    'use strict';
    var PATH = function (dom, way, speed, callback) {
        var matrix = [1, 0, 0, 1, 0, 0],
                time = performance.now(),
                computedStyle = window.getComputedStyle(dom);

        var t = computedStyle.transform;
        if (t !== "none") {
            var pos = /\((.*)\)/.exec(t);
            matrix = pos[1].split(",");
        }
        ;
        this.matrix = matrix;
        this.timeStart = time;
        this.timeEnd = time;
        this.speed = speed;
        this.dom = dom;
        this.css = {
            transitionDuration: computedStyle.transitionDuration,
            transitionProperty: computedStyle.transitionProperty,
            transitionDelay: computedStyle.transitionDelay,
        }
        dom.style.transition = "none";
        var transform = getTransform(dom);
        var x = parseInt(dom.style.left);
        var y = parseInt(dom.style.top);
        if (transform.y !== 0 || transform.x !== 0) {
            dom.offsetHeight; // REFRESH STYLE
            if (transform.y !== 0) {
                dom.style.top = y + transform.y + "px";
            }
            if (transform.x !== 0) {
                dom.style.left = x + transform.x + "px";
            }
        }
        this.css.left = computedStyle.left;
        this.css.top = computedStyle.top;
        this.transform = {
            start: {x: 0, y: 0},
            end: {x: 0, y: 0},
        }
        this.pos = {
            start: {x: x, y: y},
            end: {x: x, y: y},
        }
        this.way = way;
        this.callback = callback;
        this.refresh = false;
    }
    var  getTransform = function (e) {
        var computedStyle = window.getComputedStyle(e);
        var x = 0, y = 0;
        var t = computedStyle.transform;
        if (t !== "none") {
            var re = /\((.*)\)/
            var pos = re.exec(t);
            var matrix = pos[1].split(",");
            x = parseInt(matrix[4]);
            y = parseInt(matrix[5]);
        }
        return  {x: x, y: y};
    }
    /********************
     * TO DO 
     * ANGLE TRANSFORM
     * SCALE TRANSFORM
     ********************/
    var getOffset = function(e) {
        var bc = e.getBoundingClientRect();
        var computedStyle = window.getComputedStyle(e);
        var paddingTop = parseInt(computedStyle.paddingTop, 10);
        var paddingBottom = parseInt(computedStyle.paddingBottom, 10);
        var paddingLeft = parseInt(computedStyle.paddingLeft, 10);
        var paddingRight = parseInt(computedStyle.paddingRight, 10);
        var h = e.clientHeight;
        var marginTop = parseInt(computedStyle.marginTop, 10);
        var borderTop = parseInt(computedStyle.borderTopWidth, 10)
        h += marginTop + borderTop;
        h += parseInt(computedStyle.borderBottomWidth, 10);
        h += parseInt(computedStyle.marginBottom, 10);
        var w = e.clientWidth;
        w += parseInt(computedStyle.marginRight, 10);
        w += parseInt(computedStyle.borderRightWidth, 10);
        var marginLeft = parseInt(computedStyle.marginLeft, 10);
        var borderLeft = parseInt(computedStyle.borderLeftWidth, 10);
        w += borderLeft + marginLeft;
        return {
            left: bc.left + window.scrollX - marginLeft,
            top: bc.top + window.scrollY - marginTop,
            outer: {height: h, width: w},
            inner: {height: e.clientHeight - (paddingTop + paddingBottom), width: e.clientWidth - (paddingRight + paddingLeft)}
        }
    }
    var event = false;
    DOM.extendDOM(
            {
                move: function (way, speed, callback) {
                    var e = this[0] ? this[0] : this;
                    event = new PATH(e, way, speed, callback);
                }
            }
    );
    DOM.extendEVENT({
        refresh: function () {
            if (event) {
                var d = event;
                if (d.refresh) {
                    var pos = d.refresh.touch;
                    var x = 0;//d.transPosStart.x;
                    var y = 0;//d.transPosStart.y;
                    switch (d.way) {
                        case "-x":
                            x += (d.mouse.x - pos.x) * d.speed;
                            break;
                        case "x":
                            x -= (d.mouse.x - pos.x) * d.speed;
                            break;
                        case "-y":
                            y += (d.mouse.y - pos.y) * d.speed;
                            break;
                        case "y":
                            y -= (d.mouse.y - pos.y) * d.speed;
                            break;
                        case "xy":
                            x -= (d.mouse.x - pos.x) * d.speed;
                            y -= (d.mouse.y - pos.y) * d.speed;
                            break;
                    }

                    d.transform.end = {y: y, x: x};
                    d.dom.style.transform = "matrix(" + d.matrix[0] + "," + d.matrix[1] + "," + d.matrix[2] + "," + d.matrix[3] + ", " + x + ", " + y + ")";
                    d.refresh = false;
                }
            }
        },
        mousemove: function (e) {
            if (event) {
                if (!event.mouse) {
                    event.mouse = e.touch;
                }
                event.refresh = e;
            }
        },
        mouseup: function (e) {
            if (event) {
                EVENTMOVE.stopDragAndDrop();
            }
        }
    });
    var EVENTMOVE = {
        stopDragAndDrop: function () {
            event.pos.end = {x: parseInt(event.css.left) + event.transform.end.x, y: parseInt(event.css.top) + event.transform.end.y};
            event.timeEnd = performance.now()
            var computedStyle = window.getComputedStyle(event.dom);
            event.dom.style.transform = "matrix(" + event.matrix[0] + "," + event.matrix[1] + "," + event.matrix[2] + "," + event.matrix[3] + ",0,0)";
            if (computedStyle.position === "absolute" || computedStyle.position === "fixed" || computedStyle.position === "relative") {
                if (event.css.top === "auto") {
                    event.css.top = getOffset(event.dom).top;
                }
                if (event.css.left === "auto") {
                    event.css.left = getOffset(event.dom).left;
                }
                event.dom.style.top = parseInt(event.css.top) + event.transform.end.y + "px";
                event.dom.style.left = parseInt(event.css.left) + event.transform.end.x + "px";
            }

            var time = event.timeEnd - event.timeStart;
            var x = Math.abs(event.transform.end.x);
            var y = Math.abs(event.transform.end.y);
            event.vitesse = {x: 1 / (time * 1 / x), y: 1 / (time * 1 / y)};
            event.dom.offsetHeight; // REFRESH STYLE
            event.dom.style.transitionDuration = event.css.transitionDuration;
            event.dom.style.transitionProperty = event.css.transitionProperty;
            event.dom.style.transitionDelay = event.css.transitionDelay;
            event.callback(event);
            event = false;
        }
    };
})();

       
/**
 *  @target dom | jQueryDom
 *  @syntax  dom.resizeEvent {function}  
 *  @param eventname{string} 
 *       - Same for MOUSE & TOUCH 
 *         x
 *         y
 *         xy
 *  @param callback{function} 
 *  @exemple : dom.resizeEvent('x', callback);
 **/
(function () {
    'use strict';
    
    var refResizeX = "_rX";
    var refResizeY = "_rY";

    var memwindow = {x: window.innerWidth, y: window.innerHeight};
    
    DOM.extendDOM({
        resizeEvent: function (eventname, callback) {
            var e = this[0] ? this[0] : this;
            switch (eventname) {
                case "x":
                    DOM.register.setReference(e, "resizeX", callback);
                    e.setAttribute(refResizeX, true);
                    break;
                case "y":
                    DOM.register.setReference(e, "resizeY", callback);
                    e.setAttribute(refResizeY, true);
                    break;
                case "xy":
                    DOM.register.setReference(e, "resizeX", callback);
                    e.setAttribute(refResizeX, true);
                    DOM.register.setReference("resizeY", callback);
                    e.setAttribute(refResizeY, true);
                    break;
            }
        }
    });
    DOM.extendEVENT({
        resize: function (e) {
            var w = {x: window.innerWidth, y: window.innerHeight};
            if (w.x !== memwindow.x) {
                memwindow.x = w.x;
                var cible = document.querySelectorAll("[" + refResizeX + "]");
                for (var i = 0; i < cible.length; i++) {
                    DOM.register.emitEvent(cible[i], "resizeX");
                }
            }
            if (w.y !== memwindow.y) {
                memwindow.y = w.y;
                var cible = document.querySelectorAll("[" + refResizeY + "]");
                for (var i = 0; i < cible.length; i++) {
                    DOM.register.emitEvent(cible[i], "resizeY");
                }
            }
        }
    });

})();

/**
 *  @target dom | jQueryDom
 *  @syntax  dom.scrollEvent {function}  
 *  @param eventname{string} 
 *       - Same for MOUSE & TOUCH 
 *         up
 *         down
 *  @param callback{function} 
 *  @exemple : dom.scrollEvent('up', callback);
 **/
(function () {
    'use strict';
    DOM.extendDOM({
        scrollEvent: function (eventname, callback) {
            var e = this[0] ? this[0] : this;
            switch (eventname) {
                case "up":
                    DOM.register.setReference(e, "scrollUp", callback);
                    break;
                case "down":
                    DOM.register.setReference(e, "scrollDown", callback);
                    break;
            }
        }
    });
    DOM.extendEVENT({
        mousewheel: function (e) {
            if( e.detail < 0){
               DOM.register.emitEvent(e.target, "scrollUp");
            }else{
               DOM.register.emitEvent(e.target, "scrollDown");
            }              
        }
    });

})();

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

        e.touch2 && (event.etat = "multitouch");
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
