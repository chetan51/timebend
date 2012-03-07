(function() {
  var TaskItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskItem = (function(_super) {

    __extends(TaskItem, _super);

    TaskItem.config = {
      height: 40,
      gutter_width: 40,
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
      this.animateDuration = __bind(this.animateDuration, this);
      this.updateDurationColor = __bind(this.updateDurationColor, this);
      this.durationTapped = __bind(this.durationTapped, this);
      this.taskHeld = __bind(this.taskHeld, this);
      this.taskSwipeReleased = __bind(this.taskSwipeReleased, this);
      this.taskSwiping = __bind(this.taskSwiping, this);
      this.taskTapped = __bind(this.taskTapped, this);
      this.checkTouchStatus = __bind(this.checkTouchStatus, this);
      this.normalizeSwipeDx = __bind(this.normalizeSwipeDx, this);
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      this.remove = __bind(this.remove, this);
      this.updateName = __bind(this.updateName, this);
      this.startEditingName = __bind(this.startEditingName, this);
      this.editName = __bind(this.editName, this);
      this.transformCheckmarkOpacity = __bind(this.transformCheckmarkOpacity, this);
      this.transformContentMoveHoriz = __bind(this.transformContentMoveHoriz, this);
      this.transformMoveVert = __bind(this.transformMoveVert, this);
      this.transformFlipVert = __bind(this.transformFlipVert, this);
      this.transform = __bind(this.transform, this);
      this.created = __bind(this.created, this);
      this.creating = __bind(this.creating, this);
      this.render = __bind(this.render, this);
      this.template = __bind(this.template, this);      TaskItem.__super__.constructor.apply(this, arguments);
      if (!this.item) throw "@item required";
      this.item.bind("update", this.render);
      this.item.bind("destroy", this.remove);
      this.touch_proxy = new TouchProxy(this.el, this.startTouching, this.continueTouching, this.finishTouching);
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
      this.updateDurationColor();
      return this;
    };

    TaskItem.prototype.creating = function() {
      return this.el.css({
        'height': '0',
        'z-index': '10'
      });
    };

    TaskItem.prototype.created = function() {
      return this.el.css({
        'height': TaskItem.config.height + 'px',
        'z-index': '100'
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

    TaskItem.prototype.transformFlipVert = function(dist, animated, callback) {
      this.el.css({
        transformOrigin: '50% 0'
      });
      return this.transform(this.el, 'rotateX', dist, 'deg', animated, callback);
    };

    TaskItem.prototype.transformMoveVert = function(dist, animated, callback) {
      return this.transform(this.el, 'y', dist, '', animated, callback);
    };

    TaskItem.prototype.transformContentMoveHoriz = function(dist, animated, callback) {
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

    TaskItem.prototype.startTouching = function(event, data) {
      this.touch_data = data;
      this.gesture = null;
      return delay(350, this.checkTouchStatus);
    };

    TaskItem.prototype.continueTouching = function(event, data) {
      var dx;
      this.touch_data = data;
      dx = data.last.x - data.start.x;
      if (!app.global_scrolling && !this.gesture && (Math.abs(dx) > TaskItem.config.touch_swipe_dist_tolerance)) {
        this.gesture = "swiping";
      }
      if (this.gesture === "swiping") {
        dx = this.normalizeSwipeDx(dx);
        return this.taskSwiping(dx);
      }
    };

    TaskItem.prototype.finishTouching = function(event, data) {
      var dx, now;
      this.touch_data = data;
      dx = data.last.x - data.start.x;
      now = new Date();
      if (!app.global_scrolling && !this.gesture && (now - data.start.time < TaskItem.config.touch_tap_time_tolerance) && (Math.abs(dx) < TaskItem.config.touch_tap_dist_tolerance)) {
        this.gesture = "tapped";
        if (event.target === this.duration[0]) {
          return this.durationTapped();
        } else {
          return this.taskTapped();
        }
      } else if (this.gesture === "swiping") {
        dx = this.normalizeSwipeDx(dx);
        return this.taskSwipeReleased(dx);
      }
    };

    TaskItem.prototype.normalizeSwipeDx = function(dx) {
      var tolerance;
      tolerance = TaskItem.config.touch_swipe_dist_tolerance;
      if (dx > tolerance) {
        dx -= tolerance;
      } else if (dx < -tolerance) {
        dx += tolerance;
      } else {
        dx = 0;
      }
      return dx;
    };

    TaskItem.prototype.checkTouchStatus = function() {
      var dx;
      dx = this.touch_data.last.x - this.touch_data.start.x;
      if (!app.global_scrolling && !this.gesture && (Math.abs(dx) <= TaskItem.config.touch_hold_dist_tolerance)) {
        this.gesture = "hold";
        return this.taskHeld();
      }
    };

    TaskItem.prototype.taskTapped = function() {
      app.log("task tapped");
      return this.editName();
    };

    TaskItem.prototype.taskSwiping = function(dx) {
      var extra_dx, gutter_width, updated_toggle_done;
      app.log("task swiping: " + dx);
      gutter_width = TaskItem.config.gutter_width;
      dx = dx > 0 ? dx : 0;
      if (dx > gutter_width) {
        extra_dx = dx - gutter_width;
        dx = gutter_width + (extra_dx / ((extra_dx / 50) + 1));
      }
      this.transformContentMoveHoriz(dx);
      if (dx > 0) {
        this.toggle_done = typeof this.toggle_done === "undefined" ? false : this.toggle_done;
        if (this.item.done) {
          this.transformCheckmarkOpacity(1 - (dx / gutter_width));
        } else {
          this.transformCheckmarkOpacity(dx / gutter_width);
        }
        updated_toggle_done = dx >= gutter_width ? true : false;
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

    TaskItem.prototype.taskSwipeReleased = function(dx) {
      var last_task, tasks,
        _this = this;
      app.log("task swipe released: " + dx);
      if (this.toggle_done) {
        this.item.done = !this.item.done;
        tasks = this.item.done ? Task.finished() : Task.unfinished();
        last_task = tasks[tasks.length - 1];
        this.item.order_index = last_task ? last_task.order_index + 1 : 0;
        if (this.item.done) this.content.removeClass("green").addClass("done");
        return this.transformContentMoveHoriz(0, true, function() {
          _this.item.save();
          return Tasks.trigger('task:toggle_done', _this.item);
        });
      } else {
        return this.transformContentMoveHoriz(0, true);
      }
    };

    TaskItem.prototype.taskHeld = function() {
      return app.log("task held");
    };

    TaskItem.prototype.durationTapped = function() {
      var new_duration,
        _this = this;
      app.log("duration tapped");
      new_duration = 60;
      if (this.item.duration > 30) {
        new_duration = 30;
      } else if (this.item.duration > 15) {
        new_duration = 15;
      }
      return this.animateDuration(this.item.duration, new_duration, 500, function() {
        _this.item.duration = new_duration;
        return _this.item.save();
      });
    };

    TaskItem.prototype.updateDurationColor = function(duration_minutes) {
      var background_opacity;
      duration_minutes = duration_minutes ? duration_minutes : this.item.duration;
      background_opacity = duration_minutes / 60;
      return this.duration.css('background-color', "rgba(203,222,228, " + background_opacity + ")");
    };

    TaskItem.prototype.animateDuration = function(from_minutes, to_minutes, animation_length, callback) {
      var animation_start_time, delta_minutes, last_update_time, update,
        _this = this;
      delta_minutes = to_minutes - from_minutes;
      animation_start_time = new Date();
      last_update_time = animation_start_time;
      update = function() {
        var current_minutes, time_elapsed;
        time_elapsed = last_update_time - animation_start_time;
        current_minutes = from_minutes + (delta_minutes * time_elapsed / animation_length);
        _this.duration.html(formatMinutes(current_minutes));
        _this.updateDurationColor(current_minutes);
        if (time_elapsed > animation_length) {
          return callback();
        } else {
          last_update_time = new Date();
          return delay(10, function() {
            return update();
          });
        }
      };
      return update();
    };

    return TaskItem;

  })(Spine.Controller);

  window.TaskItem = TaskItem;

}).call(this);
