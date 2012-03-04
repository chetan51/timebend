(function() {
  var Agenda,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Agenda = (function(_super) {

    __extends(Agenda, _super);

    function Agenda() {
      Agenda.__super__.constructor.apply(this, arguments);
    }

    Agenda.configure('Agenda', 'day_start', 'day_end', 'last_checkpoint', 'reserve_ms_at_last_checkpoint', 'reserve_ms_last_checkpoint_change');

    Agenda.extend(Spine.Model.Local);

    Agenda.prototype.validate = function() {
      if (!this.day_start) "Day start time is required";
      if (!this.day_end) return "Day end time is required";
    };

    return Agenda;

  })(Spine.Model);

  window.Agenda = Agenda;

}).call(this);
