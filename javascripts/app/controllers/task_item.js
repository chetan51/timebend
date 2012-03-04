(function() {
  var TaskItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskItem = (function(_super) {

    __extends(TaskItem, _super);

    function TaskItem() {
      this.remove = __bind(this.remove, this);
      this.editName = __bind(this.editName, this);
      this.updateTransform = __bind(this.updateTransform, this);
      this.updateHeight = __bind(this.updateHeight, this);
      this.render = __bind(this.render, this);
      this.template = __bind(this.template, this);      TaskItem.__super__.constructor.apply(this, arguments);
      if (!this.item) throw "@item required";
      this.item.bind("update", this.render);
      this.item.bind("destroy", this.remove);
    }

    TaskItem.prototype.template = function(item) {
      return _.template($("#task-template").html(), {
        task: item
      });
    };

    TaskItem.prototype.render = function(item) {
      if (item) this.item = item;
      this.html(this.template(this.item));
      this.item.controller = this;
      this.el.find(".task").data('id', this.item.id);
      return this;
    };

    TaskItem.prototype.updateHeight = function(height) {
      return this.el.css({
        'height': height
      });
    };

    TaskItem.prototype.updateTransform = function(rotate_x, animated, callback) {
      var transform_properties,
        _this = this;
      transform_properties = {
        '-webkit-transform-origin': '50% top 0',
        '-webkit-transform': 'rotateX(' + rotate_x + 'deg)'
      };
      if (animated) {
        return this.el.animate(transform_properties, {
          complete: function() {
            if (callback) return callback();
          }
        });
      } else {
        return this.el.css(transform_properties);
      }
    };

    TaskItem.prototype.editName = function() {
      return this.el.find('input').focus();
    };

    TaskItem.prototype.remove = function() {
      return this.el.remove();
    };

    return TaskItem;

  })(Spine.Controller);

  window.TaskItem = TaskItem;

}).call(this);
