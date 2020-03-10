
Element.prototype.dcMenuList = function(setting){
  let config = {
    url: ""
    , js: [
      "js/manage/menus/menu_form"
    ]
  }
  
  if( config ){
    config = {
      ...config
      , setting
    }
  }
  
  const p = new DochiMenuList(config, this);
  Common.extends(p);
  p.init();
  
  return p;
}

const DochiMenuList = function(config, el){
  const data = {}
  const instance = {}
  
  this.el = el;
  this.setConfig = (k,v)=>{ config[k] = v }
  this.getConfig = (k)=>config[k]
  this.setData = (k,v)=>{ data[k] = v }
  this.getData = (k)=>data[k]
}

DochiMenuList.prototype = (function(){
  function _init(self){
    self.initLoad(function(){
      _initEvent(self);
    });
  }
  
  function _initEvent(self){
    
  }
  
  function openMenu(event){
    
  }
  
  return {
    init: function(){
      _init(this);
    }
  }
})();