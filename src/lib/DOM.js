var DOM;
(function() {
    'use strict';
   
             if (typeof jQuery !== 'undefined') {
                 
                jQuery.fn.extend({
                    touchevent:function(eventname,callback){
                        DOM.touchevent(eventname,this,callback);
                    },
                    move:function(){
                         
                    }
                });
            }else{
                console.log("JQUERY IS NOT LOADED BUT DOMEVENT IS READY");
            }

            HTMLElement.prototype.touchevent=function(eventname,callback){
                        DOM.touchevent(eventname,this,callback);
            };
        
    
    DOM=function(){
        
   
        
        var param={
           
            fps:30,
            timeDirection:30, //@Time to determinate where you go
            timeLongclick:600,//@Time to determinate when is a longClick
        }
        var mem={
            window:{x:window.innerWidth,y:window.innerHeight},
            mouse:{x:0,y:0}
        }
      
        
        
        var getTime= function(){
            return performance.now();
           
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
                            if(dm.dom.css){
                                 dm.dom.css({left:dm.posEnd.x});
                            }else{
                                 dm.dom.style.left= dm.posEnd.x;
                            }
                           
                        break;
                        case "y":
                            if(dm.dom.css){
                                 dm.dom.css({top:dm.posEnd.y});
                            }else{
                                 dm.dom.style.top= dm.posEnd.y;
                            }
                         
                        
                        break;
                    }
                    dm.refresh=false;
                }
            }
            var longClick=function(){
                if(dom.click&&dom.click.etat=="click"){
                    if(getTime()>dom.click.timeStart+param.timeLongclick){
                           REGISTER.startLongClick();      
                    }
                }
            }
            return {
                longClick:longClick,
                dragAndDrop:dragAndDrop,
               
            }
        }();
        
        var EVENT=function(){
            //@FRAME REFRESH 
            var refresh = function(){ 
  
                REFRESH.longClick();
                REFRESH.dragAndDrop();
            }
            
           var click = function (e){   
               
               /*  
               var mouse=document.querySelector("#mouse");
               mouse.style.top =e.clientY+"px";
               mouse.style.left =e.clientX+"px";
               */
                    dom.move="whereYouGo";
                    dom.click={
                     
                        target:e.target,
                        timeStart:getTime(),
                        mouseStart:{x:e.clientX,y:e.clientY},
                        vitesse:{x:0,y:0},
                        origin:e.target,
                        mouseEnd:{x:e.clientX,y:e.clientY},
                        etat:"click"
                    };
             
            }
            
            var resize=function(){
        
                 var w={x:window.innerWidth,y:window.innerHeight};
                //@OPTI RESIZE X
                if(w.x!=mem.window.x){
                    mem.window.x=w.x;
                    for(var i in dom.resize.x){dom.resize.x[i]();}
                }
            }
            var mousemove=function(e){  
                 mem.mouse={x:e.clientX,y:e.clientY};
                 var whereYouGo=function(e){
                    var d=dom.click;
                   
                        if(Math.abs(e.clientX-d.mouseStart.x)>4||Math.abs(e.clientY-d.mouseStart.y)>4){
                            REGISTER.stopFindYourWay(e);
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
                //e.explicitOriginalTarget
                if(dom.click){
                    if(dom.click.etat=="longclick"){
                        REGISTER.stopLongClick();
                    }
                    if(dom.click.etat=="click"){
                        REGISTER.stopClick();
                    }
                  
                };
                if(dom.FindYourWay){REGISTER.cancelFindYourWay();}
                if(dom.dragAndDrop){REGISTER.stopDragAndDrop();}
            }
            
            return{
                click:click,
                resize:resize,
                mousemove:mousemove,
                mousewheel:mousewheel,
                mouseup:mouseup,
                refresh:refresh
            }
        }();
        var REGISTER=function(){
            var stopClick=function(){
                var node=dom.click.target;
               if(node.ref && typeof node.ref.click==='function'){ node.ref.click(dom.click);}
               dom.move=false;
               dom.click=false;
            }
            var startLongClick =function(){
     
               var node=dom.click.target;
               
               dom.click.etat="longclick";
               if(node.ref && typeof node.ref.longclick==='function'){
                   node.ref.longclick(dom.click); 
                   dom.move="longclick";
               
                }
            }
            var stopLongClick =function(){
                var node=dom.click.target;
                dom.click.etat="longclickup";
                dom.move=false;
                if(node.ref && typeof node.ref.longclickup==='function'){node.ref.longclickup(dom.click); }
                dom.click=false;
            } 

        
            var stopFindYourWay=function(e){
         
              var findParent = function(n,param){
                        while(n!=null){
                            if(n.ref && typeof n.ref[param]==='function'){return n }
                            var n=n.parentNode;
                         }
                   return false;
              }
                 
               var node=dom.click.target;
               var direction=Math.abs(e.clientX-dom.click.mouseStart.x)>Math.abs(e.clientY-dom.click.mouseStart.y);
               dom.move=false;
               if(direction){
                  
                           var parent=findParent(e.target,"touchX");
                           if(parent){parent.ref.touchX();}
               }
               else{
                           var parent=findParent(e.target,"touchY");
                           if(parent){parent.ref.touchY();}
                          
                }
                dom.click=false; 
               
            }
            var cancelFindYourWay=function(){
               dom.move=false;
               dom.click=false;
            }
            var startDragAndDrop=function(domNode,way,speed,callback){
                dom.move="dragAndDrop";
                var position = TOOLS.getOffset(domNode);
                 domNode.style.transition="none";
                dom.dragAndDrop&&(stopDragAndDrop());
                dom.dragAndDrop={
                    timeStart:getTime(),
                    timeEnd:getTime()+1,
                    dom:domNode,
                    speed:speed,
                    mouse:false,
                    posEnd:{x:position.left ,y:position.top  },
                    posStart:{x:position.left ,y:position.top  },
                    way:way,
                    callback:callback,
                    refresh:false,
                };
                     
                //window.getSelection().removeAllRanges();
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
            var touchevent =function(eventname,e,callback){
                var affectEvent=function(event){
                     if( e.ref[event])throw("Event "+event+" is already defined");
                     e.ref[event]=callback;
                }
                if( typeof callback !=='function')throw("callback need to be a function");
                e=TOOLS.jQueryToNatif(e);
                if(!TOOLS.isInPage(e))throw("We can't register a event on a dom not in body");
                if(!e.ref)e.ref={};
                switch(eventname){
                    default:
                        throw(eventname + "is not a known event try touchX or touchY");
                        break;
                    case "click":
                        affectEvent("click");
                        break;
                    case "longclick":
                        affectEvent("longclick");
                        break;
                    case "longclickup":
                         affectEvent("longclickup");
                         break;  
                    case "touchX":
                        affectEvent("touchX");
                         break;
                    case "touchY":
                        affectEvent("touchY");
                        break;
                    case "doubleclick":
                        
                        break;
                }    
            }
            return{
                  touchevent:touchevent,
                  startDragAndDrop:startDragAndDrop,
                  stopDragAndDrop:stopDragAndDrop,
                  stopClick:stopClick,
                  startLongClick:startLongClick,
                  stopLongClick:stopLongClick,
                  stopFindYourWay:stopFindYourWay,
                  cancelFindYourWay:cancelFindYourWay,
                  onresize:function(space,id,callback){ if(dom.resize[space]){dom.resize[space][id]=callback;}}, 
                  onmousewheel:function(id,callback){dom.scroll[id]=callback;} ,
            } 
        }();
         var TOOLS=function(){
              var selection=function(boolean){
                       if(!boolean){
                                 var a=document.querySelector("*");
                                 a.style.MozUserSelect ="none";
                                 a.style.webkitUserSelect  ="none";
                                 a.style.oUserSelect  ="none";
                                 a.style.khtmlUserSelect  ="none";
                                 a.style.msUserSelect  ="none";
                                 a.style.userSelect  ="none";
                          
                      }else{
                                 var a=document.querySelector("*");
                                 a.style.MozUserSelect ="text";
                                 a.style.webkitUserSelect  ="text";
                                 a.style.oUserSelect  ="text";
                                 a.style.khtmlUserSelect  ="text";
                                 a.style.msUserSelect  ="text";
                                 a.style.userSelect  ="text";
                      }
             };
             
             var jQueryToNatif = function (node) {
                if(typeof jQuery !== 'undefined' && node instanceof jQuery){
                        return node[0];
                   }
                  return node;
             }

             
             var isInPage= function (node) {
                node=jQueryToNatif(node);
                if(node instanceof Node){
                   return (node === document.body) ? false : document.body.contains(node);

                }
                throw("Argument passed is not a node element");
                return false;

             }
           
            var getOffset =function (node) {
                    var e=jQueryToNatif(node);
                    e = e.getBoundingClientRect();
                    return {
                      left: e.left + window.scrollX,
                      top: e.top + window.scrollY
                    }
             }
             return{
                  getOffset:getOffset,
                  selection:selection,
                  jQueryToNatif:jQueryToNatif,
                  isInPage:isInPage,
             }
         }();   
  
        setInterval(EVENT.refresh,param.fps);
        //@DOM EVENT 
        window.addEventListener("resize",EVENT.resize);
        document.addEventListener((/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel",EVENT.mousewheel);
        document.addEventListener("mouseup",EVENT.mouseup);
        document.addEventListener("mousemove",EVENT.mousemove);
        document.addEventListener("mousedown",EVENT.click);
        document.addEventListener('mouseout', function(e) {
          if (e.toElement == null && e.relatedTarget == null) {
              EVENT.mouseup(e);
          }
        });
  
        
 
        return({
             touchevent:REGISTER.touchevent,
             move:REGISTER.startDragAndDrop, 
             onmousewheel:REGISTER.onmousewheel,
             onresize:REGISTER.onresize,
             selection:TOOLS.selection,
        });  
    }();
    
      
  
    
})();                
