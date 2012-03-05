(function() {
  var TaskItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskItem = (function(_super) {

    __extends(TaskItem, _super);

    TaskItem.prototype.events = {
      "tap input[type='text']": "editName",
      "focusout input[type='text']": "updateName",
      "tap .duration": "toggleDuration",
      "touchstart": "startTouching",
      "touchmove": "continueTouching",
      "touchend": "finishTouching"
    };

    function TaskItem() {
      this.toggleDuration = __bind(this.toggleDuration, this);
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      this.remove = __bind(this.remove, this);
      this.updateName = __bind(this.updateName, this);
      this.editName = __bind(this.editName, this);
      this.startEditingName = __bind(this.startEditingName, this);
      this.updateTransform = __bind(this.updateTransform, this);
      this.transformed = __bind(this.transformed, this);
      this.transforming = __bind(this.transforming, this);
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
      this.item.controller = this;
      this.html(this.template(this.item));
      return this;
    };

    TaskItem.prototype.transforming = function() {
      return this.el.css({
        'height': '0',
        'z-index': '-1'
      });
    };

    TaskItem.prototype.transformed = function() {
      return this.el.css({
        'height': '60px',
        'z-index': '1'
      });
    };

    TaskItem.prototype.updateTransform = function(rotate_x, animated, callback) {
      var transform_properties,
        _this = this;
      this.el.css({
        transformOrigin: '50% 0'
      });
      transform_properties = {
        rotateX: rotate_x + 'deg'
      };
      if (animated) {
        if (this.el.css('rotateX') === rotate_x + 'deg') {
          return callback && callback();
        } else {
          return this.el.transition(_.extend(transform_properties, {
            complete: function() {
              return callback && callback();
            }
          }));
        }
      } else {
        return this.el.css(transform_properties);
      }
    };

    TaskItem.prototype.startEditingName = function() {
      this.el.find('input').val("");
      return this.el.find('input').focus();
    };

    TaskItem.prototype.editName = function(event) {
      return event.target.focus();
    };

    TaskItem.prototype.updateName = function(event) {
      var name;
      name = $(event.target).val();
      if (name.length) {
        this.item.name = name;
        return this.item.save();
      } else {
        return Tasks.trigger('task:delete', this.item);
      }
    };

    TaskItem.prototype.remove = function() {
      return this.el.remove();
    };

    TaskItem.prototype.startTouching = function(event) {
      return console.log(event);
    };

    TaskItem.prototype.continueTouching = function(event) {
      return console.log(event);
    };

    TaskItem.prototype.finishTouching = function(event) {
      return console.log(event);
    };

    TaskItem.prototype.toggleDuration = function() {
      console.log("Duration");
      return alert("duration tapped");
    };

    return TaskItem;

  })(Spine.Controller);

  window.TaskItem = TaskItem;

}).call(this);
