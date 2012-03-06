(function() {
  var Touchable;

  Touchable = {
    watchTouch: function() {
      var _this = this;
      this.touch_el = this.touch_el ? this.touch_el : this.el;
      this.touch_el.bind('touchstart', function(e) {
        return _this.touchable_startTouching(e);
      });
      this.touch_el.bind('touchmove', function(e) {
        return _this.touchable_continueTouching(e);
      });
      return this.touch_el.bind('touchend', function(e) {
        return _this.touchable_finishTouching(e);
      });
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
      this.touch_last.x = event.originalEvent.touches[0].pageX;
      return this.touch_last.y = event.originalEvent.touches[0].pageY;
    },
    touchable_finishTouching: function(event) {
      return this.finishTouching(event);
    }
  };

  window.Touchable = Touchable;

}).call(this);
