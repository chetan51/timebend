((function(){var a,b,c,d,e,f,g,h,i,j;a=jQuery,e={distance:{scroll:3,held:3,pull:3},time:{held:300}},i={},i.start={},i.last={},i.gestures={},i.gesture_detected={},a.event.special.pullup={},a.event.special.pulldown={},a.event.special.pullright={},a.event.special.pullleft={},a.event.special.held={},a.event.special.tapped={},a(document).ready(function(){return a(document).bind("touchstart.fingers",h),a(document).bind("touchmove.fingers",g),a(document).bind("touchend.fingers",f)}),h=function(b){var f=this;return i.start=c(b),i.last=Object.create(i.start),i.gesture_detected=null,i.gestures={},i.absolute_dx=0,i.absolute_dy=0,i.document_vertical_scrolling=!1,i.document_horizontal_scrolling=!1,i.dx=0,i.dy=0,delay(e.time.held,function(){var c;i.gesture_detected||(c=e.distance.held,i.gestures.held=i.absolute_dx<=c&&i.absolute_dy<=c,d());if(i.gestures.held)return j(a(b.target),b),i.gestures.held=!1}),!0},g=function(f){var g,h;return i.last=c(f),i.absolute_dx=i.last.x-i.start.x,i.absolute_dy=i.last.y-i.start.y,Math.abs(i.absolute_dy)>e.distance.scroll&&(i.document_vertical_scrolling=!0),Math.abs(i.absolute_dx)>e.distance.scroll&&(i.document_horizontal_scrolling=!0),g=e.distance.pull,!i.gesture_detected&&(Math.abs(i.absolute_dx)>g||Math.abs(i.absolute_dy)>g)&&(console.log("pull gesture detected"),d(),h=i.gesture_detected.x-i.start.x),i.gesture_detected&&(i.dx=b(i.absolute_dx,"x"),i.dy=b(i.absolute_dy,"y")),i.absolute_dy===0?(i.gestures.pullup=!1,i.gestures.pulldown=!1):i.absolute_dy>0?(i.gestures.pulldown=!0,i.gestures.pullup=!1):i.absolute_dy<0&&(i.gestures.pullup=!0,i.gestures.pulldown=!1),i.absolute_dx===0?(i.gestures.pullright=!1,i.gestures.pullleft=!1):i.absolute_dx>0?(i.gestures.pullright=!0,i.gestures.pullleft=!1):i.absolute_dx<0&&(i.gestures.pullleft=!0,i.gestures.pullright=!1),j(a(f.target),f),!0},f=function(b){var c;return Object.keys(i.gestures).length===0&&(c=e.distance.held,i.absolute_dx<=c&&i.absolute_dy<=c&&(i.gestures.tapped=!0,d(),j(a(b.target),b))),!0},d=function(){return i.gesture_detected=Object.create(i.last)},j=function(a,b){var c,d,e,f,g;d=Object.keys(i.gestures),g=[];for(e=0,f=d.length;e<f;e++)c=d[e],i.gestures[c]?(i.originalEvent=b,g.push(a.trigger(c,i))):g.push(void 0);return g},c=function(a){return{x:a.originalEvent.touches[0].pageX,y:a.originalEvent.touches[0].pageY,time:new Date}},b=function(a,b){var c;return c=i.gesture_detected[b]-i.start[b],a-c},window.delay=function(a,b){return setTimeout(b,a)}})).call(this)