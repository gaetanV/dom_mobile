var DOM;
/**
 *  lib/DOM.js
 *  This file is part of the DOM MOBILE package.
 *  
 * (c) Gaetan Vigneron <gaetan@webworkshops.fr>
 *  V 0.2.0
 *  09/10/2016 
 *
 *  #Touchevent
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
 *  @param callback{function} 
 *  @exemple : dom.touchevent('dbclick', dbclick);
 *
 **/

(function () {
    'use strict';

    DOM = function () {
        var param = {
            touch:'ontouchstart' in window || navigator.maxTouchPoints,
            jQuery: false, 
            fps: 30,
        }
        if (typeof jQuery !== 'undefined') {param.jQuery = true;} else {console.log("WORK WITHOUT JQUERY BUT IT'S COMPATIBLE"); };
        var mem = {
            window: {x: window.innerWidth, y: window.innerHeight},
        }
     
        var dom = {
            resize: {x: [], y: [], xy: []},
        }
        var events={
            mouseup:[],
            click:[],
            mousemove:[],
            mousewheel:[],
            refresh:[],
        }
  

        var TOOLS = function () {
            var touchPos = function (e) {
                if (e.targetTouches) {
                    if (e.targetTouches.length == 1) {
                        var touch = e.targetTouches[0];
                        return{x: touch.pageX, y: touch.pageY};
                    }
                } else {
                    return{x: e.clientX, y: e.clientY};
                }
            }
            var findParent = function (n, param) {
                while (n != null) {
                    if (n.ref && typeof n.ref[param] === 'function') {
                        return n
                    }
                    var n = n.parentNode;
                }
                return false;
            }


            var selection = function (boolean) {
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
            };

            var jQueryToNatif = function (node) {
                if (param.jQuery) { return node[0];}
                return node;
            }


            var isInPage = function (node) {
                node = jQueryToNatif(node);
                if (node instanceof Node) {
                    return (node === document.body) ? false : document.body.contains(node);

                }
                throw("Argument passed is not a node element");
                return false;

            }
            var getTransform = function (node) {
                var computedStyle = window.getComputedStyle(node);
                var transformX = 0;
                var transformY = 0;
                var t = computedStyle.transform;
                if (t != "none") {
                    var re = /\((.*)\)/

                    var pos = re.exec(computedStyle.transform);
                    var matrix = pos[1].split(",");
                    transformX = parseInt(matrix[4]);
                    transformY = parseInt(matrix[5]);

                }
                return  {x: transformX, y: transformY};

            }
            var getOffset = function (node) {
                var e = jQueryToNatif(node);
                var bc = e.getBoundingClientRect();
                var computedStyle = window.getComputedStyle(node);
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

                /********************
                 * TO DO 
                 * ANGLE TRANSFORM
                 * SCALE TRANSFORM
                 */

                return {
                    left: bc.left + window.scrollX - marginLeft,
                    top: bc.top + window.scrollY - marginTop,
                    outer: {height: h, width: w},
                    inner: {height: e.clientHeight - (paddingTop + paddingBottom), width: e.clientWidth - (paddingRight + paddingLeft)}
                }
            }
            return{
                getOffset: getOffset,
                selection: selection,
                jQueryToNatif: jQueryToNatif,
                isInPage: isInPage,
                findParent: findParent,
                touchPos: touchPos,
                getTransform: getTransform,
            }
        }();


        var EVENT =  {
            refresh :  function () {for (var i in events.refresh){events.refresh[i](); }},
            click  : function (e) {for (var i in events.click){events.click[i](e);} },
            resize : function (e) {

                var w = {x: window.innerWidth, y: window.innerHeight};
                //@OPTI RESIZE X
                if (w.x != mem.window.x) {
                    mem.window.x = w.x;
                    for (var i in dom.resize.x) {
                        dom.resize.x[i]();
                    }
                }
            },
            mousemove: function (e) {for (var i in events.mousemove){events.mousemove[i](e); }},
            mousewheel : function (e) {for (var i in events.mousewheel){events.mousewheel[i](e);}},
            mouseup : function (e) {for (var i in events.mouseup){events.mouseup[i](e); }
            }
        };
        
         var DOMEVENT = function () {
            return {
                onresize: function (space, id, callback) {
                    if (dom.resize[space]) {
                        dom.resize[space][id] = callback;
                    }
                },
            }
        }();
   
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
                if (e.toElement == null && e.relatedTarget == null) { EVENT.mouseup(e);}
            });
        }
  
        var extendDOM = function (fngroup) {
            if (param.jQuery) {
                jQuery.fn.extend(fngroup);
            } else {
                for (var i in fngroup) {
                    HTMLElement.prototype[i] = fngroup[i];
                }
            } 
        }    
        var extendEVENT = function (fngroup) {
              for (var i in fngroup) {         
                   switch(i){
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
                            
                   }         
              }
        }    
  
        return({
            
            onresize: DOMEVENT.onresize,
            selection: TOOLS.selection,
            extendDOM: extendDOM,
            extendEVENT:extendEVENT ,
            TOOLS:TOOLS,
            getTime:function(){return performance.now()},
        });
    }();
})();









