((function(){var a,b=Object.prototype.hasOwnProperty,c=function(a,c){function e(){this.constructor=a}for(var d in c)b.call(c,d)&&(a[d]=c[d]);return e.prototype=c.prototype,a.prototype=new e,a.__super__=c.prototype,a};a=function(a){function b(){b.__super__.constructor.apply(this,arguments)}return c(b,a),b.configure("Agenda","day_start","day_end","last_checkpoint","reserve_ms_at_last_checkpoint","reserve_ms_last_checkpoint_change"),b.extend(Spine.Model.Local),b.prototype.validate=function(){this.day_start||"Day start time is required";if(!this.day_end)return"Day end time is required"},b}(Spine.Model),window.Agenda=a})).call(this)