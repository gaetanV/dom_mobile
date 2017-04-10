```

(c) Gaetan Vigneron 
10/04/2017

```

lib/DOM.js 

```

Single event (touch and mouse) dispatcher 

(click, mouseup , mousemove , mousewheel, refresh, resize)

One animation tread (  24 fps )

/**
* @target dom | jQueryDom
* @exemple : DOM($dom);
* @exemple : DOM(dom);
*/

```

lib/module/touch_event.js

```
/**
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
*         zoom
*  @param callback{function} 
*  @exemple : dom.touchevent('dbclick', dbclick);
**/
```

lib/module/scroll_event.js

```
/**
 *  @target dom | jQueryDom
 *  @syntax  dom.scrollEvent {function}  
 *  @param eventname{string} 
 *       - Same for MOUSE & TOUCH 
 *         up
 *         down
 *  @param callback{function} 
 *  @exemple : dom.scrollEvent('up', callback);
 **/
```


lib/module/resize_event.js

```
/**
 *  @target dom | jQueryDom
 *  @syntax  dom.resizeEvent {function}  
 *  @param eventname{string} 
 *       - Same for MOUSE & TOUCH 
 *         x
 *         y
 *         xy
 *  @param callback{function} 
 *  @exemple : dom.resizeEvent('x', callback);
 **/
```


lib/module/move.js

CSS matrix (with speed analysis)

```
/**
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
**/
```