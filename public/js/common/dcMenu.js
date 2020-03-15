import { bindElement } from '/public/js/common/dcCommon.js'

const initConfig = {
  url: "/menus",
  js: [
    "js/manage/menus/dcMenuList"
  ],
  parent: null
}

const DochiMenu = function(config, el){
  let datas = config.data || {}
  let insts = {}
  let doms = {}
  
  this.el = el;
  this.setConfig = (k,v)=>{ config[k] = v }
  this.getConfig = (k)=>config[k];
  this.setData = (k,v)=>{ datas[k] = v }
  this.setDatas = (v)=>{ datas=v }
  this.getData = (k)=>datas[k];
  this.getDatas = ()=>datas;
  this.setInst = (k,v)=>{ insts[k] = v }
  this.getInst = (k)=>insts[k];
  this.getInsts = ()=>insts;
  this.setDom = (k,v)=>{ doms[k] = v }
  this.getDom = (k)=>doms[k];
}

DochiMenu.prototype = (function(){
  function _init(self){
    self.initData(function(res){
      if( res.success ){
        if( res.data ){
          self.setDatas(res.data);
        }
        _initRender(self); 
        _initEvent(self);
      } else {
        console.error(res.error);
      }
    });
  }

  function _initRender(self){
    const html = `
    <div class="menus-wrapper">
      <div class="navi-wrapper">
        <div id="navigator">
          <a href="/" class="breadcrumb">Home</a>
        </div>
      </div>
      <div class="divider"></div>
      <div id="hierarchy_menu" class="menu-wrapper">
      </div>
    </div>
    `;
    self.el.innerHTML = html;
    
    const menus = self.getData("list");
    menus.forEach(function(menu){
      _renderMenuGrp(self, menu);
    });
  }

  function _renderMenuGrp(self, menu){
    const hierarchy_menu = document.getElementById("hierarchy_menu");

    const dl = document.createElement("dl");
    const dt = document.createElement("dt");
    const dt_label = document.createElement("label");
    const input_clicker = document.createElement("input");
    const dl_child = document.createElement("dl");

    const div_divider = document.createElement("div");
    div_divider.className = "divider";
    
    dl.className = `menu-${menu.menu_id}`;

    dt.className = "menu-header";
    dt_label.setAttribute("for", `menu-${menu.menu_id}-clicker`);
    dt_label.appendChild(document.createTextNode(menu.menu_name));
    
    input_clicker.type = "checkbox";
    input_clicker.id = `menu-${menu.menu_id}-clicker`;
    input_clicker.className = "clicker";

    dl_child.className = "menu-list";
    
    const child_menus = menu.child_menus.map(function(child_menu){
      return _renderMenuChild(self, menu, child_menu);
    });

    dt.appendChild(dt_label);
    dl.appendChild(dt);
    dl.appendChild(input_clicker);

    child_menus.forEach(_child=>{ dl_child.appendChild(_child); });
    
    dl.appendChild(dl_child);
    dl.appendChild(div_divider);

    hierarchy_menu.appendChild(dl);
  }

  function _renderMenuChild(self, parent, menu){
    const dd = document.createElement("dd");
    const a = document.createElement("a");

    a.setAttribute("href", menu.menu_index);
    a.className = "btn_sel_menu";
    a.setAttribute("menu-type", parent.menu_id);
    a.setAttribute("menu-name", menu.menu_id);
    a.appendChild(document.createTextNode(menu.menu_name));

    dd.appendChild(a);

    return dd;
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
    const menu_type = el.getAttribute("menu-type");
    const menu_name = el.getAttribute("menu-name");
    
    const content = document.getElementById("viewer");
    if( content ){
      content.dcMenuList();
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

export default bindElement("dcMenu", DochiMenu, initConfig);