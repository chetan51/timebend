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
      "#new-task": "new_task_bar",
      "#clear-tasks": "clear_tasks_bar"
    };

    function Tasks() {
      this.moveTaskToCorrectList = __bind(this.moveTaskToCorrectList, this);
      this["delete"] = __bind(this["delete"], this);
      this.newTaskBarSwipeReleased = __bind(this.newTaskBarSwipeReleased, this);
      this.newTaskBarSwiping = __bind(this.newTaskBarSwiping, this);
      this.newTaskBarTouched = __bind(this.newTaskBarTouched, this);
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      this.addAll = __bind(this.addAll, this);
      this.addTaskItemToList = __bind(this.addTaskItemToList, this);
      this.addOne = __bind(this.addOne, this);
      this.updateVisibilityOfClearTasksBar = __bind(this.updateVisibilityOfClearTasksBar, this);
      this.render = __bind(this.render, this);      Tasks.__super__.constructor.apply(this, arguments);
      Task.bind("refresh", this.render);
      Task.bind("create", this.addOne);
      Tasks.bind("task:delete", this["delete"]);
      Tasks.bind("task:toggle_done", this.moveTaskToCorrectList);
      this.touch_proxy = new TouchProxy(this.new_task_bar, this.startTouching, this.continueTouching, this.finishTouching);
    }

    Tasks.prototype.render = function() {
      this.todo.html("");
      this.done.html("");
      this.updateVisibilityOfClearTasksBar();
      return this.addAll();
    };

    Tasks.prototype.updateVisibilityOfClearTasksBar = function(animated) {
      if (Task.finished().length === 0) {
        if (animated) {
          return this.clear_tasks_bar.slideUp();
        } else {
          return this.clear_tasks_bar.hide();
        }
      } else {
        if (animated) {
          return this.clear_tasks_bar.slideDown();
        } else {
          return this.clear_tasks_bar.show();
        }
      }
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
      var task, tasks, _i, _len, _results;
      tasks = _.sortBy(Task.all(), function(task) {
        return task.order_index;
      });
      _results = [];
      for (_i = 0, _len = tasks.length; _i < _len; _i++) {
        task = tasks[_i];
        _results.push(this.addOne(task));
      }
      return _results;
    };

    Tasks.prototype.startTouching = function(event, data) {
      return this.newTaskBarTouched();
    };

    Tasks.prototype.continueTouching = function(event, data) {
      var dy;
      event.preventDefault();
      dy = data.last.y - data.start.y;
      return this.newTaskBarSwiping(dy);
    };

    Tasks.prototype.finishTouching = function(event, data) {
      var dy;
      dy = data.last.y - data.start.y;
      return this.newTaskBarSwipeReleased(dy);
    };

    Tasks.prototype.newTaskBarTouched = function() {
      var after_task;
      app.log("new task touched");
      this.task = null;
      this.task_item = null;
      this.create = false;
      this.task = Task.init({
        duration: 1,
        name: "Pull to create task",
        order_index: Task.unfinished().length
      });
      this.task_item = new TaskItem({
        item: this.task
      });
      this.task_item.creating();
      this.task_item.transformFlipVert(-90);
      this.addTaskItemToList(this.task_item, this.todo);
      after_task = this.new_task_bar.nextAll();
      return after_task.transition({
        y: TaskItem.config.height + 'px'
      });
    };

    Tasks.prototype.newTaskBarSwiping = function(dy) {
      var rotate_x, translate_y;
      app.log("new task swiping: " + dy);
      rotate_x = dy > 0 ? -90 + (90 * dy / TaskItem.config.height) : -90;
      rotate_x = rotate_x < 0 ? rotate_x : 0;
      this.task_item.transformFlipVert(rotate_x);
      translate_y = dy < TaskItem.config.height ? dy : TaskItem.config.height;
      translate_y = translate_y > 0 ? translate_y : 0;
      this.new_task_bar.css({
        y: translate_y
      });
      if (rotate_x === 0) {
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

    Tasks.prototype.newTaskBarSwipeReleased = function(dy) {
      var after_task,
        _this = this;
      app.log("new task swipe released: " + dy);
      after_task = this.new_task_bar.nextAll();
      if (this.create) {
        this.task.save({
          silent: true
        });
        this.task_item.created();
        after_task.css({
          y: 0
        });
        this.new_task_bar.css({
          y: 0
        });
        return this.task_item.startEditingName();
      } else {
        after_task.transition({
          y: 0
        });
        this.new_task_bar.transition({
          y: 0
        });
        return this.task_item.transformFlipVert(-90, true, function() {
          return _this.task_item.remove();
        });
      }
    };

    Tasks.prototype["delete"] = function(task) {
      var after_task, task_el,
        _this = this;
      app.log("deleting task");
      task_el = task.controller.el;
      after_task = task_el.nextAll().add(task_el.parent().nextAll());
      after_task.transition({
        y: -TaskItem.config.height
      });
      return task.controller.transformFlipVert(-90, true, function() {
        task.destroy();
        return after_task.css({
          y: 0
        });
      });
    };

    Tasks.prototype.moveTaskToCorrectList = function(task) {
      var current_list, dy, new_list, other_dy, swap_with_item, task_el,
        _this = this;
      app.log("moving task to correct list");
      task_el = task.controller.el;
      current_list = task.done ? this.todo : this.done;
      new_list = task.done ? this.done : this.todo;
      this.updateVisibilityOfClearTasksBar(true);
      dy = new_list.offset().top + new_list.height() - task_el.offset().top;
      if (dy > 0) {
        swap_with_item = task_el.nextAll().add(task_el.parent().nextUntil(new_list.next()));
      } else {
        swap_with_item = task_el.prevAll().add(task_el.parent().prevUntil(new_list));
      }
      if (dy > 0) {
        other_dy = -TaskItem.config.height;
      } else {
        other_dy = TaskItem.config.height;
      }
      swap_with_item.transition({
        y: other_dy
      });
      if (dy > 0) dy -= TaskItem.config.height;
      return task.controller.transformMoveVert(dy, true, function() {
        swap_with_item.css({
          y: 0
        });
        return _this.render();
      });
    };

    return Tasks;

  })(Spine.Controller);

  window.Tasks = Tasks;

}).call(this);
