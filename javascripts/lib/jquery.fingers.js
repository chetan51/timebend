((function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p;a=jQuery,o={},o.start={},o.end={},o.gestures={},p={},k={distances:{scroll:5}},a.event.special.pullup={setup:function(){return i({teardown:function(){return j}})}},a.event.special.pulldown={setup:function(){return i({teardown:function(){return j}})}},i=function(){return a(this).off(".fingers"),a(this).on("touchstart.fingers",g),a(this).on("touchmove.fingers",f),a(this).on("touchend.fingers",e)},j=function(){return a(this).off(".fingers")},a(document).ready(function(){return a(document).bind("touchstart.fingers",d),a(document).bind("touchmove.fingers",c),a(document).bind("touchend.fingers",b)}),n=function(a){return o.start=h(a),o.last=Object.create(o.start),o.dx=0,o.dy=0},m=function(a){return o.last=h(a),o.dx=o.last.x-o.start.x,o.dy=o.last.y-o.start.y},l=function(a){},g=function(a){return!0},f=function(b){var c,d,e,f;o.dy>0?(o.gestures.pulldown=!0,o.gestures.pullup=!1):o.dy<0?(o.gestures.pullup=!0,o.gestures.pulldown=!1):(o.gestures.pullup=!1,o.gestures.pulldown=!1),d=Object.keys(o.gestures);for(e=0,f=d.length;e<f;e++)c=d[e],o.gestures[c]&&a(b.target).trigger(c,o);return!0},e=function(a){return!0},d=function(a){return n(a),p.document_vertical_scrolling=!1,p.document_horizontal_scrolling=!1,!0},c=function(a){var b,c;return m(a),c=o.last.y-o.start.y,Math.abs(c)>k.distances.scroll&&(p.document_vertical_scrolling=!0),b=o.last.x-o.start.x,Math.abs(b)>k.distances.scroll&&(p.document_horizontal_scrolling=!0),!0},b=function(a){return l(a),!0},h=function(a){return{x:a.originalEvent.touches[0].pageX,y:a.originalEvent.touches[0].pageY,time:new Date}}})).call(this)