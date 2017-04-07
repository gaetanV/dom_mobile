(function () {
    'use strict';
    DOM.extendDOM(
            {
                toNatif: function () {
                    //if (typeof jQuery !== 'undefined' && this instanceof jQuery) {return this[0];}
                    if (this[0]) {return this[0];}
                    return this;
                },
                getTransform: function () {
                    var computedStyle = window.getComputedStyle(this.toNatif());
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
                },
                inPage: function () {
                    var n = this.toNatif();
                    return (n === document.body) ? false : document.body.contains(n);

                },
                /********************
                * TO DO 
                * ANGLE TRANSFORM
                * SCALE TRANSFORM
                ********************/
                getOffset: function () {
                    var e = this.toNatif();
        
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
               
            }
    );
    HTMLElement.prototype.removeClass = function (n) {
        if (typeof n === "string") {
            n = n.trim();
            var $i, $a, $b;
            $b = n.split(" ");
            $a = this.className.split(" ");
            for (var i = 0; i < $b.length; i++) {
                var nE = $b[i];
                $i = ($a).indexOf(nE);
                if (($i) !== -1)
                    $a.splice($i, 1);
            }
            this.className = $a.join(" ");
            return true;
        } else
            return false;
    };
    HTMLElement.prototype.addClass = function (n) {
        if (typeof n === "string") {
            n = n.trim();
            var $a, $b;
            if (this.className) {
                $a = this.className.split(" ");
            } else
                $a = [];
            $b = n.split(" ");
            for (var i = 0; i < $b.length; i++) {
                var nE = $b[i];
                if (($a).indexOf(nE) === -1) {
                    $a.push(nE);
                }
            }
            this.className = $a.join(" ");
            return true;
        } else
            return false;
    };
})();



