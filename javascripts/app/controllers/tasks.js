((function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}},c=Object.prototype.hasOwnProperty,d=function(a,b){function e(){this.constructor=a}for(var d in b)c.call(b,d)&&(a[d]=b[d]);return e.prototype=b.prototype,a.prototype=new e,a.__super__=b.prototype,a};a=function(a){function c(){this.moveTaskToCorrectList=b(this.moveTaskToCorrectList,this),this["delete"]=b(this["delete"],this),this.newTaskBarReleased=b(this.newTaskBarReleased,this),this.newTaskBarSwiping=b(this.newTaskBarSwiping,this),this.startCreatingNewTask=b(this.startCreatingNewTask,this),this.addAll=b(this.addAll,this),this.addTaskItemToList=b(this.addTaskItemToList,this),this.addOne=b(this.addOne,this),this.updateVisibilityOfClearTasksBar=b(this.updateVisibilityOfClearTasksBar,this),this.render=b(this.render,this),c.__super__.constructor.apply(this,arguments),Task.bind("refresh",this.render),Task.bind("create",this.addOne),c.bind("task:delete",this["delete"]),c.bind("task:toggle_done",this.moveTaskToCorrectList)}return d(c,a),c.extend(Spine.Events),c.prototype.elements={"#todo":"todo","#done":"done","#new-task":"new_task_bar","#clear-tasks":"clear_tasks_bar"},c.prototype.render=function(){var a=this;return this.todo.html(""),this.done.html(""),this.updateVisibilityOfClearTasksBar(),this.addAll(),this.new_task_bar.bind("pulldown",function(b,c){return console.log(b),b.preventDefault(),b.stopPropagation(),a.newTaskBarSwiping(c.dy)}),this.new_task_bar.bind("touchend",function(b,c){return a.newTaskBarReleased()}),this},c.prototype.updateVisibilityOfClearTasksBar=function(a){return Task.finished().length===0?a?this.clear_tasks_bar.slideUp():this.clear_tasks_bar.hide():a?this.clear_tasks_bar.slideDown():this.clear_tasks_bar.show()},c.prototype.addOne=function(a){var b,c;return c=new TaskItem({item:a}),b=a.done?this.done:this.todo,this.addTaskItemToList(c,b)},c.prototype.addTaskItemToList=function(a,b){var c;return c=a.render().el,b.append(c)},c.prototype.addAll=function(){var a,b,c,d,e;b=_.sortBy(Task.all(),function(a){return a.order_index}),e=[];for(c=0,d=b.length;c<d;c++)a=b[c],e.push(this.addOne(a));return e},c.prototype.startCreatingNewTask=function(){var a;return this.started_creating=!0,this.task=null,this.task_item=null,this.create=!1,this.task=Task.init({duration:60,name:"Pull to create task",order_index:Task.unfinished().length}),this.task_item=new TaskItem({item:this.task}),this.task_item.creating(),this.task_item.transformFlipVert(-90),this.addTaskItemToList(this.task_item,this.todo),a=this.new_task_bar.nextAll(),a.transition({y:TaskItem.config.height+"px"})},c.prototype.newTaskBarSwiping=function(a){var b,c,d;app.log("new task swiping: "+a),this.started_creating||this.startCreatingNewTask(),b=Math.asin(a/TaskItem.config.height)*360/(2*Math.PI),c=a>0?-90+b:-90,c=c<0?c:0,this.task_item.transformFlipVert(c),d=a<TaskItem.config.height?a:TaskItem.config.height,d=d>0?d:0,this.new_task_bar.css({y:d});if(c===0){if(!this.create)return this.task.name="Release to create task",this.task_item.render(),this.create=!0}else if(this.create)return this.task.name="Pull to create task",this.task_item.render(),this.create=!1},c.prototype.newTaskBarReleased=function(){var a,b=this;app.log("new task released");if(this.started_creating)return a=this.new_task_bar.nextAll(),this.create?(this.task.save({silent:!0}),this.task_item.created(),a.css({y:0}),this.new_task_bar.css({y:0}),this.task_item.startEditingName()):(a.transition({y:0}),this.new_task_bar.transition({y:0}),this.task_item.transformFlipVert(-90,!0,function(){return b.task_item.remove()})),this.started_creating=!1},c.prototype["delete"]=function(a){var b,c,d=this;return app.log("deleting task"),c=a.controller.el,b=c.nextAll().add(c.parent().nextAll()),b.transition({y:-TaskItem.config.height}),a.controller.transformFlipVert(-90,!0,function(){return a.destroy(),b.css({y:0})})},c.prototype.moveTaskToCorrectList=function(a){var b,c,d,e,f,g,h=this;return app.log("moving task to correct list"),g=a.controller.el,b=a.done?this.todo:this.done,d=a.done?this.done:this.todo,this.updateVisibilityOfClearTasksBar(!0),c=d.offset().top+d.height()-g.offset().top,c>0?f=g.nextAll().add(g.parent().nextUntil(d.next())):f=g.prevAll().add(g.parent().prevUntil(d)),c>0?e=-TaskItem.config.height:e=TaskItem.config.height,f.transition({y:e}),c>0&&(c-=TaskItem.config.height),a.controller.transformMoveVert(c,!0,function(){return f.css({y:0}),h.render()})},c}(Spine.Controller),window.Tasks=a})).call(this)