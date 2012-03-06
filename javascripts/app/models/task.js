(function() {
  var Task,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Task = (function(_super) {

    __extends(Task, _super);

    function Task() {
      Task.__super__.constructor.apply(this, arguments);
    }

    Task.configure('Task', 'name', 'duration', 'done', 'order_index');

    Task.extend(Spine.Model.Local);

    Task.unfinished = function() {
      return this.select(function(task) {
        return !task.done;
      });
    };

    Task.finished = function() {
      return this.select(function(task) {
        return task.done;
      });
    };

    return Task;

  })(Spine.Model);

  window.Task = Task;

}).call(this);
