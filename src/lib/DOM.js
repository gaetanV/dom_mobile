var DOM;
(function() {
    'use strict';
    

    DOM=function(){
        var param={
            fps:30,
            timeDirection:30, //@Time to determinate where you go
            timeLongclick:600,//@Time to determinate when is a longClick
        }
        var mem={
            window:{x:$( window ).width(),y:$( window ).height()},
            time:0//performance.now()
        }
        var getTime= function(){
            return +mem.time;
        };
        var dom={
            move:false, 
            /* 
                @mousemove :  switch move [dragAndDrop,FindYourWay,longclick]
            */
            click:false,
            /* 
                @EVENT     : REGISTER.onlongclick
                @refresh   : Defined if move is longclick
            */
            FindYourWay:false,
            /*
                @EVENT     : REGISTER.FindYourWay
                @mousemove : defined position
            */
            dragAndDrop:false, 
            /*
                @EVENT     : REGISTER.dragAndDrop
                @mousemove : defined position
                @refresh:  : refresh css
            */
            resize:{x:[],y:[],xy:[]},
            scroll:[],
        }

        var REFRESH=function(){
            var time=function(){
                  mem.time+=param.fps;
            }
            var  dragAndDrop=function(){
                var dm=dom.dragAndDrop;
                if(dm.refresh){
                    switch(dm.way){ 
                        case "x":
                            dm.dom.css({left: dm.posEnd.x});
                        break;
                        case "y":
                            dm.dom.css({top: dm.posEnd.y});
                        break;
                    }
                    dm.refresh=false;
                }
            }
            var longClick=function(){
                if(dom.click&&dom.click.etat=="click"){
                    if(getTime()>dom.click.start+param.timeLongclick){
                           REGISTER.startLongClick();      
                    }
                }
            }
            return {
                longClick:longClick,
                dragAndDrop:dragAndDrop,
                time:time
            }
        }();
        
        var EVENT=function(){
            //@FRAME REFRESH 
            var refresh = function(){ 
                REFRESH.time();
                REFRESH.longClick();
                REFRESH.dragAndDrop();
            }
            var resize=function(){
                 var w={x:$(window).width(),y:$(window).height()};
                //@OPTI RESIZE X
                if(w.x!=mem.window.x){
                    mem.window.x=w.x;
                    for(var i in dom.resize.x){dom.resize.x[i]();}
                }
            }
            var mousemove=function(e){  
                 var whereYouGo=function(e){
                    var d=dom.FindYourWay;
                    if(getTime()>d.timeStart+param.timeDirection){
                        var distance=Math.abs(e.clientX-d.mouseStart.x)+Math.abs(e.clientY-d.mouseStart.y);
                        if(distance>4){
                            if(dom.click){
                                dom.click.cancel(dom.click);
                                dom.click=false;
                            }
                            REGISTER.stopFindYourWay(e);
                        }
                    }
                }
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
               switch(dom.move){
                   case "whereYouGo":
                       whereYouGo(e);
                       break;
                   case "dragAndDrop":
                       dragAndDrop(e);
                       break;
                   case "longclick": 
                       break;
               }
            }
            var mousewheel=function(e){
                for(var i in dom.scroll){dom.scroll[i](e.detail>0);};
            }
            var mouseup=function(e){
                if(dom.click){
                    if(dom.click.etat=="longclick"){
                        REGISTER.stopLongClick();
                    }else{
                        REGISTER.stopClick();
                    }
                };
                if(dom.FindYourWay){REGISTER.cancelFindYourWay();}
                if(dom.dragAndDrop){REGISTER.stopDragAndDrop();}
            }
            
            return{
                resize:resize,
                mousemove:mousemove,
                mousewheel:mousewheel,
                mouseup:mouseup,
                refresh:refresh
            }
        }();
        var REGISTER=function(){

            var startClick = function (e,callback,cancel){   
                dom.click={
                    start:getTime(),
                    callback:callback,
                    cancel:cancel,
                    target:e.target,
                    etat:"click"
                };
            }
            var stopClick=function(){
               dom.move=false;
               dom.click.callback(dom.click)
               dom.click=false;
            }
            var startLongClick =function(){
               dom.move="longclick";
               dom.click.etat="longclick";
               dom.click.callback(dom.click);
            }
            var stopLongClick =function(){
               dom.move=false;
               dom.click.etat="longclickend";
               dom.click.callback(dom.click);
               dom.click=false;
            } 

            var startFindYourWay=function(e,callback,cancel){
                dom.move="whereYouGo";
                dom.FindYourWay={
                    callback:callback,
                    cancel:cancel,
                    mouseStart:{x:e.clientX,y:e.clientY},
                    timeStart:getTime()
                }
            }
            var stopFindYourWay=function(e){
               dom.move=false;
               dom.FindYourWay.callback({x:e.clientX-dom.FindYourWay.mouseStart.x,y:e.clientY-dom.FindYourWay.mouseStart.y});
               dom.FindYourWay=false; 
            }
            var cancelFindYourWay=function(){
               dom.move=false;
               dom.FindYourWay.cancel();
               dom.FindYourWay=false;
            }
            var startDragAndDrop=function(domNode,way,speed,callback){
                dom.move="dragAndDrop";
                var position = domNode.position();
                dom.dragAndDrop&&(stopDragAndDrop());
                dom.dragAndDrop={
                    timeStart:getTime(),
                    timeEnd:getTime()+1,
                    dom:$(domNode),
                    speed:speed,
                    mouse:false,
                    posEnd:{x:position.left ,y:position.top  },
                    posStart:{x:position.left ,y:position.top  },
                    way:way,
                    callback:callback,
                    refresh:false,
                };
                window.getSelection().removeAllRanges();
                //selection(false);
            }
            
            var stopDragAndDrop =function(){ 
                dom.move=false;
                var domObj=dom.dragAndDrop;
                domObj.timeEnd=getTime(); 
                var time=domObj.timeEnd-domObj.timeStart;
                var x= Math.abs(domObj.posStart.x-domObj.posEnd.x);
                var y= Math.abs(domObj.posStart.y-domObj.posEnd.y);
                domObj.vitesse={x:1/(time*1/x),y:1/(time*1/y)}; 
                domObj.callback(domObj);
                dom.dragAndDrop=false;
            }
            return{
                  startDragAndDrop:startDragAndDrop,
                  stopDragAndDrop:stopDragAndDrop,
                  startClick:startClick,
                  stopClick:stopClick,
                  startLongClick:startLongClick,
                  stopLongClick:stopLongClick,
                  startFindYourWay:startFindYourWay,
                  stopFindYourWay:stopFindYourWay,
                  cancelFindYourWay:cancelFindYourWay,
                  onresize:function(space,id,callback){ if(dom.resize[space]){dom.resize[space][id]=callback;}}, 
                  onmousewheel:function(id,callback){dom.scroll[id]=callback;} ,
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
                  selection:selection,

             }
         }();   
  
        setInterval(EVENT.refresh,param.fps);
        //@DOM EVENT 

        
        $(window).resize(EVENT.resize);
        $(document).mousemove(EVENT.mousemove);
        document.addEventListener((/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel",EVENT.mousewheel);
        $(document).mouseup(EVENT.mouseup);
        $(document).bind('mouseleave.dragged', EVENT.mouseup);
       
        return({
             move:REGISTER.startDragAndDrop, 
             findYourWay:REGISTER.startFindYourWay,
             onlongclick:REGISTER.startClick,
             onmousewheel:REGISTER.onmousewheel,
             selection:TOOLS.selection,
        });  
    }();
    
      
  
    
})();                
