((function(){if(typeof Spine=="undefined"||Spine===null)Spine=require("spine");Spine.Model.Local={extended:function(){return this.change(this.saveLocal),this.fetch(this.loadLocal)},saveLocal:function(){var a;return a=JSON.stringify(this),localStorage[this.className]=a},loadLocal:function(){var a;return a=localStorage[this.className],this.refresh(a||[],{clear:!0})}},typeof module!="undefined"&&module!==null&&(module.exports=Spine.Model.Local)})).call(this)