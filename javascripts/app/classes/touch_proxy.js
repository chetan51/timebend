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

    TouchProxy.prototype.startTouching = function(event) {};

    TouchProxy.prototype.continueTouching = function(event) {};

    TouchProxy.prototype.finishTouching = function(event) {};

    return TouchProxy;

  })();

  window.TouchProxy = TouchProxy;

}).call(this);
