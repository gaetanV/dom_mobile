/**
 *  lib/MOVE.js
 *
 *  #move
 *  @target dom | jQueryDom
 *  @syntax  dom.move {function}  
 *  @param way{string} 
 *         x
 *         y
 *         xy
 *  @param speed{integer}        
 *  @param callback{function} 
 *  @exemple : dom.move("xy", 1, callback);
 *  
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
        ;
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

       