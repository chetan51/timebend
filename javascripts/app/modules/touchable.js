(function() {
  var Touchable,
    _this = this;

  Touchable = {
    watchTouch: function() {
      return this.touch_el = this.touch_el ? this.touch_el : this.el;
    },
    touchable_startTouching: function(event) {
      this.touch_start = {};
      this.touch_last = {};
      this.touch_start.x = event.originalEvent.touches[0].pageX;
      this.touch_start.y = event.originalEvent.touches[0].pageY;
      this.touch_start.time = new Date();
      this.touch_last.x = this.touch_start.x;
      this.touch_last.y = this.touch_start.y;
      return this.startTouching(event);
    },
    touchable_continueTouching: function(event) {
      return console.log("lol");
    },
    touchable_finishTouching: function(event) {
      return this.finishTouching(event);
    }
  };

  window.Touchable = Touchable;

}).call(this);
