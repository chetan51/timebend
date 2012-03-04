(function() {
  var AgendaItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  AgendaItem = (function(_super) {

    __extends(AgendaItem, _super);

    function AgendaItem() {
      this.render = __bind(this.render, this);      AgendaItem.__super__.constructor.apply(this, arguments);
      this.item.bind("update", this.render);
      Task.bind("create refresh update destroy", this.render);
      this.render();
    }

    AgendaItem.prototype.render = function() {
      return setTimeout(this.render, 500);
    };

    return AgendaItem;

  })(Spine.Controller);

  window.AgendaItem = AgendaItem;

}).call(this);
