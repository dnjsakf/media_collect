Element.prototype.dcMenuList = function(setting){
  let config = {
    url: ""
    , js: [
      "js/manage/menus/menu_form"
    ]
  }
  
  if( setting ){
    Object.assign(config, setting);
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
    const btn_insert_menu = document.getElementById("btn_insert_menu");
    if( btn_insert_menu ){
        btn_insert_menu.addEventListener("click", _handleOpenModal(self));
    }
  }
  
  function _handleOpenModal(self){
    const options = {
      "url": "/tmpl/manage/menus/menu_form",
      "title": "테스트", 
      "buttons": [
        {
          "text": "취소"
          , "className": "modal-close"
        },
        {
          "text": "저장"
          , "className": "save"
          , "onclick": function(event){
            const inst = M.Modal.getInstance(event.target.closest(".modal"));
            
            console.log( "save" );
            inst.close();
          }
        }
      ], 
      "config": {
        "onCloseEnd": function(event){
          this.destroy();
          this.el.remove();
        }
      }
    }
    return function(event){
      event.preventDefault();
      Common.modal.open(options);
    }
  }
  
  return {
    init: function(){
      _init(this);
    }
  }
})();