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
