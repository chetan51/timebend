(function() {

  _.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/g,
    interpolate: /\{\{\=(.+?)\}\}/g
  };

}).call(this);
