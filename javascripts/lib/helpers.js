(function() {

  window.delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  window.truncate = function(value) {
    if (value < 0) {
      return Math.ceil(value);
    } else {
      return Math.floor(value);
    }
  };

  window.pad = function(n, len) {
    var s;
    s = n.toString();
    if (s.length < len) s = ('0000000000' + s).slice(-len);
    return s;
  };

  window.parseTimeString = function(time_string) {
    var d, time, _ref;
    d = new Date();
    time = time_string.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours(parseInt(time[1], 10) + ((_ref = time[3]) != null ? _ref : {
      12: 0
    }));
    d.setMinutes(parseInt(time[2], 10) || 0);
    return d;
  };

  window.formatMilliseconds = function(milliseconds, show_hours, show_minutes, show_seconds) {
    var hours_text, minutes_text, seconds_text, text;
    hours_text = Math.abs(truncate(milliseconds / (1000 * 60 * 60)));
    if (milliseconds < 0) hours_text = "-" + hours_text;
    minutes_text = pad(Math.floor(Math.abs(milliseconds / (1000 * 60) % 60)), 2);
    seconds_text = pad(Math.floor(Math.abs(milliseconds / 1000) % 60), 2);
    text = "";
    if (show_hours) text += hours_text;
    if (show_hours && show_minutes) text += ":";
    if (show_minutes) text += minutes_text;
    if (show_minutes && show_seconds) text += ":";
    if (show_seconds) text += seconds_text;
    return text;
  };

  window.formatMinutes = function(minutes) {
    var decimal_places, hours;
    hours = minutes / 60;
    if (hours >= 1) {
      decimal_places = hours % 1 ? 1 : 0;
      return hours.toFixed(decimal_places) + "h";
    } else {
      return minutes.toFixed(0) + "m";
    }
  };

  window.simplifyTimeString = function(time_string) {
    return time_string.replace(":00", "");
  };

}).call(this);
