((function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}},c=Array.prototype.indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1};a=function(){function a(a,c,d){this.elements=a,this.config=c,this.callbacks=d,this.reset=b(this.reset,this),this.releasedHandler=b(this.releasedHandler,this),this.pullHandler=b(this.pullHandler,this),this.heldHandler=b(this.heldHandler,this),this.reset(),this.elements.root.off(".swipeable"),this.elements.root.on("held.swipeable",this.heldHandler),this.elements.root.on("pullright.swipeable",this.pullHandler),this.elements.root.on("pullleft.swipeable",this.pullHandler),this.elements.root.on("touchend.swipeable",this.releasedHandler)}return a.prototype.heldHandler=function(a,b){return console.log("held"),this.held=!0},a.prototype.pullHandler=function(a,b){var d,e,f,g,h,i,j,k;if(!this.held)if(this.pulling||!b.document_vertical_scrolling){this.pulling=!0,b.originalEvent.preventDefault(),e=b.dx,e>0?(this.state.swipe_direction="right",this.state.active_gutter=this.elements.left_gutter,this.state.gutter_position="left"):e<0&&(this.state.swipe_direction="left",this.state.active_gutter=this.elements.right_gutter,this.state.gutter_position="right");if(this.state.active_gutter){Math.abs(e)>this.config.gutter_width&&(f=Math.abs(e)-this.config.gutter_width,j=this.config.gutter_width+f/(f/50+1),e=e>0?j:-j),this.elements.content.css({x:e}),h=Math.abs(e)/this.config.gutter_width,g=this.config.invert_gutters,g&&(k=this.state.gutter_position,c.call(g,k)>=0)&&(h=1-h),this.state.active_gutter.css({opacity:h}),i=Math.abs(e)>=this.config.gutter_width;if(i===!this.state.swipe_gesture_active){this.state.swipe_gesture_active=i,d=i?this.callbacks.swipeActive:this.callbacks.swipeInactive;if(d)return d(this.state.swipe_direction,this.state.active_gutter)}}}},a.prototype.releasedHandler=function(a,b){var c,d=this;return c=this.state,this.pulling&&this.state.active_gutter&&this.elements.content.transition({x:0},function(){var a;c.swipe_gesture_active?a=d.callbacks.swipeComplete:a=d.callbacks.swipeIncomplete;if(a)return a(c.swipe_direction,c.active_gutter)}),this.reset()},a.prototype.reset=function(){return this.pulling=!1,this.held=!1,this.state={}},a}(),window.Swipeable=a})).call(this)