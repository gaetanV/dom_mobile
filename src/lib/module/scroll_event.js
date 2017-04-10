(function () {
    'use strict';
    var refDom = "data-touchevent";
    var findParent = function (n, param) {
        while (n !== null) {
            if (n[refDom] && typeof n[refDom][param] === 'function') {
                return n
            }
            var n = n.parentNode;
        }
        return false;
    };

    DOM.extendDOM({
        scrollEvent: function (eventname, callback) {
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
                case "up":
                    affectEvent("scrollUp", callback);
                    break;
                case "down":
                    affectEvent("scrollDown", callback);
                    break;
            }
        }
    });
    DOM.extendEVENT({
        mousewheel: function (e) {
            if( e.detail < 0){
               var eventName ="scrollUp";
            }else{
               var eventName ="scrollDown";
            }
            var parent = findParent(e.target, eventName);
            if (parent) {
               var event = {};
               event.target = parent;
               event.etat = eventName;
               parent[refDom][eventName](event);
           }                     
        }
    });

})();
