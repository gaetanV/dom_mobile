var DOM;
(function() {
    'use strict';
    DOM=function(){
        var param={
            fps:30,
            timeDirection:50, //@Time to determinate where you go
        }
        var mem={
            window:{x:$( window ).width(),y:$( window ).height()},
        }
        ///////////
        //@DOM KERNEL
        ///////////
        var dom={
            direction:false,
            dragAndDrop:false,
            resize:{x:[],y:[],xy:[]},
            scroll:[],
        }

        var REFRESH=function(){
            var  dragAndDrop=function(){
                var domObject=dom.dragAndDrop;
                if(domObject.refresh){
                    switch(domObject.way){ 
                        case "x":
                            domObject.dom.css({left: domObject.posEnd.x});
                        break;
                        case "y":
                            domObject.dom.css({top: domObject.posEnd.y});
                        break;
                    }
                    domObject.refresh=false;
                }
            }
            return {
                dragAndDrop:dragAndDrop
            }
        }();
        var EVENT=function(){
            var resize=function(){
                 var w={x:$(window).width(),y:$(window).height()};
                //@OPTI RESIZE X
                if(w.x!=mem.window.x){
                    mem.window.x=w.x;
                    for(var i in dom.resize.x){dom.resize.x[i]();}
                }
            }
            var mousemove=function(e){ 
                //@Determinate where you go , nothing append
                var whereYouGo=function(e){
                    var d=dom.direction;
                    if(performance.now()>d.timeStart+param.timeDirection){
                        d.callback({x:e.clientX-d.mouseStart.x,y:e.clientY-d.mouseStart.y});
                        dom.direction=false;
                    }
                }
                //@On move
                var dragAndDrop=function(e){
                    var domObject=dom.dragAndDrop;
                    if(!domObject.mouse){domObject.mouse={x:e.clientX,y:e.clientY}}
                    switch(domObject.way){  
                        case "x":
                            var x=domObject.posStart.x+domObject.mouse.x-e.clientX;  
                            domObject.refresh=true;
                            domObject.posEnd={x:x,y:domObject.posStart.y}
                            break;
                        case "y":
                            var y=domObject.posStart.y+(domObject.mouse.y-e.clientY)*domObject.speed;  
                            domObject.refresh=true;
                            domObject.posEnd={y:y,x:domObject.posStart.x}
                            break;
                    }   
               }
               dom.direction?whereYouGo(e):dragAndDrop(e);  
            }
            var mousewheel=function(e){
               
                for(var i in dom.scroll){dom.scroll[i](e.detail>0);};
            }
            var mouseup=function(e){
                if(dom.direction){dom.direction.error();dom.direction=false;}
                var domObj=dom.dragAndDrop;
                if(domObj){
                    domObj.timeEnd=performance.now(); 
                    var time=domObj.timeEnd-domObj.timeStart;
                    var x= Math.abs(domObj.posStart.x-domObj.posEnd.x);
                    var y= Math.abs(domObj.posStart.y-domObj.posEnd.y);
                    domObj.vitesse={x:1/(time*1/x),y:1/(time*1/y)}; 
                    domObj.callback(domObj);
                    REGISTER.stopDragAndDrop();
                    //selection(true);
                }

            }
            return{
                resize:resize,
                mousemove:mousemove,
                mousewheel:mousewheel,
                mouseup:mouseup,
            }
        }();
        var REGISTER=function(){
            var stopDragAndDrop =function(){ var domObj=dom.dragAndDrop; dom.dragAndDrop=false;}
           var startFindYourWay=function(e,callback,error){
                dom.direction={
                    callback:callback,
                    error:error,
                    mouseStart:{x:e.clientX,y:e.clientY},
                    timeStart:performance.now()
                }
            }
            var move=function(domNode,way,speed,callback){
                var position = domNode.position();
                dom.dragAndDrop&&(stopDragAndDrop());
                dom.dragAndDrop={
                    timeStart:performance.now(),
                    timeEnd:performance.now()+1,
                    dom:$(domNode),
                    speed:speed,
                    mouse:false,
                    posEnd:{x:position.left ,y:position.top  },
                    posStart:{x:position.left ,y:position.top  },
                    way:way,
                    callback:callback,
                    refresh:false,
                };
                //domNode.css({'position':"fixed",});
                //selection(false);
               }
              return{
                  move:move,
                  onresize:function(space,id,callback){ if(dom.resize[space]){dom.resize[space][id]=callback;}},
                  onmousewheel:function(id,callback){dom.scroll[id]=callback;} ,
                  startFindYourWay:startFindYourWay,
                  stopDragAndDrop:stopDragAndDrop
              }
        }();
         var TOOLS=function(){
              var selection=function(boolean){
                       if(!boolean){
                         $("body").find('*').css({
                            '-moz-user-select':'-moz-none',
                            '-moz-user-select':'none',
                            '-o-user-select':'none',
                            '-khtml-user-select':'none', 
                            '-webkit-user-select':'none',
                            '-ms-user-select':'none',
                            'user-select':'none'
                          });
                      }else{
                           $("body").find('*').css({
                            '-moz-user-select':'text',
                            '-moz-user-select':'text',
                            '-o-user-select':'text',
                            '-khtml-user-select':'text',
                            '-webkit-user-select':'text',
                            '-ms-user-select':'text',
                            'user-select':'text'
                          });
                      }
             };

             return{
                  selection:selection
             }
         }();   

         //@FRAME REFRESH 
        var refresh = function(){ 
            REFRESH.dragAndDrop();
        }
        setInterval(refresh,param.fps);
        //@DOM EVENT 
        $(window).resize(EVENT.resize);
        $(document).mousemove(EVENT.mousemove);
        document.addEventListener((/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel",EVENT.mousewheel);
        $(document).mouseup(EVENT.mouseup);
        $(document).bind('mouseleave.dragged', EVENT.mouseup);
        return({
             move:REGISTER.move, 
             direction:REGISTER.startFindYourWay,
             onresize:REGISTER.onresize,
             onmousewheel:REGISTER.onmousewheel,
             selection:TOOLS.selection,
        });  
    }();
})();                
