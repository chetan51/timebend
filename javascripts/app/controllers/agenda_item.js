((function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}},c=Object.prototype.hasOwnProperty,d=function(a,b){function e(){this.constructor=a}for(var d in b)c.call(b,d)&&(a[d]=b[d]);return e.prototype=b.prototype,a.prototype=new e,a.__super__=b.prototype,a};a=function(a){function c(){this.animateReserveTime=b(this.animateReserveTime,this),this.taskToggleDone=b(this.taskToggleDone,this),this.taskDurationChanging=b(this.taskDurationChanging,this),this.showTimeDisplay=b(this.showTimeDisplay,this),this.showTimeInput=b(this.showTimeInput,this),this.saveTime=b(this.saveTime,this),this.updateDayEnd=b(this.updateDayEnd,this),this.updateDayStart=b(this.updateDayStart,this),this.statusSwipeIncomplete=b(this.statusSwipeIncomplete,this),this.statusSwipeComplete=b(this.statusSwipeComplete,this),this.statusSwipeInactive=b(this.statusSwipeInactive,this),this.statusSwipeActive=b(this.statusSwipeActive,this),this.update=b(this.update,this),this.render=b(this.render,this);var a,d,e;c.__super__.constructor.apply(this,arguments),this.item.bind("update",this.render),Task.bind("create refresh update destroy",this.render),Agenda.bind("task:duration_changing",this.taskDurationChanging),Agenda.bind("task:toggle_done",this.taskToggleDone),this.render(),this.update(),e={root:this.status,content:this.status_content,left_gutter:this.status_clockstart,right_gutter:this.status_clockend},d={gutter_width:c.config.gutter_width},a={swipeActive:this.statusSwipeActive,swipeInactive:this.statusSwipeInactive,swipeComplete:this.statusSwipeComplete,swipeIncomplete:this.statusSwipeIncomplete},this.swipeable=new Swipeable(e,d,a)}return d(c,a),c.config={gutter_width:60},c.prototype.elements={"#status":"status","#status .content":"status_content","#status .clock.start":"status_clockstart","#status .clock.end":"status_clockend","#day-start":"day_start","#day-start .display":"day_start_display","#day-start .time":"day_start_display_time","#day-start .suffix":"day_start_display_suffix","#day-start input":"day_start_input","#day-end":"day_end","#day-end input":"day_end_input","#day-end .display":"day_end_display","#day-end .time":"day_end_display_time","#day-end .suffix":"day_end_display_suffix","#reserve-left .time":"reserve_left_time","#until-day-start":"until_day_start","#until-day-start .time":"until_day_start_time"},c.prototype.events={"blur #day-start input":"updateDayStart","blur #day-end input":"updateDayEnd"},c.prototype.render=function(){return this.day_start_moment=moment().hours(this.item.day_start/60).minutes(this.item.day_start%60).seconds(0).milliseconds(0),this.day_end_moment=moment().hours(this.item.day_end/60).minutes(this.item.day_end%60).seconds(0).milliseconds(0),this.day_start.removeClass("selected"),this.day_end.removeClass("selected"),this.day_start_input.val(this.day_start_moment.format("HH:mm:ss")),this.day_end_input.val(this.day_end_moment.format("HH:mm:ss")),this.day_start_display_time.html(this.day_start_moment.format("h:mm")),this.day_start_display_suffix.html(this.day_start_moment.format("a")),this.day_end_display_time.html(this.day_end_moment.format("h:mm")),this.day_end_display_suffix.html(this.day_end_moment.format("a"))},c.prototype.update=function(){var a,b,c,d,e,f,g,h,i;if(!this.status_update_paused){a=moment(),this.day_start_moment.diff(a)>0&&(this.day_start_moment.subtract("days",1),this.day_end_moment.subtract("days",1)),this.day_end_moment.diff(this.day_start_moment)<0&&this.day_end_moment.add("days",1),a.diff(this.day_end_moment)>0?(this.day_start_moment.add("days",1),this.day_end_moment.add("days",1),this.day_started=!1):this.day_started=!0,b=0,i=Task.unfinished();for(g=0,h=i.length;g<h;g++)d=i[g],b+=d.duration;this.day_started?(e=this.day_end_moment.diff(a,"minutes"),this.until_day_start.hide()):(e=this.day_end_moment.diff(this.day_start_moment,"minutes"),f=Math.ceil(this.day_start_moment.diff(a)/6e4),this.until_day_start_time.html(formatMinutesIntoTime(f)),this.until_day_start.show()),c=e-b,this.reserve_left_time.html(formatMinutesIntoTime(c)),c>=0?this.reserve_left_time.removeClass("negative").addClass("positive"):this.reserve_left_time.removeClass("positive").addClass("negative"),this.productive_mins_left=b,this.reserve_mins_left=c}return delay(500,this.update)},c.prototype.statusSwipeActive=function(a,b){var c;return c=a==="right"?this.day_start:this.day_end,c.addClass("selected")},c.prototype.statusSwipeInactive=function(a,b){var c;return c=a==="right"?this.day_start:this.day_end,c.removeClass("selected")},c.prototype.statusSwipeComplete=function(a,b){var c,d,e;return d=a==="right"?this.day_start:this.day_end,c=a==="right"?this.day_start_display:this.day_end_display,e=a==="right"?this.day_start_input:this.day_end_input,this.showTimeInput(c,e),this.render()},c.prototype.statusSwipeIncomplete=function(a,b){var c;return c=a==="right"?this.day_start:this.day_end,this.render()},c.prototype.updateDayStart=function(){return this.saveTime(this.day_start_input,"day_start"),this.showTimeDisplay(this.day_start_display,this.day_start_input)},c.prototype.updateDayEnd=function(){return this.saveTime(this.day_end_input,"day_end"),this.showTimeDisplay(this.day_end_display,this.day_end_input)},c.prototype.saveTime=function(a,b){var c,d;return d=moment(a.val(),"HH:mm:ss"),c=parseInt(d.format("H"),10)*60+parseInt(d.format("m"),10),this.item[b]=new Number(c),this.item.save()},c.prototype.showTimeInput=function(a,b){return a.hide(),b.show(),b.focus()},c.prototype.showTimeDisplay=function(a,b){return b.hide(),a.show()},c.prototype.taskDurationChanging=function(a,b,c){var d,e,f=this;if(!a.done)return d=b-c,e=this.reserve_mins_left+d,this.animateReserveTime(this.reserve_mins_left,e,500,function(){return f.render()})},c.prototype.taskToggleDone=function(a){var b,c,d=this;return b=a.done?a.duration:-a.duration,c=this.reserve_mins_left-b,this.reserve_left_time.html(formatMinutesIntoTime(c)),this.animateReserveTime(c,this.reserve_mins_left,500,function(){return d.render()})},c.prototype.animateReserveTime=function(a,b,c,d){var e,f,g,h,i=this;return this.status_update_paused=!0,f=b-a,e=new Date,g=e,h=function(){var b,j;return j=g-e,b=a+f*j/c,i.reserve_left_time.html(formatMinutesIntoTime(b)),j>c?(i.status_update_paused=!1,d()):(g=new Date,delay(10,function(){return h()}))},h()},c}(Spine.Controller),window.AgendaItem=a})).call(this)