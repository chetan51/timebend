(function() {
  var Tasks,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tasks = (function(_super) {

    __extends(Tasks, _super);

    Tasks.extend(Spine.Events);

    Tasks.prototype.elements = {
      "#todo": "todo",
      "#done": "done",
      "#new-task": "new_task",
      "#clear-tasks": "clear_tasks",
      "#after-todo": "after_todo"
    };

    Tasks.prototype.events = {
      "touchstart #new-task": "startTouchingNewTask",
      "touchmove #new-task": "continueTouchingNewTask",
      "touchend #new-task": "finishTouchingNewTask"
    };

    function Tasks() {
      this["delete"] = __bind(this["delete"], this);
      this.resetTouchingNewTask = __bind(this.resetTouchingNewTask, this);
      this.finishTouchingNewTask = __bind(this.finishTouchingNewTask, this);
      this.continueTouchingNewTask = __bind(this.continueTouchingNewTask, this);
      this.startTouchingNewTask = __bind(this.startTouchingNewTask, this);
      this.addAll = __bind(this.addAll, this);
      this.addTaskItemToList = __bind(this.addTaskItemToList, this);
      this.addOne = __bind(this.addOne, this);
      this.render = __bind(this.render, this);      Tasks.__super__.constructor.apply(this, arguments);
      Task.bind("refresh", this.render);
      Task.bind("create", this.addOne);
      Tasks.bind("task:delete", this["delete"]);
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
      var list, task_item;
      task_item = new TaskItem({
        item: item
      });
      list = item.done ? this.done : this.todo;
      return this.addTaskItemToList(task_item, list);
    };

    Tasks.prototype.addTaskItemToList = function(task_item, list) {
      var el;
      el = task_item.render().el;
      return list.append(el);
    };

    Tasks.prototype.addAll = function() {
      return Task.each(this.addOne);
    };

    Tasks.prototype.startTouchingNewTask = function(event) {
      this.resetTouchingNewTask();
      this.touch_start.x = event.originalEvent.touches[0].pageX;
      this.touch_start.y = event.originalEvent.touches[0].pageY;
      this.task = Task.init({
        duration: 1,
        name: "Pull to create task"
      });
      this.task_item = new TaskItem({
        item: this.task
      });
      this.addTaskItemToList(this.task_item, this.todo);
      this.task_item.transforming();
      this.rotate_x = -90;
      return this.task_item.updateTransform(this.rotate_x);
    };

    Tasks.prototype.continueTouchingNewTask = function(event) {
      var dy;
      event.preventDefault();
      dy = event.originalEvent.touches[0].pageY - this.touch_start.y;
      this.rotate_x = dy > 0 ? -90 + dy : -90;
      this.rotate_x = this.rotate_x < 0 ? this.rotate_x : 0;
      this.translate_y = dy < 60 ? dy : 60;
      this.translate_y = this.translate_y > 0 ? this.translate_y : 0;
      this.task_item.updateTransform(this.rotate_x);
      this.new_task.css({
        y: this.translate_y
      });
      if (this.rotate_x === 0) {
        if (!this.create) {
          this.task.name = "Release to create task";
          this.task_item.render();
          return this.create = true;
        }
      } else {
        if (this.create) {
          this.task.name = "Pull to create task";
          this.task_item.render();
          return this.create = false;
        }
      }
    };

    Tasks.prototype.finishTouchingNewTask = function(event) {
      var _this = this;
      if (this.create) {
        this.task.save({
          silent: true
        });
        this.after_todo.transition({
          y: this.translate_y + 'px',
          complete: function() {
            _this.after_todo.css({
              y: 0
            });
            _this.new_task.css({
              y: 0
            });
            _this.task_item.transformed();
            return _this.resetTouchingNewTask();
          }
        });
        return this.task_item.startEditingName();
      } else {
        this.rotate_x = -90;
        this.translate_y = 0;
        this.new_task.transition({
          y: 0
        });
        return this.task_item.updateTransform(-90, true, function() {
          return _this.resetTouchingNewTask();
        });
      }
    };

    Tasks.prototype.resetTouchingNewTask = function() {
      this.touch_start = {};
      this.task = null;
      this.task_item = null;
      this.rotate_x = 0;
      this.translate_y = 0;
      return this.create = false;
    };

    Tasks.prototype["delete"] = function(task) {
      var _this = this;
      this.after_todo.transition({
        y: -60
      });
      this.new_task.transition({
        y: -60
      });
      return task.controller.updateTransform(-90, true, function() {
        _this.after_todo.css({
          y: 0
        });
        _this.new_task.css({
          y: 0
        });
        return task.destroy();
      });
    };

    return Tasks;

  })(Spine.Controller);

  window.Tasks = Tasks;

}).call(this);
