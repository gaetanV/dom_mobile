"use strict";var DOM=function(){var e={selection:function(e){DOM.selection(this,e)}},t={mouseup:[],click:[],mousemove:[],mousewheel:[],refresh:[],resize:[]},n=function(e){if(e.touches){var t=e.touches[0];if(e.touch={x:t.pageX,y:t.pageY},e.touches.length>1){t=e.touches[1];e.touch2={x:t.pageX,y:t.pageY}}}else e.touch={x:e.clientX,y:e.clientY}},o=function(e){for(var o in n(e),t.click)t.click[o](e);return!1},r=function(e){for(var o in n(e),t.resize)t.resize[o](e);return!1},s=function(e){for(var o in n(e),t.mousemove)t.mousemove[o](e)},i=function(e){for(var o in n(e),t.mousewheel)t.mousewheel[o](e)},a=function(e){for(var n in t.mouseup)t.mouseup[n](e)};setInterval((function(){for(var e in t.refresh)t.refresh[e]()}),24),window.addEventListener("resize",r),document.addEventListener(/Firefox/i.test(navigator.userAgent)?"DOMMouseScroll":"mousewheel",i),("ontouchstart"in window||navigator.maxTouchPoints)&&(document.addEventListener("touchstart",o),document.addEventListener("touchmove",s),document.addEventListener("touchend",a),document.addEventListener("touchleave",a)),document.addEventListener("mousedown",o),document.addEventListener("mousemove",s),document.addEventListener("mouseup",a),document.addEventListener("mouseout",(function(e){null===e.toElement&&null===e.relatedTarget&&a(e)}));var c=function(t){for(var n in e)t[n]=e[n];return t};return c.extendDOM=function(t){for(var n in t)e[n]=t[n]},c.extendEVENT=function(e){for(var n in e)switch(n){default:throw n+" is not a known extendEVENT";case"click":t.click.push(e[n]);break;case"mouseup":t.mouseup.push(e[n]);break;case"mousemove":t.mousemove.push(e[n]);break;case"mousewheel":t.mousewheel.push(e[n]);break;case"refresh":t.refresh.push(e[n]);break;case"resize":t.resize.push(e[n])}},c.selection=function(e,t){e=e[0]?e[0]:e,t?(e.style.MozUserSelect="text",e.style.webkitUserSelect="text",e.style.oUserSelect="text",e.style.khtmlUserSelect="text",e.style.msUserSelect="text",e.style.userSelect="text"):(e.style.MozUserSelect="none",e.style.webkitUserSelect="none",e.style.oUserSelect="none",e.style.khtmlUserSelect="none",e.style.msUserSelect="none",e.style.userSelect="none")},c.extend=function(t){if(t===HTMLElement)for(var n in e)t.prototype[n]=e[n];else t.fn&&t.fn.extend&&t.fn.extend(e)},c}();DOM.register=function(){var e="data-touchevent",t=function(t,n){if(t instanceof HTMLElement==!1)throw"emitEvent need a dom element";for(var o=t;null!==o||o;){if(o[e]&&"function"==typeof o[e][n])return o;o=o.parentNode}return!1};return{findEvent:function(e,n){return t(e,n)},emitEvent:function(n,o,r){!r&&(r=n);var s=t(n,o);return!!s&&(r.target=s,r.etat=o,s[e][o](r),!0)},setReference:function(t,n,o){if("function"!=typeof o)throw"callback need to be a function";if(t===document.body||!document.body.contains(t))throw"We can't register a event on a dom not in body";if(!t[e]&&(t[e]={}),t[e][n])throw"Event "+n+" is already defined";t[e][n]=o}}}(),function(){var e=function(e,n,o,r){var s=[1,0,0,1,0,0],i=performance.now(),a=window.getComputedStyle(e),c=a.transform;"none"!==c&&(s=/\((.*)\)/.exec(c)[1].split(","));this.matrix=s,this.timeStart=i,this.timeEnd=i,this.speed=o,this.dom=e,this.css={transitionDuration:a.transitionDuration,transitionProperty:a.transitionProperty,transitionDelay:a.transitionDelay},e.style.transition="none";var u=t(e),l=parseInt(e.style.left),m=parseInt(e.style.top);0===u.y&&0===u.x||(e.offsetHeight,0!==u.y&&(e.style.top=m+u.y+"px"),0!==u.x&&(e.style.left=l+u.x+"px")),this.css.left=a.left,this.css.top=a.top,this.transform={start:{x:0,y:0},end:{x:0,y:0}},this.pos={start:{x:l,y:m},end:{x:l,y:m}},this.way=n,this.callback=r,this.refresh=!1},t=function(e){var t=0,n=0,o=window.getComputedStyle(e).transform;if("none"!==o){var r=/\((.*)\)/.exec(o)[1].split(",");t=parseInt(r[4]),n=parseInt(r[5])}return{x:t,y:n}},n=function(e){var t=e.getBoundingClientRect(),n=window.getComputedStyle(e),o=parseInt(n.paddingTop,10),r=parseInt(n.paddingBottom,10),s=parseInt(n.paddingLeft,10),i=parseInt(n.paddingRight,10),a=e.clientHeight,c=parseInt(n.marginTop,10);a+=c+parseInt(n.borderTopWidth,10),a+=parseInt(n.borderBottomWidth,10),a+=parseInt(n.marginBottom,10);var u=e.clientWidth;u+=parseInt(n.marginRight,10),u+=parseInt(n.borderRightWidth,10);var l=parseInt(n.marginLeft,10);return u+=parseInt(n.borderLeftWidth,10)+l,{left:t.left+window.scrollX-l,top:t.top+window.scrollY-c,outer:{height:a,width:u},inner:{height:e.clientHeight-(o+r),width:e.clientWidth-(i+s)}}},o=!1;DOM.extendDOM({move:function(t,n,r){var s=this[0]?this[0]:this;o=new e(s,t,n,r)}}),DOM.extendEVENT({refresh:function(){if(o){var e=o;if(e.refresh){var t=e.refresh.touch,n=0,r=0;switch(e.way){case"-x":n+=(e.mouse.x-t.x)*e.speed;break;case"x":n-=(e.mouse.x-t.x)*e.speed;break;case"-y":r+=(e.mouse.y-t.y)*e.speed;break;case"y":r-=(e.mouse.y-t.y)*e.speed;break;case"xy":n-=(e.mouse.x-t.x)*e.speed,r-=(e.mouse.y-t.y)*e.speed}e.transform.end={y:r,x:n},e.dom.style.transform="matrix("+e.matrix[0]+","+e.matrix[1]+","+e.matrix[2]+","+e.matrix[3]+", "+n+", "+r+")",e.refresh=!1}}},mousemove:function(e){o&&(o.mouse||(o.mouse=e.touch),o.refresh=e)},mouseup:function(e){o&&r.stopDragAndDrop()}});var r={stopDragAndDrop:function(){o.pos.end={x:parseInt(o.css.left)+o.transform.end.x,y:parseInt(o.css.top)+o.transform.end.y},o.timeEnd=performance.now();var e=window.getComputedStyle(o.dom);o.dom.style.transform="matrix("+o.matrix[0]+","+o.matrix[1]+","+o.matrix[2]+","+o.matrix[3]+",0,0)","absolute"!==e.position&&"fixed"!==e.position&&"relative"!==e.position||("auto"===o.css.top&&(o.css.top=n(o.dom).top),"auto"===o.css.left&&(o.css.left=n(o.dom).left),o.dom.style.top=parseInt(o.css.top)+o.transform.end.y+"px",o.dom.style.left=parseInt(o.css.left)+o.transform.end.x+"px");var t=o.timeEnd-o.timeStart,r=Math.abs(o.transform.end.x),s=Math.abs(o.transform.end.y);o.vitesse={x:1/(1*t/r),y:1/(1*t/s)},o.dom.offsetHeight,o.dom.style.transitionDuration=o.css.transitionDuration,o.dom.style.transitionProperty=o.css.transitionProperty,o.dom.style.transitionDelay=o.css.transitionDelay,o.callback(o),o=!1}}}(),function(){var e="_rX",t="_rY",n={x:window.innerWidth,y:window.innerHeight};DOM.extendDOM({resizeEvent:function(n,o){var r=this[0]?this[0]:this;switch(n){case"x":DOM.register.setReference(r,"resizeX",o),r.setAttribute(e,!0);break;case"y":DOM.register.setReference(r,"resizeY",o),r.setAttribute(t,!0);break;case"xy":DOM.register.setReference(r,"resizeX",o),r.setAttribute(e,!0),DOM.register.setReference("resizeY",o),r.setAttribute(t,!0)}}}),DOM.extendEVENT({resize:function(e){var t={x:window.innerWidth,y:window.innerHeight};if(t.x!==n.x){n.x=t.x;for(var o=document.querySelectorAll("[_rX]"),r=0;r<o.length;r++)DOM.register.emitEvent(o[r],"resizeX")}if(t.y!==n.y){n.y=t.y;for(o=document.querySelectorAll("[_rY]"),r=0;r<o.length;r++)DOM.register.emitEvent(o[r],"resizeY")}}})}(),DOM.extendDOM({scrollEvent:function(e,t){var n=this[0]?this[0]:this;switch(e){case"up":DOM.register.setReference(n,"scrollUp",t);break;case"down":DOM.register.setReference(n,"scrollDown",t)}}}),DOM.extendEVENT({mousewheel:function(e){e.detail<0?DOM.register.emitEvent(e.target,"scrollUp"):DOM.register.emitEvent(e.target,"scrollDown")}}),function(){var e=!1,t=400,n=200,o=!1,r=!1,s=function(t){this.etat="init",this.target=t.target,this.timeStart=performance.now(),this.mouseStart=t.touch,this.mouseEnd=t.touch,this.mouseStart2=!1,this.mouseEnd2=!1,this.vitesse={x:0,y:0},this.origin=t.target,r&&t.touch2&&(r.etat="multitouch"),e&&clearTimeout(e)},i=function(e){o&&console.log(e)};DOM.extendDOM({touchevent:function(e,t){var n=this[0]?this[0]:this;switch(e){default:throw e+"is not a known event try touchX or touchY";case"click":DOM.register.setReference(n,"click",t);break;case"longclick":DOM.register.setReference(n,"longclick",t);break;case"longclickup":DOM.register.setReference(n,"longclickup",t);break;case"touchX":DOM.register.setReference(n,"touchX",t);break;case"touchY":DOM.register.setReference(n,"touchY",t);break;case"dbclick":DOM.register.setReference(n,"dbclick",t);break;case"zoom":DOM.register.setReference(n,"zoom",t);break;case"DEBUG":t}}}),DOM.extendEVENT({click:function(n){if(r)switch(r.etat){case"waitclick":a.stopDbClick();break;case"init":n.touch&&(r.etat="multitouch")}else i("init"),(r=new s(n)).timeout&&clearTimeout(r.timeout),e=setTimeout((function(){a.startLongClick()}),t)},mousemove:function(e){if(r)switch(r.etat){case"init":(Math.abs(e.touch.x-r.mouseStart.x)>4||Math.abs(e.clientY-r.mouseStart.y)>4)&&a.stopFindYourWay(e);break;case"multitouch":r.mouseEnd=e.touch,r.mouseEnd2=e.touch2,r.mouseStart2||(r.mouseStart=e.touch,r.mouseStart2=e.touch2,r.d1=Math.sqrt(Math.pow(r.mouseStart.x-r.mouseStart2.x,2)+Math.pow(r.mouseStart.x-r.mouseStart2.x,2))),e.touch&&e.touch2&&a.startZoom();case"zoom":r.mouseEnd=e.touch,r.mouseEnd2=e.touch2,r.mouseStart2||(r.mouseStart=e.touch,r.mouseStart2=e.touch2,r.d1=Math.sqrt(Math.pow(r.mouseStart.x-r.mouseStart2.x,2)+Math.pow(r.mouseStart.x-r.mouseStart2.x,2))),a.sendZoom()}},mouseup:function(t){if(r)switch(r.etat){default:i("event end by mouseup"),r=!1;break;case"multitouch":r=!1;break;case"waitlongclick":a.stopLongClick();break;case"init":var o=DOM.register.findEvent(r.target,"dbclick");o?(i("waitclick"),r.etat="waitclick",r.traget=o,e&&clearTimeout(e),e=setTimeout((function(){"waitclick"===r.etat&&a.stopClick()}),n)):a.stopClick()}}});var a={startZoom:function(){r&&"multitouch"===r.etat&&DOM.register.emitEvent(r.target,"zoom",r)},sendZoom:function(){r&&"zoom"===r.etat&&(r.d2=Math.sqrt(Math.pow(r.mouseEnd.x-r.mouseEnd2.x,2)+Math.pow(r.mouseEnd.x-r.mouseEnd2.x,2)),DOM.register.emitEvent(r.target,"zoom",r))},startLongClick:function(){if(r&&"init"===r.etat){var e=DOM.register.findEvent(r.target,"longclick",r);e&&(DOM.register.emitEvent(r.target,"longclick",r),r.target=e,i("waitlongclick"),r.etat="waitlongclick")}},stopLongClick:function(){if(!r)throw"stopLongClick is call without event";r.etat="longclick",i("longclick"),DOM.register.emitEvent(r.target,"longclickup",r),r=!1},stopClick:function(){r&&("init"!==r.etat&&"waitclick"!==r.etat||(r.etat="click",i("click"),DOM.register.emitEvent(r.target,"click",r)),r=!1)},stopDbClick:function(){r&&"waitclick"===r.etat&&(r.etat="dbclick",i("dbclick"),DOM.register.emitEvent(r.target,"dbclick",r),r=!1)},stopFindYourWay:function(e){r&&"init"===r.etat&&(Math.abs(e.touch.x-r.mouseStart.x)>Math.abs(e.touch.y-r.mouseStart.y)?(r.etat="moveX",i("moveX"),DOM.register.emitEvent(r.target,"touchX",r)):(r.etat="moveY",i("moveY"),DOM.register.emitEvent(r.target,"touchY",r)),r=!1)}}}();export default DOM;