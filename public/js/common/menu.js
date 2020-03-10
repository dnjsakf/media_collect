
Element.prototype.dcMenu = function(setting){
  let config = {
    url: "/menus"
    , js: [
      "js/manage/menus/menu_list"
    ]
  }
  
  if( setting ){
    Object.assign(config, setting);
  }
  
  const p = new DochiMenu(config, this);
  Common.extends(p);
  p.init();
  
  return p;
}

const DochiMenu = function(config, el){
  const data = {}
  const instance = {}
  
  this.el = el;
  this.setConfig = (k,v)=>{ config[k] = v }
  this.getConfig = (k)=>config[k]
  this.setData = (k,v)=>{ data[k] = v }
  this.getData = (k)=>data[k]
}

DochiMenu.prototype = (function(){
  function _init(self){
    self.initLoad(function(){
      _initEvent(self);
    });
  }
  
  function _initEvent(self){
    const sel_menu_buttons = self.el.querySelectorAll(".btn_sel_menu");
    Array.from(sel_menu_buttons).forEach(function(btn){
      btn.removeEventListener('click', openMenu);
      btn.addEventListener('click', openMenu);
    });
  }
  
  function openMenu(event){
    event.preventDefault();
    
    const el = event.target;
    const url = el.getAttribute("href");
    const menu_type = el.getAttribute("menu-type");
    const menu_name = el.getAttribute("menu-name");
    
    const content = document.getElementById("viewer");
    if( content ){
      content.dcMenuList({
        url: url
      });
    }
    handleChangeMenu(menu_type, menu_name);
  }
  
  function handleChangeMenu(menu_type, menu_name){
    const navigator = document.getElementById("navigator");
      
    const menu_grp = document.createElement("a");
    menu_grp.href = "#!";
    menu_grp.className = "breadcrumb";
    menu_grp.appendChild(document.createTextNode(menu_type));
    
    const menu = document.createElement("a");
    menu.href = "#!";
    menu.appendChild(document.createTextNode(menu_name));
    menu.className = "breadcrumb";
    
    Array.from(navigator.children).forEach(el=>el.remove());
    navigator.appendChild(menu_grp);
    navigator.appendChild(menu);
  }
  
  return {
    init: function(){
      _init(this);
    }
  }
})();