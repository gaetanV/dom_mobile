var DOM;
(function() {
    'use strict';
   
             if (typeof jQuery !== 'undefined') {
                 
                jQuery.fn.extend({
                    touchevent:function(eventname,callback){
                        DOM.touchevent(eventname,this,callback);
                    },
                    move:function(direction,speed,callback){
                           DOM.move(this,direction,speed,callback);
                    }
                });
            }else{
                console.log("JQUERY IS NOT LOADED BUT DOMEVENT IS READY");
            }

            HTMLElement.prototype.touchevent=function(eventname,callback){
                        DOM.touchevent(eventname,this,callback);
            };
            HTMLElement.prototype.move=function(direction,speed,callback){
                        DOM.move(this,direction,speed,callback);
            };
    
    DOM=function(){
        
   
        
        var param={
           
            fps:60,
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
                @EVENT     : TOUCHEVENT.onlongclick
                @refresh   : Defined if move is longclick
            */
            dragAndDrop:false, 
            scroll:false,
            /*
                @EVENT     : TOUCHEVENT.dragAndDrop
                @mousemove : defined position
                @refresh:  : refresh css
            */
            resize:{x:[],y:[],xy:[]},
        }


      
        var TOUCHEVENT=function(){
            
            var newevent =function(e,name){
                return {
                    target:e.target,
                    timeStart:getTime(),
                    mouseStart:{x:e.clientX,y:e.clientY},
                    vitesse:{x:0,y:0},
                    origin:e.target,
                    mouseEnd:{x:e.clientX,y:e.clientY},
                    etat:name
                };
            };
            var domEvents={
                   refresh:function(){
                       if(dom.click&&dom.click.etat=="click"){
                           if(getTime()>dom.click.timeStart+param.timeLongclick){
                                  TOUCHEVENT.startLongClick();         
                           }
                       }
                   },
                   click : function (e){   
                           dom.move="whereYouGo";
                           dom.click=newevent(e,"click");

                   },
                   mousemove:function(e){
                         var d=dom.click;
                        if(Math.abs(e.clientX-d.mouseStart.x)>4||Math.abs(e.clientY-d.mouseStart.y)>4){
                            TOUCHEVENT.stopFindYourWay(e);
                         }
                   },
                   mouseup:function(e){      
                        if(dom.click.etat=="longclick"){
                                TOUCHEVENT.stopLongClick();
                        }
                        if(dom.click.etat=="click"){
                              TOUCHEVENT.stopClick();
                              TOUCHEVENT.cancelFindYourWay();
                        }
                       dom.click=false;
                  },
                  mousewheel:function(e){
                       dom.scroll=newevent(e,"scroll");
                       e.detail>0?TOUCHEVENT.stopScrollDown(): TOUCHEVENT.stopScrollUp();
                       if(dom.scroll.etat=="freeze"){
                           e.preventDefault();
                       }
                       dom.scroll=false;
                  }
            }
            var stopScrollUp=function(){
                  var parent=TOOLS.findParent(dom.scroll.target,"scrollUp");
                  if(parent){dom.scroll.target=parent;dom.scroll.etat="scrollUp";parent.ref.scrollUp(dom.scroll);dom.scroll.etat="freeze";}  
            };
             var stopScrollDown=function(){
                 var parent=TOOLS.findParent(dom.scroll.target,"scrollDown");
                 if(parent){dom.scroll.target=parent;dom.scroll.etat="scrollDown";parent.ref.scrollDown(dom.scroll);dom.scroll.etat="freeze";}
       
             }
            
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
                   dom.move="longclick";
                   node.ref.longclick(dom.click); 
                   
               
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
               var direction=Math.abs(e.clientX-dom.click.mouseStart.x)>Math.abs(e.clientY-dom.click.mouseStart.y);
               dom.move=false;
               if(direction){
                  
                           var parent=TOOLS.findParent(e.target,"touchX");
                           if(parent){parent.ref.touchX();}
               }
               else{
                           var parent=TOOLS.findParent(e.target,"touchY");
                           if(parent){parent.ref.touchY();}
                          
                }
                dom.click=false; 
               
            }
            var cancelFindYourWay=function(){
               dom.move=false;
               dom.click=false;
            }
    
            var touchevent =function(eventname,e,callback){
                var affectEvent=function(e,event,callback){
                     if( typeof callback !=='function')throw("callback need to be a function");
                     e=TOOLS.jQueryToNatif(e);
                     if(!TOOLS.isInPage(e))throw("We can't register a event on a dom not in body");
                     if(!e.ref)e.ref={};
                     if( e.ref[event])throw("Event "+event+" is already defined");
                     e.ref[event]=callback;
                }
            
                switch(eventname){
                    default:
                        throw(eventname + "is not a known event try touchX or touchY");
                        break;
                    case "click":
                        affectEvent(e,"click",callback);
                        break;
                    case "longclick":
                        affectEvent(e,"longclick",callback);
                        break;
                    case "longclickup":
                         affectEvent(e,"longclickup",callback);
                         break;  
                    case "touchX":
                        affectEvent(e,"touchX",callback);
                         break;
                    case "touchY":
                        affectEvent(e,"touchY",callback);
                        break;
                    case "doubleclick":
                        
                        break;
                    case "scrollUp":
                        affectEvent(e,"scrollUp",callback);
                        break;
                    case "scrollDown":
                        affectEvent(e,"scrollDown",callback);
                        break;
                        
                }    
            }
            return{
                  click:domEvents.click,
                  mousemove:domEvents.mousemove,
                  refresh:domEvents.refresh,
                  mouseup:domEvents.mouseup,
                  mousewheel:domEvents.mousewheel,
                  touchevent:touchevent,
                  stopClick:stopClick,
                  startLongClick:startLongClick,
                  stopLongClick:stopLongClick,
                  stopFindYourWay:stopFindYourWay,
                  cancelFindYourWay:cancelFindYourWay,
                  stopScrollDown:stopScrollDown,
                  stopScrollUp:stopScrollUp
                 
            } 
        }();
        
        var DOMEVENT=function(){     
            return {
                 onresize:function(space,id,callback){ if(dom.resize[space]){dom.resize[space][id]=callback;}},  
            }
        }();
        
         var DOMMOVE=function(){
             var domEvents={
                 refresh:function(){
                      
                    var dm=dom.dragAndDrop;
                    if(dm.refresh){    
                            dm.dom.style.left= dm.posEnd.x;
                            dm.dom.style.top= dm.posEnd.y;
                            dm.refresh=false;
                    }
                 },
                 mousemove:function(e){
                     
                        var d=dom.dragAndDrop;
                        if(!d.mouse){d.mouse={x:e.clientX,y:e.clientY}}
                        var x=d.posStart.x;
                        var y=d.posStart.y;
                         
                        switch(d.way){  
                            case "-x":
                                x+=(d.mouse.x-e.clientX)*d.speed;  
                                break;
                            case "x":
                                x-=(d.mouse.x-e.clientX)*d.speed;  
                                break;
                            case "-y":
                                y+=(d.mouse.y-e.clientY)*d.speed;  
                                break;
                             case "y":
                                y-=(d.mouse.y-e.clientY)*d.speed;  
                                break;
                             case "xy":
                                x-=(d.mouse.x-e.clientX)*d.speed; 
                                y-=(d.mouse.y-e.clientY)*d.speed;  
                                
                                break;
                        }   
                         
                        d.refresh=true;
                        d.posEnd={y:y,x:x};
                       
                 },
                 mouseup:function(e){
                      DOMMOVE.stopDragAndDrop();
                 }
             }
             var startDragAndDrop=function(domNode,way,speed,callback){
                dom.move="dragAndDrop";
                
                var position = TOOLS.getOffset(domNode);
                domNode.style.transition="none";
                dom.dragAndDrop&&(stopDragAndDrop());
                
                var computedStyle = window.getComputedStyle(domNode); 
         
                dom.dragAndDrop={
                    timeStart:getTime(),
                    timeEnd:getTime()+1,
                    dom:domNode,
                    speed:speed,
                    mouse:false,
                    css:{
                       position:computedStyle.position,
                       zIndex:computedStyle.zIndex,
                    },
                    posEnd:{x:position.left ,y:position.top  },
                    posStart:{x:position.left ,y:position.top  },
                    way:way,
                    callback:callback,
                    refresh:false,
                };
                if(computedStyle.position!=="absolute"||computedStyle.position!=="fixed"){
                    dom.dragAndDrop.dom.style.width=position.inner.width+"px";
                    dom.dragAndDrop.dom.style.top=position.top+"px";
                    dom.dragAndDrop.dom.style.left=position.left+"px";
                    dom.dragAndDrop.dom.style.height=position.inner.height+"px";
                    dom.dragAndDrop.dom.style.position="absolute";
                    dom.dragAndDrop.dom.style.zIndex="200";
                }
              
            }
       
            var stopDragAndDrop =function(){ 
                dom.move=false;
                var domObj=dom.dragAndDrop;
                domObj.timeEnd=getTime(); 
                var time=domObj.timeEnd-domObj.timeStart;
                var x= Math.abs(domObj.posStart.x-domObj.posEnd.x);
                var y= Math.abs(domObj.posStart.y-domObj.posEnd.y);
                domObj.vitesse={x:1/(time*1/x),y:1/(time*1/y)}; 
            
                
                dom.dragAndDrop.dom.style.zIndex=domObj.css.zIndex;
                dom.dragAndDrop.dom.style.position=domObj.css.position;
             
                domObj.callback(domObj);
                dom.dragAndDrop=false;
             
               
            }
             
             return{
                 refresh:domEvents.refresh,
                 mousemove:domEvents.mousemove,
                 mouseup:domEvents.mouseup,
                 startDragAndDrop:startDragAndDrop,
                 stopDragAndDrop:stopDragAndDrop,
             }
             
         }();
         
         var TOOLS=function(){
              var findParent = function(n,param){
                          while(n!=null){
                              if(n.ref && typeof n.ref[param]==='function'){return n }
                              var n=n.parentNode;
                           }
                     return false;
              }
             
             
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
                    var bc = e.getBoundingClientRect();
                     var computedStyle = window.getComputedStyle(node); 
                     var paddingTop=parseInt(computedStyle.paddingTop, 10);
                     var paddingBottom=parseInt(computedStyle.paddingBottom, 10);
                    var paddingLeft=parseInt(computedStyle.paddingLeft, 10);
                     var paddingRight=parseInt(computedStyle.paddingRight, 10);
                    
                    
                    var h = e.clientHeight;
                   
                    var marginTop=parseInt(computedStyle.marginTop, 10);
                    var borderTop=parseInt(computedStyle.borderTopWidth, 10)
                    h += marginTop+borderTop;
                    h += parseInt(computedStyle.borderBottomWidth, 10);
                    h += parseInt(computedStyle.marginBottom, 10);
                    var w = e.clientWidth;
                    w += parseInt(computedStyle.marginRight, 10);
                    w += parseInt(computedStyle.borderRightWidth, 10);
                    var marginLeft=parseInt(computedStyle.marginLeft, 10);;
                    var borderLeft=parseInt(computedStyle.borderLeftWidth, 10);
                    w += borderLeft + marginLeft;
                    return {
                        left: bc.left + window.scrollX-marginLeft-borderLeft,
                        top: bc.top + window.scrollY-marginTop-borderTop,
                        outer:{height:h,width:w},
                        inner:{height:e.clientHeight-(paddingTop+paddingBottom),width:e.clientWidth-(paddingRight+paddingLeft)}
                    }
             }
             return{
                  getOffset:getOffset,
                  selection:selection,
                  jQueryToNatif:jQueryToNatif,
                  isInPage:isInPage,
                  findParent:findParent,
             }
         }();   
  
     
        var EVENT=function(){
            //@FRAME REFRESH 
            var refresh = function(){ 
                TOUCHEVENT.refresh();
                DOMMOVE.refresh();
            }
            var click = function (e){     
                TOUCHEVENT.click(e);   
            }
            
            var resize=function(e){
               
                 var w={x:window.innerWidth,y:window.innerHeight};
                //@OPTI RESIZE X
                if(w.x!=mem.window.x){
                    mem.window.x=w.x;
                    for(var i in dom.resize.x){dom.resize.x[i]();}
                }
            }
            
            var mousemove=function(e){  
               mem.mouse={x:e.clientX,y:e.clientY};
              
               switch(dom.move){
                   default:
                       break;
                   case "whereYouGo":
                       TOUCHEVENT.mousemove(e);        
                       break;
                   case "dragAndDrop":
                       DOMMOVE.mousemove(e);
                       break;
                   case "longclick": 
                       break;
               }
            }
            var mousewheel=function(e){
                TOUCHEVENT.mousewheel(e); 
             
                

            }
            var mouseup=function(e){
               
                if(dom.click){
                    TOUCHEVENT.mouseup();
                }
                if(dom.dragAndDrop){
                    DOMMOVE.mouseup();
                }
                 dom.move=false;
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
             touchevent:TOUCHEVENT.touchevent,
             move:DOMMOVE.startDragAndDrop, 
             onresize:DOMEVENT.onresize,
             selection:TOOLS.selection,
        });  
    }();
    
      
  
    
})();                
