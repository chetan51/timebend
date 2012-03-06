(function() {
  var Tasks,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tasks = (function(_super) {

    __extends(Tasks, _super);

    Tasks.extend(Spine.Events);

    Tasks.include(Touchable);

    Tasks.prototype.elements = {
      "#todo": "todo",
      "#done": "done",
      "#new-task": "new_task",
      "#clear-tasks": "clear_tasks"
    };

    function Tasks() {
      this["delete"] = __bind(this["delete"], this);
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      this.addAll = __bind(this.addAll, this);
      this.addTaskItemToList = __bind(this.addTaskItemToList, this);
      this.addOne = __bind(this.addOne, this);
      this.render = __bind(this.render, this);      Tasks.__super__.constructor.apply(this, arguments);
      Task.bind("refresh", this.render);
      Task.bind("create", this.addOne);
      Tasks.bind("task:delete", this["delete"]);
      this.touch_el = this.new_task;
      this.watchTouch();
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

    Tasks.prototype.startTouching = function(event) {
      this.task = null;
      this.task_item = null;
      this.rotate_x = 0;
      this.translate_y = 0;
      this.create = false;
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
      this.task_item.transformRotateX(this.rotate_x);
      this.after_todo = this.new_task.nextAll();
      return this.after_todo.transition({
        y: TaskItem.config.height + 'px'
      });
    };

    Tasks.prototype.continueTouching = function(event) {
      var dy;
      event.preventDefault();
      dy = event.originalEvent.touches[0].pageY - this.touch_start.y;
      this.rotate_x = dy > 0 ? -90 + (90 * dy / TaskItem.config.height) : -90;
      this.rotate_x = this.rotate_x < 0 ? this.rotate_x : 0;
      this.translate_y = dy < TaskItem.config.height ? dy : TaskItem.config.height;
      this.translate_y = this.translate_y > 0 ? this.translate_y : 0;
      this.task_item.transformRotateX(this.rotate_x);
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

    Tasks.prototype.finishTouching = function(event) {
      var _this = this;
      if (this.create) {
        this.task.save({
          silent: true
        });
        this.task_item.transformed();
        this.after_todo.css({
          y: 0
        });
        this.new_task.css({
          y: 0
        });
        return this.task_item.startEditingName();
      } else {
        this.after_todo.transition({
          y: 0
        });
        this.new_task.transition({
          y: 0
        });
        return this.task_item.transformRotateX(-90, true, function() {
          return _this.task_item.remove();
        });
      }
    };

    Tasks.prototype["delete"] = function(task) {
      var task_el,
        _this = this;
      task_el = task.controller.el;
      this.after_todo = task_el.nextAll().add(task_el.parent().nextAll());
      this.after_todo.transition({
        y: -TaskItem.config.height
      });
      this.new_task.transition({
        y: -TaskItem.config.height
      });
      return task.controller.transformRotateX(-90, true, function() {
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
