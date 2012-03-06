(function() {

  _.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/g,
    interpolate: /\{\{\=(.+?)\}\}/g
  };

}).call(this);
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

  window.simplifyTimeString = function(time_string) {
    return time_string.replace(":00", "");
  };

}).call(this);
(function() {
  var $, Controller, Events, Log, Model, Module, Spine, isArray, isBlank, makeArray, moduleKeywords,
    __slice = Array.prototype.slice,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Events = {
    bind: function(ev, callback) {
      var calls, evs, name, _i, _len;
      evs = ev.split(' ');
      calls = this.hasOwnProperty('_callbacks') && this._callbacks || (this._callbacks = {});
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        calls[name] || (calls[name] = []);
        calls[name].push(callback);
      }
      return this;
    },
    one: function(ev, callback) {
      return this.bind(ev, function() {
        this.unbind(ev, arguments.callee);
        return callback.apply(this, arguments);
      });
    },
    trigger: function() {
      var args, callback, ev, list, options, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ev = args.shift();
      options = args[args.length - 1];
      if (typeof options === 'object' && options.silent) return;
      list = this.hasOwnProperty('_callbacks') && ((_ref = this._callbacks) != null ? _ref[ev] : void 0);
      if (!list) return;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        callback = list[_i];
        if (callback.apply(this, args) === false) break;
      }
      return true;
    },
    unbind: function(ev, callback) {
      var cb, i, list, _len, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) return this;
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = 0, _len = list.length; i < _len; i++) {
        cb = list[i];
        if (!(cb === callback)) continue;
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    }
  };

  Log = {
    trace: true,
    logPrefix: '(App)',
    log: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!this.trace) return;
      if (this.logPrefix) args.unshift(this.logPrefix);
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.log === "function") console.log.apply(console, args);
      }
      return this;
    }
  };

  moduleKeywords = ['included', 'extended'];

  Module = (function() {

    Module.include = function(obj) {
      var key, value, _ref;
      if (!obj) throw 'include(obj) requires obj';
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this.prototype[key] = value;
      }
      if ((_ref = obj.included) != null) _ref.apply(this);
      return this;
    };

    Module.extend = function(obj) {
      var key, value, _ref;
      if (!obj) throw 'extend(obj) requires obj';
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this[key] = value;
      }
      if ((_ref = obj.extended) != null) _ref.apply(this);
      return this;
    };

    Module.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };

    Module.prototype.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };

    function Module() {
      if (typeof this.init === "function") this.init.apply(this, arguments);
    }

    return Module;

  })();

  Model = (function(_super) {

    __extends(Model, _super);

    Model.extend(Events);

    Model.records = {};

    Model.crecords = {};

    Model.attributes = [];

    Model.configure = function() {
      var attributes, name;
      name = arguments[0], attributes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.className = name;
      this.records = {};
      this.crecords = {};
      if (attributes.length) this.attributes = attributes;
      this.attributes && (this.attributes = makeArray(this.attributes));
      this.attributes || (this.attributes = []);
      this.unbind();
      return this;
    };

    Model.toString = function() {
      return "" + this.className + "(" + (this.attributes.join(", ")) + ")";
    };

    Model.find = function(id) {
      var record;
      record = this.records[id];
      if (!record && ("" + id).match(/c-\d+/)) return this.findCID(id);
      if (!record) throw 'Unknown record';
      return record.clone();
    };

    Model.findCID = function(cid) {
      var record;
      record = this.crecords[cid];
      if (!record) throw 'Unknown record';
      return record.clone();
    };

    Model.exists = function(id) {
      try {
        return this.find(id);
      } catch (e) {
        return false;
      }
    };

    Model.refresh = function(values, options) {
      var record, records, _i, _len;
      if (options == null) options = {};
      if (options.clear) {
        this.records = {};
        this.crecords = {};
      }
      records = this.fromJSON(values);
      if (!isArray(records)) records = [records];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        record.id || (record.id = record.cid);
        this.records[record.id] = record;
        this.crecords[record.cid] = record;
      }
      this.trigger('refresh', !options.clear && this.cloneArray(records));
      return this;
    };

    Model.select = function(callback) {
      var id, record, result;
      result = (function() {
        var _ref, _results;
        _ref = this.records;
        _results = [];
        for (id in _ref) {
          record = _ref[id];
          if (callback(record)) _results.push(record);
        }
        return _results;
      }).call(this);
      return this.cloneArray(result);
    };

    Model.findByAttribute = function(name, value) {
      var id, record, _ref;
      _ref = this.records;
      for (id in _ref) {
        record = _ref[id];
        if (record[name] === value) return record.clone();
      }
      return null;
    };

    Model.findAllByAttribute = function(name, value) {
      return this.select(function(item) {
        return item[name] === value;
      });
    };

    Model.each = function(callback) {
      var key, value, _ref, _results;
      _ref = this.records;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(callback(value.clone()));
      }
      return _results;
    };

    Model.all = function() {
      return this.cloneArray(this.recordsValues());
    };

    Model.first = function() {
      var record;
      record = this.recordsValues()[0];
      return record != null ? record.clone() : void 0;
    };

    Model.last = function() {
      var record, values;
      values = this.recordsValues();
      record = values[values.length - 1];
      return record != null ? record.clone() : void 0;
    };

    Model.count = function() {
      return this.recordsValues().length;
    };

    Model.deleteAll = function() {
      var key, value, _ref, _results;
      _ref = this.records;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(delete this.records[key]);
      }
      return _results;
    };

    Model.destroyAll = function() {
      var key, value, _ref, _results;
      _ref = this.records;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this.records[key].destroy());
      }
      return _results;
    };

    Model.update = function(id, atts, options) {
      return this.find(id).updateAttributes(atts, options);
    };

    Model.create = function(atts, options) {
      var record;
      record = new this(atts);
      return record.save(options);
    };

    Model.destroy = function(id, options) {
      return this.find(id).destroy(options);
    };

    Model.change = function(callbackOrParams) {
      if (typeof callbackOrParams === 'function') {
        return this.bind('change', callbackOrParams);
      } else {
        return this.trigger('change', callbackOrParams);
      }
    };

    Model.fetch = function(callbackOrParams) {
      if (typeof callbackOrParams === 'function') {
        return this.bind('fetch', callbackOrParams);
      } else {
        return this.trigger('fetch', callbackOrParams);
      }
    };

    Model.toJSON = function() {
      return this.recordsValues();
    };

    Model.fromJSON = function(objects) {
      var value, _i, _len, _results;
      if (!objects) return;
      if (typeof objects === 'string') objects = JSON.parse(objects);
      if (isArray(objects)) {
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          value = objects[_i];
          _results.push(new this(value));
        }
        return _results;
      } else {
        return new this(objects);
      }
    };

    Model.fromForm = function() {
      var _ref;
      return (_ref = new this).fromForm.apply(_ref, arguments);
    };

    Model.recordsValues = function() {
      var key, result, value, _ref;
      result = [];
      _ref = this.records;
      for (key in _ref) {
        value = _ref[key];
        result.push(value);
      }
      return result;
    };

    Model.cloneArray = function(array) {
      var value, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        _results.push(value.clone());
      }
      return _results;
    };

    Model.idCounter = 0;

    Model.uid = function() {
      return this.idCounter++;
    };

    function Model(atts) {
      Model.__super__.constructor.apply(this, arguments);
      if (atts) this.load(atts);
      this.cid || (this.cid = 'c-' + this.constructor.uid());
    }

    Model.prototype.isNew = function() {
      return !this.exists();
    };

    Model.prototype.isValid = function() {
      return !this.validate();
    };

    Model.prototype.validate = function() {};

    Model.prototype.load = function(atts) {
      var key, value;
      for (key in atts) {
        value = atts[key];
        if (typeof this[key] === 'function') {
          this[key](value);
        } else {
          this[key] = value;
        }
      }
      return this;
    };

    Model.prototype.attributes = function() {
      var key, result, _i, _len, _ref;
      result = {};
      _ref = this.constructor.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key in this) {
          if (typeof this[key] === 'function') {
            result[key] = this[key]();
          } else {
            result[key] = this[key];
          }
        }
      }
      if (this.id) result.id = this.id;
      return result;
    };

    Model.prototype.eql = function(rec) {
      return !!(rec && rec.constructor === this.constructor && (rec.id === this.id || rec.cid === this.cid));
    };

    Model.prototype.save = function(options) {
      var error, record;
      if (options == null) options = {};
      if (options.validate !== false) {
        error = this.validate();
        if (error) {
          this.trigger('error', error);
          return false;
        }
      }
      this.trigger('beforeSave', options);
      record = this.isNew() ? this.create(options) : this.update(options);
      this.trigger('save', options);
      return record;
    };

    Model.prototype.updateAttribute = function(name, value) {
      this[name] = value;
      return this.save();
    };

    Model.prototype.updateAttributes = function(atts, options) {
      this.load(atts);
      return this.save(options);
    };

    Model.prototype.changeID = function(id) {
      var records;
      records = this.constructor.records;
      records[id] = records[this.id];
      delete records[this.id];
      this.id = id;
      return this.save();
    };

    Model.prototype.destroy = function(options) {
      if (options == null) options = {};
      this.trigger('beforeDestroy', options);
      delete this.constructor.records[this.id];
      delete this.constructor.crecords[this.cid];
      this.destroyed = true;
      this.trigger('destroy', options);
      this.trigger('change', 'destroy', options);
      this.unbind();
      return this;
    };

    Model.prototype.dup = function(newRecord) {
      var result;
      result = new this.constructor(this.attributes());
      if (newRecord === false) {
        result.cid = this.cid;
      } else {
        delete result.id;
      }
      return result;
    };

    Model.prototype.clone = function() {
      return Object.create(this);
    };

    Model.prototype.reload = function() {
      var original;
      if (this.isNew()) return this;
      original = this.constructor.find(this.id);
      this.load(original.attributes());
      return original;
    };

    Model.prototype.toJSON = function() {
      return this.attributes();
    };

    Model.prototype.toString = function() {
      return "<" + this.constructor.className + " (" + (JSON.stringify(this)) + ")>";
    };

    Model.prototype.fromForm = function(form) {
      var key, result, _i, _len, _ref;
      result = {};
      _ref = $(form).serializeArray();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        result[key.name] = key.value;
      }
      return this.load(result);
    };

    Model.prototype.exists = function() {
      return this.id && this.id in this.constructor.records;
    };

    Model.prototype.update = function(options) {
      var clone, records;
      this.trigger('beforeUpdate', options);
      records = this.constructor.records;
      records[this.id].load(this.attributes());
      clone = records[this.id].clone();
      clone.trigger('update', options);
      clone.trigger('change', 'update', options);
      return clone;
    };

    Model.prototype.create = function(options) {
      var clone, record;
      this.trigger('beforeCreate', options);
      if (!this.id) this.id = this.cid;
      record = this.dup(false);
      this.constructor.records[this.id] = record;
      this.constructor.crecords[this.cid] = record;
      clone = record.clone();
      clone.trigger('create', options);
      clone.trigger('change', 'create', options);
      return clone;
    };

    Model.prototype.bind = function(events, callback) {
      var binder, unbinder,
        _this = this;
      this.constructor.bind(events, binder = function(record) {
        if (record && _this.eql(record)) return callback.apply(_this, arguments);
      });
      this.constructor.bind('unbind', unbinder = function(record) {
        if (record && _this.eql(record)) {
          _this.constructor.unbind(events, binder);
          return _this.constructor.unbind('unbind', unbinder);
        }
      });
      return binder;
    };

    Model.prototype.one = function(events, callback) {
      var binder,
        _this = this;
      return binder = this.bind(events, function() {
        _this.constructor.unbind(events, binder);
        return callback.apply(_this);
      });
    };

    Model.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.splice(1, 0, this);
      return (_ref = this.constructor).trigger.apply(_ref, args);
    };

    Model.prototype.unbind = function() {
      return this.trigger('unbind');
    };

    return Model;

  })(Module);

  Controller = (function(_super) {

    __extends(Controller, _super);

    Controller.include(Events);

    Controller.include(Log);

    Controller.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

    Controller.prototype.tag = 'div';

    function Controller(options) {
      this.release = __bind(this.release, this);
      var key, value, _ref;
      this.options = options;
      _ref = this.options;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      if (!this.el) this.el = document.createElement(this.tag);
      this.el = $(this.el);
      if (this.className) this.el.addClass(this.className);
      if (this.attributes) this.el.attr(this.attributes);
      this.release(function() {
        return this.el.remove();
      });
      if (!this.events) this.events = this.constructor.events;
      if (!this.elements) this.elements = this.constructor.elements;
      if (this.events) this.delegateEvents();
      if (this.elements) this.refreshElements();
      Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.release = function(callback) {
      if (typeof callback === 'function') {
        return this.bind('release', callback);
      } else {
        return this.trigger('release');
      }
    };

    Controller.prototype.$ = function(selector) {
      return $(selector, this.el);
    };

    Controller.prototype.delegateEvents = function() {
      var eventName, key, match, method, selector, _ref, _results;
      _ref = this.events;
      _results = [];
      for (key in _ref) {
        method = _ref[key];
        if (typeof method !== 'function') method = this.proxy(this[method]);
        match = key.match(this.eventSplitter);
        eventName = match[1];
        selector = match[2];
        if (selector === '') {
          _results.push(this.el.bind(eventName, method));
        } else {
          _results.push(this.el.delegate(selector, eventName, method));
        }
      }
      return _results;
    };

    Controller.prototype.refreshElements = function() {
      var key, value, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this[value] = this.$(key));
      }
      return _results;
    };

    Controller.prototype.delay = function(func, timeout) {
      return setTimeout(this.proxy(func), timeout || 0);
    };

    Controller.prototype.html = function(element) {
      this.el.html(element.el || element);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.append = function() {
      var e, elements, _ref;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      elements = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          e = elements[_i];
          _results.push(e.el || e);
        }
        return _results;
      })();
      (_ref = this.el).append.apply(_ref, elements);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.appendTo = function(element) {
      this.el.appendTo(element.el || element);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.prepend = function() {
      var e, elements, _ref;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      elements = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          e = elements[_i];
          _results.push(e.el || e);
        }
        return _results;
      })();
      (_ref = this.el).prepend.apply(_ref, elements);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.replace = function(element) {
      var previous, _ref;
      _ref = [this.el, $(element.el || element)], previous = _ref[0], this.el = _ref[1];
      previous.replaceWith(this.el);
      this.delegateEvents();
      this.refreshElements();
      return this.el;
    };

    return Controller;

  })(Module);

  $ = (typeof window !== "undefined" && window !== null ? window.jQuery : void 0) || (typeof window !== "undefined" && window !== null ? window.Zepto : void 0) || function(element) {
    return element;
  };

  if (typeof Object.create !== 'function') {
    Object.create = function(o) {
      var Func;
      Func = function() {};
      Func.prototype = o;
      return new Func();
    };
  }

  isArray = function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  isBlank = function(value) {
    var key;
    if (!value) return true;
    for (key in value) {
      return false;
    }
    return true;
  };

  makeArray = function(args) {
    return Array.prototype.slice.call(args, 0);
  };

  Spine = this.Spine = {};

  if (typeof module !== "undefined" && module !== null) module.exports = Spine;

  Spine.version = '1.0.5';

  Spine.isArray = isArray;

  Spine.isBlank = isBlank;

  Spine.$ = $;

  Spine.Events = Events;

  Spine.Log = Log;

  Spine.Module = Module;

  Spine.Controller = Controller;

  Spine.Model = Model;

  Module.extend.call(Spine, Events);

  Module.create = Module.sub = Controller.create = Controller.sub = Model.sub = function(instances, statics) {
    var result;
    result = (function(_super) {

      __extends(result, _super);

      function result() {
        result.__super__.constructor.apply(this, arguments);
      }

      return result;

    })(this);
    if (instances) result.include(instances);
    if (statics) result.extend(statics);
    if (typeof result.unbind === "function") result.unbind();
    return result;
  };

  Model.setup = function(name, attributes) {
    var Instance;
    if (attributes == null) attributes = [];
    Instance = (function(_super) {

      __extends(Instance, _super);

      function Instance() {
        Instance.__super__.constructor.apply(this, arguments);
      }

      return Instance;

    })(this);
    Instance.configure.apply(Instance, [name].concat(__slice.call(attributes)));
    return Instance;
  };

  Module.init = Controller.init = Model.init = function(a1, a2, a3, a4, a5) {
    return new this(a1, a2, a3, a4, a5);
  };

  Spine.Class = Module;

}).call(this);
(function() {
  var $, Ajax, Base, Collection, Extend, Include, Model, Singleton,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

  $ = Spine.$;

  Model = Spine.Model;

  Ajax = {
    getURL: function(object) {
      return object && (typeof object.url === "function" ? object.url() : void 0) || object.url;
    },
    enabled: true,
    pending: false,
    requests: [],
    disable: function(callback) {
      if (this.enabled) {
        this.enabled = false;
        callback();
        return this.enabled = true;
      } else {
        return callback();
      }
    },
    requestNext: function() {
      var next;
      next = this.requests.shift();
      if (next) {
        return this.request(next);
      } else {
        return this.pending = false;
      }
    },
    request: function(callback) {
      var _this = this;
      return (callback()).complete(function() {
        return _this.requestNext();
      });
    },
    queue: function(callback) {
      if (!this.enabled) return;
      if (this.pending) {
        this.requests.push(callback);
      } else {
        this.pending = true;
        this.request(callback);
      }
      return callback;
    }
  };

  Base = (function() {

    function Base() {}

    Base.prototype.defaults = {
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    Base.prototype.ajax = function(params, defaults) {
      return $.ajax($.extend({}, this.defaults, defaults, params));
    };

    Base.prototype.queue = function(callback) {
      return Ajax.queue(callback);
    };

    return Base;

  })();

  Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection(model) {
      this.model = model;
      this.errorResponse = __bind(this.errorResponse, this);
      this.recordsResponse = __bind(this.recordsResponse, this);
    }

    Collection.prototype.find = function(id, params) {
      var record;
      record = new this.model({
        id: id
      });
      return this.ajax(params, {
        type: 'GET',
        url: Ajax.getURL(record)
      }).success(this.recordsResponse).error(this.errorResponse);
    };

    Collection.prototype.all = function(params) {
      return this.ajax(params, {
        type: 'GET',
        url: Ajax.getURL(this.model)
      }).success(this.recordsResponse).error(this.errorResponse);
    };

    Collection.prototype.fetch = function(params, options) {
      var id,
        _this = this;
      if (params == null) params = {};
      if (options == null) options = {};
      if (id = params.id) {
        delete params.id;
        return this.find(id, params).success(function(record) {
          return _this.model.refresh(record, options);
        });
      } else {
        return this.all(params).success(function(records) {
          return _this.model.refresh(records, options);
        });
      }
    };

    Collection.prototype.recordsResponse = function(data, status, xhr) {
      return this.model.trigger('ajaxSuccess', null, status, xhr);
    };

    Collection.prototype.errorResponse = function(xhr, statusText, error) {
      return this.model.trigger('ajaxError', null, xhr, statusText, error);
    };

    return Collection;

  })(Base);

  Singleton = (function(_super) {

    __extends(Singleton, _super);

    function Singleton(record) {
      this.record = record;
      this.errorResponse = __bind(this.errorResponse, this);
      this.recordResponse = __bind(this.recordResponse, this);
      this.model = this.record.constructor;
    }

    Singleton.prototype.reload = function(params, options) {
      var _this = this;
      return this.queue(function() {
        return _this.ajax(params, {
          type: 'GET',
          url: Ajax.getURL(_this.record)
        }).success(_this.recordResponse(options)).error(_this.errorResponse(options));
      });
    };

    Singleton.prototype.create = function(params, options) {
      var _this = this;
      return this.queue(function() {
        return _this.ajax(params, {
          type: 'POST',
          data: JSON.stringify(_this.record),
          url: Ajax.getURL(_this.model)
        }).success(_this.recordResponse(options)).error(_this.errorResponse(options));
      });
    };

    Singleton.prototype.update = function(params, options) {
      var _this = this;
      return this.queue(function() {
        return _this.ajax(params, {
          type: 'PUT',
          data: JSON.stringify(_this.record),
          url: Ajax.getURL(_this.record)
        }).success(_this.recordResponse(options)).error(_this.errorResponse(options));
      });
    };

    Singleton.prototype.destroy = function(params, options) {
      var _this = this;
      return this.queue(function() {
        return _this.ajax(params, {
          type: 'DELETE',
          url: Ajax.getURL(_this.record)
        }).success(_this.recordResponse(options)).error(_this.errorResponse(options));
      });
    };

    Singleton.prototype.recordResponse = function(options) {
      var _this = this;
      if (options == null) options = {};
      return function(data, status, xhr) {
        var _ref;
        if (Spine.isBlank(data)) {
          data = false;
        } else {
          data = _this.model.fromJSON(data);
        }
        Ajax.disable(function() {
          if (data) {
            if (data.id && _this.record.id !== data.id) {
              _this.record.changeID(data.id);
            }
            return _this.record.updateAttributes(data.attributes());
          }
        });
        _this.record.trigger('ajaxSuccess', data, status, xhr);
        return (_ref = options.success) != null ? _ref.apply(_this.record) : void 0;
      };
    };

    Singleton.prototype.errorResponse = function(options) {
      var _this = this;
      if (options == null) options = {};
      return function(xhr, statusText, error) {
        var _ref;
        _this.record.trigger('ajaxError', xhr, statusText, error);
        return (_ref = options.error) != null ? _ref.apply(_this.record) : void 0;
      };
    };

    return Singleton;

  })(Base);

  Model.host = '';

  Include = {
    ajax: function() {
      return new Singleton(this);
    },
    url: function() {
      var args, url;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      url = Ajax.getURL(this.constructor);
      if (url.charAt(url.length - 1) !== '/') url += '/';
      url += encodeURIComponent(this.id);
      args.unshift(url);
      return args.join('/');
    }
  };

  Extend = {
    ajax: function() {
      return new Collection(this);
    },
    url: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.unshift(this.className.toLowerCase() + 's');
      args.unshift(Model.host);
      return args.join('/');
    }
  };

  Model.Ajax = {
    extended: function() {
      this.fetch(this.ajaxFetch);
      this.change(this.ajaxChange);
      this.extend(Extend);
      return this.include(Include);
    },
    ajaxFetch: function() {
      var _ref;
      return (_ref = this.ajax()).fetch.apply(_ref, arguments);
    },
    ajaxChange: function(record, type, options) {
      if (options == null) options = {};
      if (options.ajax === false) return;
      return record.ajax()[type](options.ajax, options);
    }
  };

  Model.Ajax.Methods = {
    extended: function() {
      this.extend(Extend);
      return this.include(Include);
    }
  };

  Ajax.defaults = Base.prototype.defaults;

  Spine.Ajax = Ajax;

  if (typeof module !== "undefined" && module !== null) module.exports = Ajax;

}).call(this);
(function() {
  var $,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

  $ = Spine.$;

  Spine.List = (function(_super) {

    __extends(List, _super);

    List.prototype.events = {
      'click .item': 'click'
    };

    List.prototype.selectFirst = false;

    function List() {
      this.change = __bind(this.change, this);      List.__super__.constructor.apply(this, arguments);
      this.bind('change', this.change);
    }

    List.prototype.template = function() {
      return arguments[0];
    };

    List.prototype.change = function(item) {
      this.current = item;
      if (!this.current) {
        this.children().removeClass('active');
        return;
      }
      this.children().removeClass('active');
      return this.children().forItem(this.current).addClass('active');
    };

    List.prototype.render = function(items) {
      if (items) this.items = items;
      this.html(this.template(this.items));
      this.change(this.current);
      if (this.selectFirst) {
        if (!this.children('.active').length) {
          return this.children(':first').click();
        }
      }
    };

    List.prototype.children = function(sel) {
      return this.el.children(sel);
    };

    List.prototype.click = function(e) {
      var item;
      item = $(e.currentTarget).item();
      this.trigger('change', item);
      return true;
    };

    return List;

  })(Spine.Controller);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine.List;
  }

}).call(this);
(function() {

  if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

  Spine.Model.Local = {
    extended: function() {
      this.change(this.saveLocal);
      return this.fetch(this.loadLocal);
    },
    saveLocal: function() {
      var result;
      result = JSON.stringify(this);
      return localStorage[this.className] = result;
    },
    loadLocal: function() {
      var result;
      result = localStorage[this.className];
      return this.refresh(result || [], {
        clear: true
      });
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine.Model.Local;
  }

}).call(this);
(function() {
  var $,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

  $ = Spine.$;

  Spine.Manager = (function(_super) {

    __extends(Manager, _super);

    Manager.include(Spine.Events);

    function Manager() {
      this.controllers = [];
      this.bind('change', this.change);
      this.add.apply(this, arguments);
    }

    Manager.prototype.add = function() {
      var cont, controllers, _i, _len, _results;
      controllers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = controllers.length; _i < _len; _i++) {
        cont = controllers[_i];
        _results.push(this.addOne(cont));
      }
      return _results;
    };

    Manager.prototype.addOne = function(controller) {
      var _this = this;
      controller.bind('active', function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this.trigger.apply(_this, ['change', controller].concat(__slice.call(args)));
      });
      controller.bind('release', function() {
        return _this.controllers.splice(_this.controllers.indexOf(controller), 1);
      });
      return this.controllers.push(controller);
    };

    Manager.prototype.deactivate = function() {
      return this.trigger.apply(this, ['change', false].concat(__slice.call(arguments)));
    };

    Manager.prototype.change = function() {
      var args, cont, current, _i, _len, _ref, _results;
      current = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.controllers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cont = _ref[_i];
        if (cont === current) {
          _results.push(cont.activate.apply(cont, args));
        } else {
          _results.push(cont.deactivate.apply(cont, args));
        }
      }
      return _results;
    };

    return Manager;

  })(Spine.Module);

  Spine.Controller.include({
    active: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (typeof args[0] === 'function') {
        this.bind('active', args[0]);
      } else {
        args.unshift('active');
        this.trigger.apply(this, args);
      }
      return this;
    },
    isActive: function() {
      return this.el.hasClass('active');
    },
    activate: function() {
      this.el.addClass('active');
      return this;
    },
    deactivate: function() {
      this.el.removeClass('active');
      return this;
    }
  });

  Spine.Stack = (function(_super) {

    __extends(Stack, _super);

    Stack.prototype.controllers = {};

    Stack.prototype.routes = {};

    Stack.prototype.className = 'spine stack';

    function Stack() {
      var key, value, _fn, _ref, _ref2,
        _this = this;
      Stack.__super__.constructor.apply(this, arguments);
      this.manager = new Spine.Manager;
      this.manager.bind('change', function() {
        var args, controller;
        controller = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (controller) return _this.active.apply(_this, args);
      });
      _ref = this.controllers;
      for (key in _ref) {
        value = _ref[key];
        this[key] = new value({
          stack: this
        });
        this.add(this[key]);
      }
      _ref2 = this.routes;
      _fn = function(key, value) {
        var callback;
        if (typeof value === 'function') callback = value;
        callback || (callback = function() {
          var _ref3;
          return (_ref3 = _this[value]).active.apply(_ref3, arguments);
        });
        return _this.route(key, callback);
      };
      for (key in _ref2) {
        value = _ref2[key];
        _fn(key, value);
      }
      if (this["default"]) this[this["default"]].active();
    }

    Stack.prototype.add = function(controller) {
      this.manager.add(controller);
      return this.append(controller);
    };

    return Stack;

  })(Spine.Controller);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine.Manager;
  }

}).call(this);
(function() {
  var Collection, Instance, Singleton, isArray, singularize, underscore,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

  isArray = Spine.isArray;

  if (typeof require === "undefined" || require === null) {
    require = (function(value) {
      return eval(value);
    });
  }

  Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection(options) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    Collection.prototype.all = function() {
      var _this = this;
      return this.model.select(function(rec) {
        return _this.associated(rec);
      });
    };

    Collection.prototype.first = function() {
      return this.all()[0];
    };

    Collection.prototype.last = function() {
      var values;
      values = this.all();
      return values[values.length - 1];
    };

    Collection.prototype.find = function(id) {
      var records,
        _this = this;
      records = this.select(function(rec) {
        return rec.id + '' === id + '';
      });
      if (!records[0]) throw 'Unknown record';
      return records[0];
    };

    Collection.prototype.findAllByAttribute = function(name, value) {
      var _this = this;
      return this.model.select(function(rec) {
        return rec[name] === value;
      });
    };

    Collection.prototype.findByAttribute = function(name, value) {
      return this.findAllByAttribute(name, value)[0];
    };

    Collection.prototype.select = function(cb) {
      var _this = this;
      return this.model.select(function(rec) {
        return _this.associated(rec) && cb(rec);
      });
    };

    Collection.prototype.refresh = function(values) {
      var record, records, _i, _j, _len, _len2, _ref;
      _ref = this.all();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        delete this.model.records[record.id];
      }
      records = this.model.fromJSON(values);
      if (!isArray(records)) records = [records];
      for (_j = 0, _len2 = records.length; _j < _len2; _j++) {
        record = records[_j];
        record.newRecord = false;
        record[this.fkey] = this.record.id;
        this.model.records[record.id] = record;
      }
      return this.model.trigger('refresh', records);
    };

    Collection.prototype.create = function(record) {
      record[this.fkey] = this.record.id;
      return this.model.create(record);
    };

    Collection.prototype.associated = function(record) {
      return record[this.fkey] === this.record.id;
    };

    return Collection;

  })(Spine.Module);

  Instance = (function(_super) {

    __extends(Instance, _super);

    function Instance(options) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    Instance.prototype.exists = function() {
      return this.record[this.fkey] && this.model.exists(this.record[this.fkey]);
    };

    Instance.prototype.update = function(value) {
      if (!(value instanceof this.model)) value = new this.model(value);
      if (value.isNew()) value.save();
      return this.record[this.fkey] = value && value.id;
    };

    return Instance;

  })(Spine.Module);

  Singleton = (function(_super) {

    __extends(Singleton, _super);

    function Singleton(options) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    Singleton.prototype.find = function() {
      return this.record.id && this.model.findByAttribute(this.fkey, this.record.id);
    };

    Singleton.prototype.update = function(value) {
      if (!(value instanceof this.model)) value = this.model.fromJSON(value);
      value[this.fkey] = this.record.id;
      return value.save();
    };

    return Singleton;

  })(Spine.Module);

  singularize = function(str) {
    return str.replace(/s$/, '');
  };

  underscore = function(str) {
    return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
  };

  Spine.Model.extend({
    hasMany: function(name, model, fkey) {
      var association;
      if (fkey == null) fkey = "" + (underscore(this.className)) + "_id";
      association = function(record) {
        if (typeof model === 'string') model = require(model);
        return new Collection({
          name: name,
          model: model,
          record: record,
          fkey: fkey
        });
      };
      return this.prototype[name] = function(value) {
        if (value != null) association(this).refresh(value);
        return association(this);
      };
    },
    belongsTo: function(name, model, fkey) {
      var association;
      if (fkey == null) fkey = "" + (singularize(name)) + "_id";
      association = function(record) {
        if (typeof model === 'string') model = require(model);
        return new Instance({
          name: name,
          model: model,
          record: record,
          fkey: fkey
        });
      };
      this.prototype[name] = function(value) {
        if (value != null) association(this).update(value);
        return association(this).exists();
      };
      return this.attributes.push(fkey);
    },
    hasOne: function(name, model, fkey) {
      var association;
      if (fkey == null) fkey = "" + (underscore(this.className)) + "_id";
      association = function(record) {
        if (typeof model === 'string') model = require(model);
        return new Singleton({
          name: name,
          model: model,
          record: record,
          fkey: fkey
        });
      };
      return this.prototype[name] = function(value) {
        if (value != null) association(this).update(value);
        return association(this).find();
      };
    }
  });

}).call(this);
(function() {
  var $, escapeRegExp, hashStrip, namedParam, splatParam,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

  $ = Spine.$;

  hashStrip = /^#*/;

  namedParam = /:([\w\d]+)/g;

  splatParam = /\*([\w\d]+)/g;

  escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

  Spine.Route = (function(_super) {
    var _ref;

    __extends(Route, _super);

    Route.extend(Spine.Events);

    Route.historySupport = ((_ref = window.history) != null ? _ref.pushState : void 0) != null;

    Route.routes = [];

    Route.options = {
      trigger: true,
      history: false,
      shim: false
    };

    Route.add = function(path, callback) {
      var key, value, _results;
      if (typeof path === 'object' && !(path instanceof RegExp)) {
        _results = [];
        for (key in path) {
          value = path[key];
          _results.push(this.add(key, value));
        }
        return _results;
      } else {
        return this.routes.push(new this(path, callback));
      }
    };

    Route.setup = function(options) {
      if (options == null) options = {};
      this.options = $.extend({}, this.options, options);
      if (this.options.history) {
        this.history = this.historySupport && this.options.history;
      }
      if (this.options.shim) return;
      if (this.history) {
        $(window).bind('popstate', this.change);
      } else {
        $(window).bind('hashchange', this.change);
      }
      return this.change();
    };

    Route.unbind = function() {
      if (this.history) {
        return $(window).unbind('popstate', this.change);
      } else {
        return $(window).unbind('hashchange', this.change);
      }
    };

    Route.navigate = function() {
      var args, lastArg, options, path;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = {};
      lastArg = args[args.length - 1];
      if (typeof lastArg === 'object') {
        options = args.pop();
      } else if (typeof lastArg === 'boolean') {
        options.trigger = args.pop();
      }
      options = $.extend({}, this.options, options);
      path = args.join('/');
      if (this.path === path) return;
      this.path = path;
      this.trigger('navigate', this.path);
      if (options.trigger) this.matchRoute(this.path, options);
      if (options.shim) return;
      if (this.history) {
        return history.pushState({}, document.title, this.path);
      } else {
        return window.location.hash = this.path;
      }
    };

    Route.getPath = function() {
      var path;
      path = window.location.pathname;
      if (path.substr(0, 1) !== '/') path = '/' + path;
      return path;
    };

    Route.getHash = function() {
      return window.location.hash;
    };

    Route.getFragment = function() {
      return this.getHash().replace(hashStrip, '');
    };

    Route.getHost = function() {
      return (document.location + '').replace(this.getPath() + this.getHash(), '');
    };

    Route.change = function() {
      var path;
      path = this.getFragment() !== '' ? this.getFragment() : this.getPath();
      if (path === this.path) return;
      this.path = path;
      return this.matchRoute(this.path);
    };

    Route.matchRoute = function(path, options) {
      var route, _i, _len, _ref2;
      _ref2 = this.routes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        route = _ref2[_i];
        if (route.match(path, options)) {
          this.trigger('change', route, path);
          return route;
        }
      }
    };

    function Route(path, callback) {
      var match;
      this.path = path;
      this.callback = callback;
      this.names = [];
      if (typeof path === 'string') {
        namedParam.lastIndex = 0;
        while ((match = namedParam.exec(path)) !== null) {
          this.names.push(match[1]);
        }
        path = path.replace(escapeRegExp, '\\$&').replace(namedParam, '([^\/]*)').replace(splatParam, '(.*?)');
        this.route = new RegExp('^' + path + '$');
      } else {
        this.route = path;
      }
    }

    Route.prototype.match = function(path, options) {
      var i, match, param, params, _len;
      if (options == null) options = {};
      match = this.route.exec(path);
      if (!match) return false;
      options.match = match;
      params = match.slice(1);
      if (this.names.length) {
        for (i = 0, _len = params.length; i < _len; i++) {
          param = params[i];
          options[this.names[i]] = param;
        }
      }
      return this.callback.call(null, options) !== false;
    };

    return Route;

  })(Spine.Module);

  Spine.Route.change = Spine.Route.proxy(Spine.Route.change);

  Spine.Controller.include({
    route: function(path, callback) {
      return Spine.Route.add(path, this.proxy(callback));
    },
    routes: function(routes) {
      var key, value, _results;
      _results = [];
      for (key in routes) {
        value = routes[key];
        _results.push(this.route(key, value));
      }
      return _results;
    },
    navigate: function() {
      return Spine.Route.navigate.apply(Spine.Route, arguments);
    }
  });

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine.Route;
  }

}).call(this);
(function() {
  var $,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

  $ = Spine.$;

  Spine.Tabs = (function(_super) {

    __extends(Tabs, _super);

    Tabs.prototype.events = {
      'click [data-name]': 'click'
    };

    function Tabs() {
      this.change = __bind(this.change, this);      Tabs.__super__.constructor.apply(this, arguments);
      this.bind('change', this.change);
    }

    Tabs.prototype.change = function(name) {
      if (!name) return;
      this.current = name;
      this.children().removeClass('active');
      return this.children("[data-name=" + this.current + "]").addClass('active');
    };

    Tabs.prototype.render = function() {
      this.change(this.current);
      if (!(this.children('.active').length || this.current)) {
        return this.children(':first').click();
      }
    };

    Tabs.prototype.children = function(sel) {
      return this.el.children(sel);
    };

    Tabs.prototype.click = function(e) {
      var name;
      name = $(e.currentTarget).attr('data-name');
      return this.trigger('change', name);
    };

    Tabs.prototype.connect = function(tabName, controller) {
      var _this = this;
      this.bind('change', function(name) {
        if (name === tabName) return controller.active();
      });
      return controller.bind('active', function() {
        return _this.change(tabName);
      });
    };

    return Tabs;

  })(Spine.Controller);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine.Tabs;
  }

}).call(this);
(function() {

  $.fn.item = function() {
    var item;
    item = $(this);
    item = item.data("item") || (typeof item.tmplItem === "function" ? item.tmplItem().data : void 0);
    if (item != null) if (typeof item.reload === "function") item.reload();
    return item;
  };

  $.fn.forItem = function(item) {
    return this.filter(function() {
      var compare;
      compare = $(this).item();
      return (typeof item.eql === "function" ? item.eql(compare) : void 0) || item === compare;
    });
  };

}).call(this);
(function() {
  var Touchable;

  Touchable = {
    watchTouch: function() {
      var _this = this;
      this.touch_el = this.touch_el ? this.touch_el : this.el;
      this.touch_el.bind('touchstart', function(e) {
        return _this.touchable_startTouching(e);
      });
      this.touch_el.bind('touchmove', function(e) {
        return _this.touchable_continueTouching(e);
      });
      return this.touch_el.bind('touchend', function(e) {
        return _this.touchable_finishTouching(e);
      });
    },
    touchable_startTouching: function(event) {
      this.touch_start = {};
      this.touch_last = {};
      this.touch_start.x = event.originalEvent.touches[0].pageX;
      this.touch_start.y = event.originalEvent.touches[0].pageY;
      this.touch_start.time = new Date();
      this.touch_last.x = this.touch_start.x;
      this.touch_last.y = this.touch_start.y;
      return this.startTouching(event);
    },
    touchable_continueTouching: function(event) {
      this.touch_last.x = event.originalEvent.touches[0].pageX;
      this.touch_last.y = event.originalEvent.touches[0].pageY;
      return this.continueTouching(event);
    },
    touchable_finishTouching: function(event) {
      return this.finishTouching(event);
    }
  };

  window.Touchable = Touchable;

}).call(this);
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
(function() {
  var Task,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Task = (function(_super) {

    __extends(Task, _super);

    function Task() {
      Task.__super__.constructor.apply(this, arguments);
    }

    Task.configure('Task', 'name', 'duration', 'done');

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
(function() {
  var AgendaItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  AgendaItem = (function(_super) {

    __extends(AgendaItem, _super);

    function AgendaItem() {
      this.render = __bind(this.render, this);      AgendaItem.__super__.constructor.apply(this, arguments);
      this.item.bind("update", this.render);
      Task.bind("create refresh update destroy", this.render);
      this.render();
    }

    AgendaItem.prototype.render = function() {
      return setTimeout(this.render, 500);
    };

    return AgendaItem;

  })(Spine.Controller);

  window.AgendaItem = AgendaItem;

}).call(this);
(function() {
  var TaskItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskItem = (function(_super) {

    __extends(TaskItem, _super);

    TaskItem.include(Touchable);

    TaskItem.config = {
      height: 40,
      gutter_width: 36,
      touch_tap_time_tolerance: 500,
      touch_tap_dist_tolerance: 5,
      touch_hold_dist_tolerance: 5,
      touch_swipe_dist_tolerance: 15
    };

    TaskItem.prototype.className = "task";

    TaskItem.prototype.elements = {
      ".content": "content",
      "input[type='text']": "name_input",
      ".duration": "duration",
      ".check": "checkmark"
    };

    TaskItem.prototype.events = {
      "focusout input[type='text']": "updateName"
    };

    function TaskItem() {
      this.toggleDuration = __bind(this.toggleDuration, this);
      this.checkTouchStatus = __bind(this.checkTouchStatus, this);
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      this.remove = __bind(this.remove, this);
      this.updateName = __bind(this.updateName, this);
      this.startEditingName = __bind(this.startEditingName, this);
      this.editName = __bind(this.editName, this);
      this.transformCheckmarkOpacity = __bind(this.transformCheckmarkOpacity, this);
      this.transformTranslateX = __bind(this.transformTranslateX, this);
      this.transformRotateX = __bind(this.transformRotateX, this);
      this.transform = __bind(this.transform, this);
      this.transformed = __bind(this.transformed, this);
      this.transforming = __bind(this.transforming, this);
      this.render = __bind(this.render, this);
      this.template = __bind(this.template, this);      TaskItem.__super__.constructor.apply(this, arguments);
      if (!this.item) throw "@item required";
      this.item.bind("update", this.render);
      this.item.bind("destroy", this.remove);
      this.watchTouch();
    }

    TaskItem.prototype.template = function(item) {
      return _.template($("#task-template").html(), {
        task: item
      });
    };

    TaskItem.prototype.render = function(item) {
      if (item) this.item = item;
      this.item.controller = this;
      this.html(this.template(this.item));
      return this;
    };

    TaskItem.prototype.transforming = function() {
      return this.el.css({
        'height': '0',
        'z-index': '-1'
      });
    };

    TaskItem.prototype.transformed = function() {
      return this.el.css({
        'height': TaskItem.config.height + 'px',
        'z-index': '1'
      });
    };

    TaskItem.prototype.transform = function(element, name, dist, unit, animated, callback) {
      var transform_properties,
        _this = this;
      transform_properties = {};
      transform_properties[name] = dist + unit;
      if (animated) {
        if (element.css(name) === dist + unit) {
          return callback && callback();
        } else {
          return element.transition(_.extend(transform_properties, {
            complete: function() {
              return callback && callback();
            }
          }));
        }
      } else {
        return element.css(transform_properties);
      }
    };

    TaskItem.prototype.transformRotateX = function(dist, animated, callback) {
      this.el.css({
        transformOrigin: '50% 0'
      });
      return this.transform(this.el, 'rotateX', dist, 'deg', animated, callback);
    };

    TaskItem.prototype.transformTranslateX = function(dist, animated, callback) {
      return this.transform(this.content, 'x', dist, '', animated, callback);
    };

    TaskItem.prototype.transformCheckmarkOpacity = function(dist, animated, callback) {
      return this.transform(this.checkmark, 'opacity', dist, '', animated, callback);
    };

    TaskItem.prototype.editName = function() {
      return this.el.find('input').focus();
    };

    TaskItem.prototype.startEditingName = function() {
      this.el.find('input').val("");
      return this.editName();
    };

    TaskItem.prototype.updateName = function() {
      var name;
      name = this.name_input.val();
      if (name.length) {
        this.item.name = name;
        return this.item.save();
      } else {
        return Tasks.trigger('task:delete', this.item);
      }
    };

    TaskItem.prototype.remove = function() {
      return this.el.remove();
    };

    TaskItem.prototype.startTouching = function(event) {
      this.touching = true;
      this.hovering = false;
      this.swiping = false;
      this.toggle_done = false;
      return delay(350, this.checkTouchStatus);
    };

    TaskItem.prototype.continueTouching = function(event) {
      var dx, updated_toggle_done;
      dx = this.touch_last.x - this.touch_start.x;
      if (!this.hovering && !app.global_scrolling && Math.abs(dx) > TaskItem.config.touch_swipe_dist_tolerance) {
        this.swiping = true;
      }
      if (this.swiping) {
        dx = dx > 0 ? dx : 0;
        dx = dx < TaskItem.config.gutter_width ? dx : TaskItem.config.gutter_width;
        this.transformTranslateX(dx);
        if (this.item.done) {
          this.transformCheckmarkOpacity(1 - (dx / TaskItem.config.gutter_width));
        } else {
          this.transformCheckmarkOpacity(dx / TaskItem.config.gutter_width);
        }
        updated_toggle_done = dx === TaskItem.config.gutter_width ? true : false;
        if (updated_toggle_done === !this.toggle_done) {
          if (this.item.done) {
            if (updated_toggle_done) {
              this.content.removeClass("done");
            } else {
              this.content.addClass("done");
            }
          } else {
            if (updated_toggle_done) {
              this.content.addClass("green");
            } else {
              this.content.removeClass("green");
            }
          }
        }
        return this.toggle_done = updated_toggle_done;
      }
    };

    TaskItem.prototype.finishTouching = function(event) {
      var dx, now;
      dx = this.touch_last.x - this.touch_start.x;
      this.touching = false;
      now = new Date();
      if (!this.hovering && !app.global_scrolling && (now - this.touch_start.time < TaskItem.config.touch_tap_time_tolerance) && (Math.abs(dx) < TaskItem.config.touch_tap_dist_tolerance)) {
        this.transformTranslateX(0);
        if (event.target === this.duration[0]) {
          this.toggleDuration();
        } else {
          this.editName();
        }
      }
      if (this.toggle_done) {
        this.item.done = !this.item.done;
        return this.item.save();
      } else {
        this.transformTranslateX(0, true);
        return this.hovering = false;
      }
    };

    TaskItem.prototype.checkTouchStatus = function() {
      var dx, dy;
      dx = this.touch_last.x - this.touch_start.x;
      dy = this.touch_last.y - this.touch_start.y;
      if (this.touching && !app.global_scrolling && Math.abs(dx) <= TaskItem.config.touch_hold_dist_tolerance) {
        this.hovering = true;
        this.transformTranslateX(0);
        return console.log("hovering task");
      }
    };

    TaskItem.prototype.toggleDuration = function() {
      return console.log("toggling duration");
    };

    return TaskItem;

  })(Spine.Controller);

  window.TaskItem = TaskItem;

}).call(this);
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
(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  App = (function(_super) {

    __extends(App, _super);

    App.include(Touchable);

    App.config = {
      touch_scroll_dist_tolerance: 5
    };

    function App() {
      this.finishTouching = __bind(this.finishTouching, this);
      this.continueTouching = __bind(this.continueTouching, this);
      this.startTouching = __bind(this.startTouching, this);
      var _this = this;
      App.__super__.constructor.apply(this, arguments);
      Agenda.bind("refresh", function() {
        var agenda;
        if (!Agenda.first()) {
          Agenda.create({
            day_start: 420,
            day_end: 1380
          });
        }
        return agenda = new AgendaItem({
          el: $("#container"),
          item: Agenda.first()
        });
      });
      Agenda.fetch();
      this.tasks = new Tasks({
        el: $("#tasks")
      });
      Task.fetch();
      this.watchTouch();
    }

    App.prototype.startTouching = function(event) {
      return this.global_scrolling = false;
    };

    App.prototype.continueTouching = function(event) {
      var dy;
      dy = this.touch_last.y - this.touch_start.y;
      if (Math.abs(dy) > App.config.touch_scroll_dist_tolerance) {
        return this.global_scrolling = true;
      }
    };

    App.prototype.finishTouching = function(event) {
      return this.global_scrolling = false;
    };

    return App;

  })(Spine.Controller);

  window.App = App;

}).call(this);
