(function () {
    'use strict';
    var refResizeX = "_rX";
    var refResizeY = "_rY";
    var refDom = "data-touchevent";

    var memwindow = {x: window.innerWidth, y: window.innerHeight};
    DOM.extendDOM({
        resizeEvent: function (eventname, callback) {
            var e = this[0] ? this[0] : this;
            var affectEvent = function (event, callback) {
                if (typeof callback !== 'function')
                    throw("callback need to be a function");
                if (!(e === document.body ? false : document.body.contains(e)))
                    throw("We can't register a event on a dom not in body");
                !e[refDom] && (e[refDom] = {});
                if (e[refDom][event])
                    throw("Event " + event + " is already defined");
                e[refDom][event] = callback;
            }
            switch (eventname) {
                case "x":
                    affectEvent("resizeX", callback);
                    e.setAttribute(refResizeX, true);
                    break;
                case "y":
                    affectEvent("resizeY", callback);
                    e.setAttribute(refResizeY, true);
                     break;
                case "xy":
                    affectEvent("resizeX", callback);
                    e.setAttribute(refResizeX, true);
                    affectEvent("resizeY", callback);
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
        }
    });

})();
