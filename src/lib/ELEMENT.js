/**
 *  lib/ELEMENT.js
 *  This file is part of the DOM MOBILE package.
 *  
 * (c) Gaetan Vigneron <gaetan@webworkshops.fr>
 *  V 0.1.0
 *  
 *  09/10/2016 
 ***
 **/


(function () {
    'use strict';
    
    DOM.extendDOM(
        {   
            getTransform : function () {
                var node = this.toNatif();
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

            },
            inPage:function(){
                var node = this.toNatif();
                return (node === document.body) ? false : document.body.contains(node);
                
            },
            removeClass: function (n) {
                var node = this.toNatif();
                if (typeof n === "string") {
                    n = n.trim();
                    var $i, $a, $b;
                    $b = n.split(" ");
                    $a = node.className.split(" ");
                    for (var i = 0; i < $b.length; i++) {
                        var nE = $b[i];
                        $i = ($a).indexOf(nE);
                        if (($i) !== -1)
                            $a.splice($i, 1);
                    }
                    node.className = $a.join(" ");
                    return true;
                } else
                    return false;
            }
            ,
            addClass: function (n) {
                var node = this.toNatif();
                if (typeof n === "string") {
                    n = n.trim();
                    var $a, $b;
                    if (node.className) {
                        $a = node.className.split(" ");
                    } else
                        $a = [];
                    $b = n.split(" ");
                    for (var i = 0; i < $b.length; i++) {
                        var nE = $b[i];
                        if (($a).indexOf(nE) === -1) {
                            $a.push(nE);

                        }
                    }
                    node.className = $a.join(" ");
                    return true;
                } else
                    return false;

            },
            getOffset : function () {
                var node = this.toNatif();
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
        }
    );

})();



