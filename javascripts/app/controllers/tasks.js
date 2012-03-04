(function() {
  var Tasks,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tasks = (function(_super) {

    __extends(Tasks, _super);

    Tasks.prototype.elements = {
      "#todo": "todo",
      "#done": "done",
      "#new-task": "new_task",
      "#clear-tasks": "clear_tasks"
    };

    Tasks.prototype.events = {
      "tap .task input": "editTaskName",
      "focusout .task input": "updateTaskName"
    };

    function Tasks() {
      this.watchForNewTaskGesture = __bind(this.watchForNewTaskGesture, this);
      this.updateTaskName = __bind(this.updateTaskName, this);
      this.editTaskName = __bind(this.editTaskName, this);
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      this.render = __bind(this.render, this);      Tasks.__super__.constructor.apply(this, arguments);
      Task.bind("refresh", this.render);
      Task.bind("create", this.addOne);
      this.watchForNewTaskGesture();
    }

    Tasks.prototype.render = function() {
      this.todo.html("");
      this.done.html("");
      if (Task.finished().length === 0) {
        this.clear_tasks.hide();
      } else {
        this.clear_tasks.show();
      }
      return this.addAll();
    };

    Tasks.prototype.addOne = function(item) {
      var el, list, task_item;
      task_item = new TaskItem({
        item: item
      });
      list = item.done ? this.done : this.todo;
      el = task_item.render().el;
      return list.append(el);
    };

    Tasks.prototype.addAll = function() {
      return Task.each(this.addOne);
    };

    Tasks.prototype.editTaskName = function(event) {
      return event.target.focus();
    };

    Tasks.prototype.updateTaskName = function(event) {
      var task, task_id;
      task_id = $(event.target).closest(".task").data('id');
      task = Task.find(task_id);
      task.name = $(event.target).val();
      return task.save();
    };

    Tasks.prototype.watchForNewTaskGesture = function() {
      var reset,
        _this = this;
      reset = function() {
        _this.touch_start = {};
        _this.task = null;
        _this.rotate_x = 0;
        _this.height = 0;
        return _this.create = false;
      };
      reset();
      this.new_task.bind('touchstart', function(event) {
        _this.touch_start.x = event.touches[0].pageX;
        _this.touch_start.y = event.touches[0].pageY;
        _this.task = Task.create({
          duration: 1,
          name: "Pull to create task"
        });
        _this.rotate_x = -90;
        return _this.task.controller.updateTransform(_this.rotate_x, _this.height);
      });
      this.new_task.bind('touchmove', function(event) {
        var dy;
        event.preventDefault();
        dy = event.touches[0].pageY - _this.touch_start.y;
        _this.rotate_x = dy > 0 ? -90 + dy : -90;
        _this.rotate_x = _this.rotate_x < 0 ? _this.rotate_x : 0;
        _this.height = dy < 60 ? dy : 60;
        _this.task.controller.updateTransform(_this.rotate_x, _this.height);
        if (_this.rotate_x === 0) {
          if (!_this.create) {
            _this.task.name = "Release to create task";
            _this.create = true;
            return _this.task.save();
          }
        } else {
          if (_this.create) {
            _this.task.name = "Pull to create task";
            _this.create = false;
            return _this.task.save();
          }
        }
      });
      return this.new_task.bind('touchend', function(event) {
        if (_this.create) {
          _this.task.controller.editName();
          return reset();
        } else {
          _this.rotate_x = -90;
          _this.height = 0;
          return _this.task.controller.updateTransform(_this.rotate_x, _this.height, true, function() {
            _this.task.destroy();
            return reset();
          });
        }
      });
    };

    return Tasks;

  })(Spine.Controller);

  window.Tasks = Tasks;

}).call(this);
