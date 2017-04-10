```

(c) Gaetan Vigneron 
10/04/2017

```

lib/DOM.js 


No lifecycle 

Single event (touch and mouse) dispatcher 

```

DOM($a);
DOM(a);

    /**
    *   click
    *   mouseup
    *   mousemove
    *   mousewheel
    *   refresh
    *   resize
    **/
One tread (  24 fps )

```

lib/module/TOUCHEVENT.js

Dispatch differents events on dom target selector 

( resizeX - resizeY ) dispatch direct events on dom selector

```
    /**
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
     *         resizeX
     *         resizeY
     *         zoom
     *  @param callback{function} 
     *  @exemple : dom.touchevent('dbclick', dbclick);
     *
     **/
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
     @MULTITOUCH             : (e.touch)                => click.etat="multitouch"
     -------------------------
     ETAT::waitclick  
     @INIT                   :  move="waitclick"
     @DBCLICK                : (time>timeDbclick)       => click.etat="dbclick"
     @CLICK                  : (not event dbclick)      => click.etat="click"   
     -------------------------
     ETAT:multitouch  
     @ZOOM                   : (e.touch)                => click.etat="zoom"
     -------------------------
     ETAT:zoom  
     @SENDZOOM               :                          => click.etat="zoom"
     -------------------------
     ETAT::longclick
     @INIT                   :  move="longclick"
     @LONGCLICKUP            : (touchup)                => click.etat="longclickup"
     -------------------------
     **/

```
lib/module/MOVE.js

CSS matrix (with speed analysis)

```
    /**
     *  #move
     *  @target dom | jQueryDom
     *  @syntax  dom.move {function}  
     *  @param way{string} 
     *         x
     *         -x
     *         y
     *         -y
     *         xy
     *  @param speed{integer}        
     *  @param callback{function} 
     *  @exemple : dom.move("xy", 1, callback);
     *  
     **/

```