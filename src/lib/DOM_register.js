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