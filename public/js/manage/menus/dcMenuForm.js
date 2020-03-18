import Common, { bindElement } from '/public/js/common/dcCommon.js'

const initConfig = {
  url: "",
  js: [],
  parent: null
}

const DochiMenuForm = function(config, el){
  let datas = {}
  let insts = {}
  let doms = {}
  
  this.el = el;
  this.setConfig = (k,v)=>{ config[k] = v }
  this.getConfig = (k)=>config[k];
  this.setData = (k,v)=>{ datas[k] = v }
  this.setDatas = (v)=>{ datas=v }
  this.getData = (k)=>datas[k]
  this.getDatas = ()=>datas;
  this.setInst = (k,v)=>{ insts[k] = v }
  this.getInst = (k)=>insts[k]
  this.getInsts = ()=>insts;
  this.setDom = (k,v)=>{ doms[k] = v }
  this.getDom = (k)=>doms[k]
}

DochiMenuForm.prototype = (function(){
  function _init(self){
    _initRender(self);
  }

  function _initRender(self){
    const html = `
      <div class="modal-form row"></div>
      <form id="menu_form" method="POST" class="col s12" onsubmit="return false;">
        <div class="row">
          <div class="input-field col s12">
            <input value="전체 메뉴" id="full_menu" name="full_menu" type="text" class="unused" disabled>
            <label for="full_menu">전체 메뉴</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <input id="menu_grp_id" name="menu_grp_id" type="text" class="">
            <label for="menu_grp_id">메뉴그룹ID</label>
          </div>
          <div class="input-field col s6">
            <input id="menu_id" name="menu_id" type="text" class="validate">
            <label for="menu_id">메뉴ID</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <input id="menu_name" name="menu_name" type="text" class="validate">
            <label for="menu_name">메뉴명</label>
          </div>
          <div class="input-field col s6">
            <input id="sort_order" name="sort_order" type="text" class="validate">
            <label for="sort_order">정렬순서</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="menu_index" name="menu_index" type="text" class="validate">
            <label for="menu_index">인덱스</label>
          </div>
        </div>
      </form>
    </div>
    `;

    self.el.innerHTML = html;
  }
  
  function _initEvent(self){
    
  }
  
  return {
    init: function(){
      _init(this);
    }
  }
})();

export default bindElement("dcMenuForm", DochiMenuForm, initConfig);