/**
 *  lib/TOUCHEVENT.js
 *  This file is part of the DOM MOBILE package.
 *  
 * (c) Gaetan Vigneron <gaetan@webworkshops.fr>
 *  V 0.1.0
 *  
 *  09/10/2016 
 ***
 *
 *  #touchevent
 *  @target dom | jQueryDom
 *  @syntax  dom.touchevent {function}  
 *  @param eventname{string} 
 *       - Same for MOUSE & TOUCH 
 *         click
 *         longclick
 *         longclickup
 *         touchX
 *         touchY
 *         dbclick
 *         scrollUp
 *         scrollDown
 *  @param callback{function} 
 *  @exemple : dom.touchevent('dbclick', dbclick);
 *
 **/
(function () {
    'use strict';
    var EVENT = function (e) {
        this.target = e.target;
        this.timeStart = DOM.getTime();
        this.mouseStart = {x: e.touch.x, y: e.touch.y};
        this.vitesse = {x: 0, y: 0};
        this.origin = e.target;
        this.mouseEnd = {x: e.touch.x, y: e.touch.y},
        this.etat = "init";
    }

    var TOUCHEVENT = function () {
        var param = {
            timeLongclick: 400, //@Time to determinate when is a longClick
            timeDbclick: 200, //@Time to determinate when is a dbclick
            debug:false,
        }
        var event = false;
        var memwindow= {x: window.innerWidth, y: window.innerHeight};
        var trace=function(value){
            if(param.debug){
                console.log(value);
            }
        };
        
         var findParent = function (n, param) {
                while (n != null) {
                    if (n.ref && typeof n.ref[param] === 'function') {
                        return n
                    }
                    var n = n.parentNode;
                }
                return false;
        };
        /**
         -------------------------
         @INIT                   : (touchdown)=> click.etat="init" 
         -------------------------
         @SCROLLUP               : (scrollup)=> click.etat="scrollUp"
         @SCROLLDOWN             : (scrolldown)=> click.etat="scrollDown"
         -------------------------
         ETAT::init
         @INIT                   :  move="whereYouGo"
         @WAITCLICK              : (touchup)                => click.etat="waitclick"
         @LONGCLICK              : (time>timeLongclick)     => click.etat="longclick"
         @MOVEX                  : (touchmove && moveX >4)  => click.etat="moveX"
         @MOVEY                  : (touchmove && moveY >4)  => click.etat="moveY"
         -------------------------
         ETAT::waitclick  
         @INIT                   :  move="waitclick"
         @DBCLICK                : (time>timeDbclick)       => click.etat="dbclick"
         @CLICK                : (not event dbclick)        => click.etat="click" 
         -------------------------
         ETAT::longclick
         @INIT                   :  move="longclick"
         @LONGCLICKUP            : (touchup)                => click.etat="longclickup"
         -------------------------
         **/
        DOM.extendDOM(
                {
                    touchevent: function (eventname, callback) {
                        var e = this.toNatif();
                        var affectEvent = function (event, callback) {
                            if (typeof callback !== 'function')
                                throw("callback need to be a function");

                            if (!e.inPage())
                                throw("We can't register a event on a dom not in body");
                            if (!e.ref)
                                e.ref = {};
                            if (e.ref[event])
                                throw("Event " + event + " is already defined");
                            e.ref[event] = callback;
                        }
                        switch (eventname) {
                            default:
                                throw(eventname + "is not a known event try touchX or touchY");
                                break;
                            case "click":
                                affectEvent("click", callback);
                                break;
                            case "longclick":
                                affectEvent("longclick", callback);
                                break;
                            case "longclickup":
                                affectEvent("longclickup", callback);
                                break;
                            case "touchX":
                                affectEvent("touchX", callback);
                                break;
                            case "touchY":
                                affectEvent("touchY", callback);
                                break;
                            case "dbclick":
                                affectEvent("dbclick", callback);
                                break;
                            case "scrollUp":
                                affectEvent("scrollUp", callback);
                                break;
                            case "scrollDown":
                                affectEvent("scrollDown", callback);
                                break;
                            case "resizeX":
                                affectEvent("resizeX", callback);
                                 e.addClass("resizeX");
                                break;
                            case "resizeY":
                                affectEvent("resizeY", callback);
                                e.addClass("resizeY");
                                break;
                        }
                    },
                }
        );
        DOM.extendEVENT({
            resize:function(e){
                var w = {x: window.innerWidth, y: window.innerHeight};
                if (w.x !==memwindow.x) { 
                    memwindow.x = w.x;
                    var cible=document.querySelectorAll(".resizeX");
                     for(var i=0; i<cible.length;i++){
                        var node=cible[i];
                        if (node.ref && typeof node.ref.resizeX === 'function') {
                            node.ref.resizeX(event);
                        }
                    }
                }
                if (w.y !==memwindow.y) { 
                    memwindow.y = w.y;
                    var cible=document.querySelectorAll(".resizeY");
                     for(var i=0; i<cible.length;i++){
                         var node=cible[i];
                        if (node.ref && typeof node.ref.resizeY === 'function') {
                            node.ref.resizeY(event);
                        }
                      
                      
                    }
                }  
            },
            click: function (e) {
               
                if (!event) {
                    trace("init");
                    event = new EVENT(e);
                    
                    setTimeout(function () {
                        EVENTTOUCH.startLongClick();
                    }, param.timeLongclick);
                } else {
                    if (event.etat === "waitclick") {
                          EVENTTOUCH.stopDbClick();
                    }
                }
              
            },
             mousemove: function (e) {
               
                if (event) {
                    if(event.etat==="init"){
                       if (Math.abs(e.touch.x - event.mouseStart.x) > 4 || Math.abs(e.clientY - event.mouseStart.y) > 4) {
                           EVENTTOUCH.stopFindYourWay(e);
                       } 
                    }
                }
                 
              },
            mouseup: function (e) {
                if (event) {
                
                    switch(event.etat){
                        default:
                            trace("event end by mouseup");
                            event=false;
                            break;
                            
                        case "waitlongclick":
                            EVENTTOUCH.stopLongClick();
                            break;
                        case "init":
                            var node = event.target;
                         
  
                            if (node.ref && typeof node.ref.dbclick === 'function') {
                                trace("waitclick");
                                event.etat = "waitclick";
                                setTimeout(function () {
                                    if(event.etat === "waitclick"){
                                         EVENTTOUCH.stopClick();
                                    }
                                }, param.timeDbclick);
                            }else {
                                  EVENTTOUCH.stopClick();
                            }
                            break;
                                    
                    }
                }
            },
            mousewheel: function (e) {

                 if (!event) {
                    event = new EVENT(e);
                    event.etat = "scroll";
                    e.detail > 0 ? EVENTTOUCH.stopScrollDown() : EVENTTOUCH.stopScrollUp();
                    if (event.etat == "scrollUp"||event.etat == "scrollDown") {
                       
                        e.preventDefault();
                    }
                    event = false;
                }
           }
            
        });

        var EVENTTOUCH  ={ 
            stopScrollUp : function () {
                if(event&&event.etat === "scroll"){
                    var parent = findParent(event.target, "scrollUp");
                    if (parent) {
                        event.target = parent;
                        event.etat = "scrollUp";
                        parent.ref.scrollUp(event);
                    }
               }
            },
           stopScrollDown : function () {
                if(event&&event.etat === "scroll"){
                    var parent = findParent(event.target, "scrollDown");
                    if (parent) {
                        event.target = parent;
                        event.etat = "scrollDown";
                        parent.ref.scrollDown(event);
                    }
                }
            },
             /***
             * @ASYNCH
             **/
             startLongClick : function () {
                if(event){
                    if(event.etat === "init"){
                            event.etat = "waitlongclick";
                            trace("waitlongclick");
                            var node = event.target;   
                            if (node.ref && typeof node.ref.longclick === 'function') {

                                node.ref.longclick(event);
                            }
                            
                    }
                }
            },
            stopLongClick : function () {
                if(event){
                    var node = event.target;
                    event.etat = "longclick";
                    trace("longclick");
                    if (node.ref && typeof node.ref.longclickup === 'function') {
                        node.ref.longclickup(event);
                    }
                    event = false;
                }else{
                     throw("stopLongClick is call without event");
                }
            },
            /**
             * @ASYNCH
             **/
            stopClick : function () {
                if(event){
                    if (event.etat === "init" || event.etat === "waitclick") {
                        event.etat = "click"
                        trace("click");
                        var node = event.target;
                        if (node.ref && typeof node.ref.click === 'function') {
                            node.ref.click(event);
                        }
                    }
                    event=false;
                }
            },
            /**
            * @ASYNCH
            **/
            stopDbClick : function () {
                 if(event){
                    if (event.etat === "waitclick") {
                        event.etat = "dbclick"
                         trace("dbclick");
                        var node = event.target;
                        if (node.ref && typeof node.ref.dbclick === 'function') {
                            node.ref.dbclick(event);
                        }
                        event=false;
                    }
                 }
             },
             stopFindYourWay : function (e) {
                 if(event){
                    if (event.etat === "init") {
                        var direction = Math.abs(e.touch.x - event.mouseStart.x) > Math.abs(e.touch.y - event.mouseStart.y);
                  
                        if (direction) {
                            event.etat = "moveX";
                            trace("moveX");
                            var parent = findParent(e.target, "touchX");
                            if (parent) {
                                parent.ref.touchX(event);
                            }
                        } else {
                            event.etat = "moveY";
                            trace("moveY");
                            var parent = findParent(e.target, "touchY");
                            if (parent) {
                                parent.ref.touchY(event);
                            }

                        }
                        event = false;
                    }
                }

            }
        }

    }();
})();
