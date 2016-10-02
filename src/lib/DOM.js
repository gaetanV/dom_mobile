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
        var movestate=[false,];
        ///////////
        //@DOM KERNEL
        ///////////
        var dom={
            move:false, 
            /* 
                @mousemove :  switch move [dragAndDrop,direction]
            */
            click:false,
            /* 
                @EVENT     : REGISTER.onlongclick
                @refresh   : Defined if move is longclick
            */
            direction:false,
            /*
                @EVENT     : REGISTER.direction
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
                          
                           dom.click.etat="longclick";
                           dom.click.callback(dom.click);
                           
                    }
                }
            }
            return {
                longClick:longClick,
                dragAndDrop:dragAndDrop
            }
        }();
        var EVENT=function(){
            //@FRAME REFRESH 
            var refresh = function(){ 
                mem.time+=param.fps;
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
                //@Determinate where you go , nothing append
                var whereYouGo=function(e){
                    var d=dom.direction;
                    if(getTime()>d.timeStart+param.timeDirection){
                        var distance=Math.abs(e.clientX-d.mouseStart.x)+Math.abs(e.clientY-d.mouseStart.y);
                        if(distance>4){
                            d.callback({x:e.clientX-d.mouseStart.x,y:e.clientY-d.mouseStart.y});
                            dom.direction=false; 
                        }
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
               switch(dom.move){
                   case "whereYouGo":
                       whereYouGo(e);
                       break;
                   case "dragAndDrop":
                       dragAndDrop(e);
                       break;
               }
               //dom.direction?whereYouGo(e):dragAndDrop(e);  
            }
            var mousewheel=function(e){
               
                for(var i in dom.scroll){dom.scroll[i](e.detail>0);};
            }
            var mouseup=function(e){
               
                dom.move=false;
                if(dom.click){
            
                      if(dom.click.etat=="longclick"){dom.click.etat="longclickend"};
                      dom.click.callback(dom.click)
               
                };
                dom.click=false;
                 
                if(dom.direction){dom.direction.error();dom.direction=false;}
                
                
                var domObj=dom.dragAndDrop;
                if(domObj){
                    domObj.timeEnd=getTime(); 
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
                refresh:refresh
            }
        }();
        var REGISTER=function(){
            var stopDragAndDrop =function(){ var domObj=dom.dragAndDrop; dom.dragAndDrop=false;}
           var startFindYourWay=function(e,callback,error){
                dom.move="whereYouGo";
                dom.direction={
                    callback:callback,
                    error:error,
                    mouseStart:{x:e.clientX,y:e.clientY},
                    timeStart:getTime()
                }
            }
            var move=function(domNode,way,speed,callback){
           
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
                dom.click=false;
                window.getSelection().removeAllRanges();
                //selection(false);
               }
               function onlongclick(e,callback)
               {   
                    if(!dom.click){
                         dom.click={
                            start:getTime(),
                            callback:callback,
                            target:e.target,
                            etat:"click"
                         };
                    }
                   
                   /* 
                   if(dom.click)return false;
                   return dom.click;
                   window.getSelection().removeAllRanges();
                   console.log(window.getSelection().toString());
                   */
              }

              return{
                  move:move,
                  onresize:function(space,id,callback){ if(dom.resize[space]){dom.resize[space][id]=callback;}},
                  onmousewheel:function(id,callback){dom.scroll[id]=callback;} ,
                  onlongclick:onlongclick,
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
             move:REGISTER.move, 
             direction:REGISTER.startFindYourWay,
             onlongclick:REGISTER.onlongclick,
             onresize:REGISTER.onresize,
             onmousewheel:REGISTER.onmousewheel,
             selection:TOOLS.selection,
        });  
    }();
    
      
  
    
})();                
