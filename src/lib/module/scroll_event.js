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
