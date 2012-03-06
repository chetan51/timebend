(function() {
  var TaskItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskItem = (function(_super) {

    __extends(TaskItem, _super);

    TaskItem.include(Touchable);

    TaskItem.config = {
      height: 40,
      gutter_width: 36,
      touch_tap_time_tolerance: 500,
      touch_tap_dist_tolerance: 5,
      touch_hold_dist_tolerance: 5,
      touch_swipe_dist_tolerance: 15
    };

    TaskItem.prototype.className = "task";

    TaskItem.prototype.elements = {
      ".content": "content",
      "input[type='text']": "name_input",
      ".duration": "duration",
      ".check": "checkmark"
    };

    TaskItem.prototype.events = {
      "focusout input[type='text']": "updateName"
    };

    function TaskItem() {
      this.toggleDuration = __bind(this.toggleDuration, this);
      this.checkTouchStatus = __bind(this.checkTouchStatus, this);
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      this.remove = __bind(this.remove, this);
      this.updateName = __bind(this.updateName, this);
      this.startEditingName = __bind(this.startEditingName, this);
      this.editName = __bind(this.editName, this);
      this.transformCheckmarkOpacity = __bind(this.transformCheckmarkOpacity, this);
      this.transformTranslateX = __bind(this.transformTranslateX, this);
      this.transformRotateX = __bind(this.transformRotateX, this);
      this.transform = __bind(this.transform, this);
      this.transformed = __bind(this.transformed, this);
      this.transforming = __bind(this.transforming, this);
      this.render = __bind(this.render, this);
      this.template = __bind(this.template, this);      TaskItem.__super__.constructor.apply(this, arguments);
      if (!this.item) throw "@item required";
      this.item.bind("update", this.render);
      this.item.bind("destroy", this.remove);
      this.watchTouch();
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
        'height': TaskItem.config.height + 'px',
        'z-index': '1'
      });
    };

    TaskItem.prototype.transform = function(element, name, dist, unit, animated, callback) {
      var transform_properties,
        _this = this;
      transform_properties = {};
      transform_properties[name] = dist + unit;
      if (animated) {
        if (element.css(name) === dist + unit) {
          return callback && callback();
        } else {
          return element.transition(_.extend(transform_properties, {
            complete: function() {
              return callback && callback();
            }
          }));
        }
      } else {
        return element.css(transform_properties);
      }
    };

    TaskItem.prototype.transformRotateX = function(dist, animated, callback) {
      this.el.css({
        transformOrigin: '50% 0'
      });
      return this.transform(this.el, 'rotateX', dist, 'deg', animated, callback);
    };

    TaskItem.prototype.transformTranslateX = function(dist, animated, callback) {
      return this.transform(this.content, 'x', dist, '', animated, callback);
    };

    TaskItem.prototype.transformCheckmarkOpacity = function(dist, animated, callback) {
      return this.transform(this.checkmark, 'opacity', dist, '', animated, callback);
    };

    TaskItem.prototype.editName = function() {
      return this.el.find('input').focus();
    };

    TaskItem.prototype.startEditingName = function() {
      this.el.find('input').val("");
      return this.editName();
    };

    TaskItem.prototype.updateName = function() {
      var name;
      name = this.name_input.val();
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
      this.touching = true;
      this.hovering = false;
      this.swiping = false;
      this.toggle_done = false;
      return delay(350, this.checkTouchStatus);
    };

    TaskItem.prototype.continueTouching = function(event) {
      var dx, updated_toggle_done;
      dx = this.touch_last.x - this.touch_start.x;
      if (!this.hovering && !app.global_scrolling && Math.abs(dx) > TaskItem.config.touch_swipe_dist_tolerance) {
        this.swiping = true;
      }
      if (this.swiping) {
        dx = dx > 0 ? dx : 0;
        dx = dx < TaskItem.config.gutter_width ? dx : TaskItem.config.gutter_width;
        this.transformTranslateX(dx);
        if (this.item.done) {
          this.transformCheckmarkOpacity(1 - (dx / TaskItem.config.gutter_width));
        } else {
          this.transformCheckmarkOpacity(dx / TaskItem.config.gutter_width);
        }
        updated_toggle_done = dx === TaskItem.config.gutter_width ? true : false;
        if (updated_toggle_done === !this.toggle_done) {
          if (this.item.done) {
            if (updated_toggle_done) {
              this.content.removeClass("done");
            } else {
              this.content.addClass("done");
            }
          } else {
            if (updated_toggle_done) {
              this.content.addClass("green");
            } else {
              this.content.removeClass("green");
            }
          }
        }
        return this.toggle_done = updated_toggle_done;
      }
    };

    TaskItem.prototype.finishTouching = function(event) {
      var dx, now;
      dx = this.touch_last.x - this.touch_start.x;
      this.touching = false;
      now = new Date();
      if (!this.hovering && !app.global_scrolling && (now - this.touch_start.time < TaskItem.config.touch_tap_time_tolerance) && (Math.abs(dx) < TaskItem.config.touch_tap_dist_tolerance)) {
        this.transformTranslateX(0);
        if (event.target === this.duration[0]) {
          this.toggleDuration();
        } else {
          this.editName();
        }
      }
      if (this.toggle_done) {
        this.item.done = !this.item.done;
        return this.item.save();
      } else {
        this.transformTranslateX(0, true);
        return this.hovering = false;
      }
    };

    TaskItem.prototype.checkTouchStatus = function() {
      var dx, dy;
      dx = this.touch_last.x - this.touch_start.x;
      dy = this.touch_last.y - this.touch_start.y;
      if (this.touching && !app.global_scrolling && Math.abs(dx) <= TaskItem.config.touch_hold_dist_tolerance) {
        this.hovering = true;
        this.transformTranslateX(0);
        return console.log("hovering task");
      }
    };

    TaskItem.prototype.toggleDuration = function() {
      return console.log("toggling duration");
    };

    return TaskItem;

  })(Spine.Controller);

  window.TaskItem = TaskItem;

}).call(this);
