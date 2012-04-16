(function(){var a,b,c,d,e,f,g,h,i,j,k,l=[].slice,m=[].indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1},n={}.hasOwnProperty,o=function(a,b){function d(){this.constructor=a}for(var c in b)n.call(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a},p=function(a,b){return function(){return a.apply(b,arguments)}};c={bind:function(a,b){var c,d,e,f,g;d=a.split(" "),c=this.hasOwnProperty("_callbacks")&&this._callbacks||(this._callbacks={});for(f=0,g=d.length;f<g;f++)e=d[f],c[e]||(c[e]=[]),c[e].push(b);return this},one:function(a,b){return this.bind(a,function(){return this.unbind(a,arguments.callee),b.apply(this,arguments)})},trigger:function(){var a,b,c,d,e,f,g,h;a=1<=arguments.length?l.call(arguments,0):[],c=a.shift(),e=a[a.length-1];if(typeof e=="object"&&e.silent)return;d=this.hasOwnProperty("_callbacks")&&((h=this._callbacks)!=null?h[c]:void 0);if(!d)return;for(f=0,g=d.length;f<g;f++){b=d[f];if(b.apply(this,a)===!1)break}return!0},unbind:function(a,b){var c,d,e,f,g,h;if(!a)return this._callbacks={},this;e=(h=this._callbacks)!=null?h[a]:void 0;if(!e)return this;if(!b)return delete this._callbacks[a],this;for(d=f=0,g=e.length;f<g;d=++f){c=e[d];if(c!==b)continue;e=e.slice(),e.splice(d,1),this._callbacks[a]=e;break}return this}},d={trace:!0,logPrefix:"(App)",log:function(){var a;a=1<=arguments.length?l.call(arguments,0):[];if(!this.trace)return;return this.logPrefix&&a.unshift(this.logPrefix),typeof console!="undefined"&&console!==null&&typeof console.log=="function"&&console.log.apply(console,a),this}},k=["included","extended"],f=function(){function a(){typeof this.init=="function"&&this.init.apply(this,arguments)}return a.name="Module",a.include=function(a){var b,c,d;if(!a)throw"include(obj) requires obj";for(b in a)c=a[b],m.call(k,b)<0&&(this.prototype[b]=c);return(d=a.included)!=null&&d.apply(this),this},a.extend=function(a){var b,c,d;if(!a)throw"extend(obj) requires obj";for(b in a)c=a[b],m.call(k,b)<0&&(this[b]=c);return(d=a.extended)!=null&&d.apply(this),this},a.proxy=function(a){var b=this;return function(){return a.apply(b,arguments)}},a.prototype.proxy=function(a){var b=this;return function(){return a.apply(b,arguments)}},a}(),e=function(b){function d(a){d.__super__.constructor.apply(this,arguments),a&&this.load(a),this.cid||(this.cid="c-"+this.constructor.uid())}return o(d,b),d.name="Model",d.extend(c),d.records={},d.crecords={},d.attributes=[],d.configure=function(){var a,b;return b=arguments[0],a=2<=arguments.length?l.call(arguments,1):[],this.className=b,this.records={},this.crecords={},a.length&&(this.attributes=a),this.attributes&&(this.attributes=j(this.attributes)),this.attributes||(this.attributes=[]),this.unbind(),this},d.toString=function(){return""+this.className+"("+this.attributes.join(", ")+")"},d.find=function(a){var b;b=this.records[a];if(!b&&(""+a).match(/c-\d+/))return this.findCID(a);if(!b)throw"Unknown record";return b.clone()},d.findCID=function(a){var b;b=this.crecords[a];if(!b)throw"Unknown record";return b.clone()},d.exists=function(a){try{return this.find(a)}catch(b){return!1}},d.refresh=function(a,b){var c,d,e,f;b==null&&(b={}),b.clear&&(this.records={},this.crecords={}),d=this.fromJSON(a),h(d)||(d=[d]);for(e=0,f=d.length;e<f;e++)c=d[e],c.id||(c.id=c.cid),this.records[c.id]=c,this.crecords[c.cid]=c;return this.trigger("refresh",!b.clear&&this.cloneArray(d)),this},d.select=function(a){var b,c,d;return d=function(){var d,e;d=this.records,e=[];for(b in d)c=d[b],a(c)&&e.push(c);return e}.call(this),this.cloneArray(d)},d.findByAttribute=function(a,b){var c,d,e;e=this.records;for(c in e){d=e[c];if(d[a]===b)return d.clone()}return null},d.findAllByAttribute=function(a,b){return this.select(function(c){return c[a]===b})},d.each=function(a){var b,c,d,e;d=this.records,e=[];for(b in d)c=d[b],e.push(a(c.clone()));return e},d.all=function(){return this.cloneArray(this.recordsValues())},d.first=function(){var a;return a=this.recordsValues()[0],a!=null?a.clone():void 0},d.last=function(){var a,b;return b=this.recordsValues(),a=b[b.length-1],a!=null?a.clone():void 0},d.count=function(){return this.recordsValues().length},d.deleteAll=function(){var a,b,c,d;c=this.records,d=[];for(a in c)b=c[a],d.push(delete this.records[a]);return d},d.destroyAll=function(){var a,b,c,d;c=this.records,d=[];for(a in c)b=c[a],d.push(this.records[a].destroy());return d},d.update=function(a,b,c){return this.find(a).updateAttributes(b,c)},d.create=function(a,b){var c;return c=new this(a),c.save(b)},d.destroy=function(a,b){return this.find(a).destroy(b)},d.change=function(a){return typeof a=="function"?this.bind("change",a):this.trigger("change",a)},d.fetch=function(a){return typeof a=="function"?this.bind("fetch",a):this.trigger("fetch",a)},d.toJSON=function(){return this.recordsValues()},d.fromJSON=function(a){var b,c,d,e;if(!a)return;typeof a=="string"&&(a=JSON.parse(a));if(h(a)){e=[];for(c=0,d=a.length;c<d;c++)b=a[c],e.push(new this(b));return e}return new this(a)},d.fromForm=function(){var a;return(a=new this).fromForm.apply(a,arguments)},d.recordsValues=function(){var a,b,c,d;b=[],d=this.records;for(a in d)c=d[a],b.push(c);return b},d.cloneArray=function(a){var b,c,d,e;e=[];for(c=0,d=a.length;c<d;c++)b=a[c],e.push(b.clone());return e},d.idCounter=0,d.uid=function(){return this.idCounter++},d.prototype.isNew=function(){return!this.exists()},d.prototype.isValid=function(){return!this.validate()},d.prototype.validate=function(){},d.prototype.load=function(a){var b,c;for(b in a)c=a[b],typeof this[b]=="function"?this[b](c):this[b]=c;return this},d.prototype.attributes=function(){var a,b,c,d,e;b={},e=this.constructor.attributes;for(c=0,d=e.length;c<d;c++)a=e[c],a in this&&(typeof this[a]=="function"?b[a]=this[a]():b[a]=this[a]);return this.id&&(b.id=this.id),b},d.prototype.eql=function(a){return!(!a||a.constructor!==this.constructor||a.id!==this.id&&a.cid!==this.cid)},d.prototype.save=function(a){var b,c;a==null&&(a={});if(a.validate!==!1){b=this.validate();if(b)return this.trigger("error",b),!1}return this.trigger("beforeSave",a),c=this.isNew()?this.create(a):this.update(a),this.trigger("save",a),c},d.prototype.updateAttribute=function(a,b){return this[a]=b,this.save()},d.prototype.updateAttributes=function(a,b){return this.load(a),this.save(b)},d.prototype.changeID=function(a){var b;return b=this.constructor.records,b[a]=b[this.id],delete b[this.id],this.id=a,this.save()},d.prototype.destroy=function(a){return a==null&&(a={}),this.trigger("beforeDestroy",a),delete this.constructor.records[this.id],delete this.constructor.crecords[this.cid],this.destroyed=!0,this.trigger("destroy",a),this.trigger("change","destroy",a),this.unbind(),this},d.prototype.dup=function(a){var b;return b=new this.constructor(this.attributes()),a===!1?b.cid=this.cid:delete b.id,b},d.prototype.clone=function(){return Object.create(this)},d.prototype.reload=function(){var a;return this.isNew()?this:(a=this.constructor.find(this.id),this.load(a.attributes()),a)},d.prototype.toJSON=function(){return this.attributes()},d.prototype.toString=function(){return"<"+this.constructor.className+" ("+JSON.stringify(this)+")>"},d.prototype.fromForm=function(b){var c,d,e,f,g;d={},g=a(b).serializeArray();for(e=0,f=g.length;e<f;e++)c=g[e],d[c.name]=c.value;return this.load(d)},d.prototype.exists=function(){return this.id&&this.id in this.constructor.records},d.prototype.update=function(a){var b,c;return this.trigger("beforeUpdate",a),c=this.constructor.records,c[this.id].load(this.attributes()),b=c[this.id].clone(),b.trigger("update",a),b.trigger("change","update",a),b},d.prototype.create=function(a){var b,c;return this.trigger("beforeCreate",a),this.id||(this.id=this.cid),c=this.dup(!1),this.constructor.records[this.id]=c,this.constructor.crecords[this.cid]=c,b=c.clone(),b.trigger("create",a),b.trigger("change","create",a),b},d.prototype.bind=function(a,b){var c,d,e=this;return this.constructor.bind(a,c=function(a){if(a&&e.eql(a))return b.apply(e,arguments)}),this.constructor.bind("unbind",d=function(b){if(b&&e.eql(b))return e.constructor.unbind(a,c),e.constructor.unbind("unbind",d)}),c},d.prototype.one=function(a,b){var c,d=this;return c=this.bind(a,function(){return d.constructor.unbind(a,c),b.apply(d)})},d.prototype.trigger=function(){var a,b;return a=1<=arguments.length?l.call(arguments,0):[],a.splice(1,0,this),(b=this.constructor).trigger.apply(b,a)},d.prototype.unbind=function(){return this.trigger("unbind")},d}(f),b=function(b){function e(b){this.release=p(this.release,this);var c,d,f;this.options=b,f=this.options;for(c in f)d=f[c],this[c]=d;this.el||(this.el=document.createElement(this.tag)),this.el=a(this.el),this.className&&this.el.addClass(this.className),this.attributes&&this.el.attr(this.attributes),this.release(function(){return this.el.remove()}),this.events||(this.events=this.constructor.events),this.elements||(this.elements=this.constructor.elements),this.events&&this.delegateEvents(),this.elements&&this.refreshElements(),e.__super__.constructor.apply(this,arguments)}return o(e,b),e.name="Controller",e.include(c),e.include(d),e.prototype.eventSplitter=/^(\S+)\s*(.*)$/,e.prototype.tag="div",e.prototype.release=function(a){return typeof a=="function"?this.bind("release",a):this.trigger("release")},e.prototype.$=function(b){return a(b,this.el)},e.prototype.delegateEvents=function(){var a,b,c,d,e,f,g;f=this.events,g=[];for(b in f)d=f[b],typeof d!="function"&&(d=this.proxy(this[d])),c=b.match(this.eventSplitter),a=c[1],e=c[2],e===""?g.push(this.el.bind(a,d)):g.push(this.el.delegate(e,a,d));return g},e.prototype.refreshElements=function(){var a,b,c,d;c=this.elements,d=[];for(a in c)b=c[a],d.push(this[b]=this.$(a));return d},e.prototype.delay=function(a,b){return setTimeout(this.proxy(a),b||0)},e.prototype.html=function(a){return this.el.html(a.el||a),this.refreshElements(),this.el},e.prototype.append=function(){var a,b,c;return b=1<=arguments.length?l.call(arguments,0):[],b=function(){var c,d,e;e=[];for(c=0,d=b.length;c<d;c++)a=b[c],e.push(a.el||a);return e}(),(c=this.el).append.apply(c,b),this.refreshElements(),this.el},e.prototype.appendTo=function(a){return this.el.appendTo(a.el||a),this.refreshElements(),this.el},e.prototype.prepend=function(){var a,b,c;return b=1<=arguments.length?l.call(arguments,0):[],b=function(){var c,d,e;e=[];for(c=0,d=b.length;c<d;c++)a=b[c],e.push(a.el||a);return e}(),(c=this.el).prepend.apply(c,b),this.refreshElements(),this.el},e.prototype.replace=function(b){var c,d;return d=[this.el,a(b.el||b)],c=d[0],this.el=d[1],c.replaceWith(this.el),this.delegateEvents(),this.refreshElements(),this.el},e}(f),a=(typeof window!="undefined"&&window!==null?window.jQuery:void 0)||(typeof window!="undefined"&&window!==null?window.Zepto:void 0)||function(a){return a},typeof Object.create!="function"&&(Object.create=function(a){var b;return b=function(){},b.prototype=a,new b}),h=function(a){return Object.prototype.toString.call(a)==="[object Array]"},i=function(a){var b;if(!a)return!0;for(b in a)return!1;return!0},j=function(a){return Array.prototype.slice.call(a,0)},g=this.Spine={},typeof module!="undefined"&&module!==null&&(module.exports=g),g.version="1.0.5",g.isArray=h,g.isBlank=i,g.$=a,g.Events=c,g.Log=d,g.Module=f,g.Controller=b,g.Model=e,f.extend.call(g,c),f.create=f.sub=b.create=b.sub=e.sub=function(a,b){var c;return c=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return o(b,a),b.name="result",b}(this),a&&c.include(a),b&&c.extend(b),typeof c.unbind=="function"&&c.unbind(),c},e.setup=function(a,b){var c;return b==null&&(b=[]),c=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return o(b,a),b.name="Instance",b}(this),c.configure.apply(c,[a].concat(l.call(b))),c},f.init=b.init=e.init=function(a,b,c,d,e){return new this(a,b,c,d,e)},g.Class=f}).call(this);