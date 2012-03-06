(function() {
  var TouchProxy,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TouchProxy = (function() {

    function TouchProxy(el, startCallback, continueCallback, finishCallback) {
      this.el = el;
      this.startCallback = startCallback;
      this.continueCallback = continueCallback;
      this.finishCallback = finishCallback;
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      this.data = {};
      this.el.bind('touchstart', this.startTouching);
      this.el.bind('touchmove', this.continueTouching);
      this.el.bind('touchend', this.finishTouching);
    }

    TouchProxy.prototype.startTouching = function(event) {
      var start;
      start = {};
      start.x = event.originalEvent.touches[0].pageX;
      start.y = event.originalEvent.touches[0].pageY;
      start.time = new Date();
      this.data.start = start;
      this.data.last = start;
      return this.startCallback(event, this.data);
    };

    TouchProxy.prototype.continueTouching = function(event) {
      var last;
      last = {};
      last.x = event.originalEvent.touches[0].pageX;
      last.y = event.originalEvent.touches[0].pageY;
      this.data.last = last;
      return this.continueCallback(event, this.data);
    };

    TouchProxy.prototype.finishTouching = function(event) {
      return this.finishCallback(event, this.data);
    };

    return TouchProxy;

  })();

  window.TouchProxy = TouchProxy;

}).call(this);
