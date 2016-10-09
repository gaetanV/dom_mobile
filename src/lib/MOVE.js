(function () {
    'use strict';
    var PATH = function (dom,way,speed,callback) {
        var computedStyle = window.getComputedStyle(dom);
             console.log(computedStyle.transitionProperty);
           console.log(computedStyle.transitionDuration);
           
              console.log(computedStyle.transitionDelay);
        var matrix = [1, 0, 0, 1, 0, 0];
        var t = computedStyle.transform;
        if (t != "none") {
            var re = /\((.*)\)/
            var pos = re.exec(computedStyle.transform);
            matrix = pos[1].split(",");
        }
        this.timeStart = DOM.getTime();
        this.timeEnd = DOM.getTime();
        this.speed = speed;
        this.matrix=matrix;
        this.dom=dom;
        this.css = {
            transform: computedStyle.transform,
            top: computedStyle.top,
            left: computedStyle.left,
        }
   
       // var offset = TOOLS.getOffset(domNode);
       // this.posEnd = {x: offset.left, y: offset.top};
        //var transform = DOM.TOOLS.getTransform(dom);
        
        this.transform={
            start:{x: 0, y: 0},
            end:{x: 0, y:0},    
        }
        this.pos={
            start:{x: 0, y: 0},
            end:{x: 0, y:0}, 
        }
        this.way=way  ; 
        this.callback=callback;
        this.refresh=false ;  
        /* TO DO WITH CLASS SLOW */
        this.dom.style.transition="none";
        /* TO DO IF TRANSFORM X & Y START */
        
    }
    var MOVE = function () {
        var event = false;
        var param = {
             
             
        }
        DOM.extendDOM(
                {
                    move: function ( way, speed, callback) {
                        var e = DOM.TOOLS.jQueryToNatif(this);
                        event = new PATH(e,way,speed,callback);
                    }
                }
        );
        DOM.extendEVENT({
            refresh:function(){
                  if(event){
                    var d = event;
                    if (d.refresh) {
                        var pos = DOM.TOOLS.touchPos(d.refresh);
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
                        d.dom.style.transform = "matrix(" + d.matrix[0] + "," + d.matrix[1] + "," + d.matrix[2] + "," + d.matrix[3] + ", " +x+ ", " + y + ")";
                        d.refresh = false;
                    }
                }
            },
            mousemove: function (e) {
                if(event){
                   if (!event.mouse) {
                       event.mouse = DOM.TOOLS.touchPos(e);
                   }
                   event.refresh = e;
                }
           
                
            },
            mouseup: function (e) {
                if(event){
                    EVENTMOVE.stopDragAndDrop();
                }
                
            }

        });

        var EVENTMOVE = {
            stopDragAndDrop : function () {
                event.pos.end = {x: parseInt(event.css.left) + event.transform.end.x, y: parseInt(event.css.top) + event.transform.end.y};  
                event.timeEnd = DOM.getTime();
                var computedStyle = window.getComputedStyle(event.dom);
                if (computedStyle.position == "absolute" || computedStyle.position == "fixed" || computedStyle.position == "relative") {

                    event.dom.style.top = parseInt(event.css.top) + event.transform.end.y + "px";
                    event.dom.style.left = parseInt(event.css.left) + event.transform.end.x + "px";

                }
               
              
                var d = event;
                d.dom.style.transform = "matrix(" + d.matrix[0] + "," + d.matrix[1] + "," + d.matrix[2] + "," + d.matrix[3] + ",0,0)";
             
                var time = event.timeEnd - event.timeStart;
                var x = Math.abs(event.transform.end.x);
                var y = Math.abs(event.transform.end.y);
                event.vitesse = {x: 1 / (time * 1 / x), y: 1 / (time * 1 / y)};
               
    
                event.callback(event);
                event=false;
                
           
            }
        };
    }();

})();

       