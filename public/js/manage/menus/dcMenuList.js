import Common, { bindElement } from '/public/js/common/dcCommon.js'

const initConfig = {
  url: "",
  js: [
    "js/manage/menus/dcMenuForm",
    "js/common/dcDataTable",
    "js/common/dcPagination"
  ],
  parent: null,
  checkbox: true,
  params: {
    page: 1,
    rowsCount: 10
  }
}

const DochiMenuList = function(config, el){
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

  this.setPage = (v)=>{ datas.page.current = v; }
  this.getPage = ()=>datas.page.current;
  this.setMaxPage = (v)=>{ datas.page.max = v; }
  this.getMazPage = ()=>datas.page.max;
  this.setRowsCount = (v)=>{ datas.page.rowsCount = v; }
  this.getRowsCount = ()=> datas.page.rowsCount;
}

DochiMenuList.prototype = (function(){
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
    const columns = [
      { name: "menu_grp_id", className: "menu_grp_id", label: "메뉴그룹ID" },
      { name: "menu_id", className: "menu_id", label: "메뉴그룹ID", onclick: function(event){console.log(eevnt);} },
      { name: "full_menu", className: "full_menu", label: "메뉴ID" },
      { name: "menu_name", className: "menu_name", label: "메뉴명" },
      { name: "menu_index", className: "menu_index", label: "인덱스" },
      { name: "sort_order", className: "sort_order", label: "정ㄹ렬순서" },
    ];

    const html = `
    <div class="viewer-wrapper">
      <div id="content_search">
        <div class="search-wrapper">
          search
        </div>
      </div>
      <div id="content">
        <div id="content_list" class="content-wrapper">
        </div>
      </div>
      <div id="content_control">
        <div class="control-wrapper row">
          <div class="col s3">
            <div class="support-wrapper">
            </div>
          </div>
          <div class="col s6">
            <div id="pagination" class="pagination-wrapper">
            </div>
          </div>
          <div class="col s3">
            <div class="crud-wrapper">
              <button id="btn_delete_menu">삭제</button>
              <button id="btn_insert_menu">생성</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    self.el.innerHTML = html;
    
    const pagination = document.querySelector("#pagination");
    const dataTable = document.querySelector("#content_list").dcDataTable({
      parent: self,
      url: "/api/manage/menus/menuList",
      params: {
        rowsCount: 2
      },
      data: {
        list: self.getData("list"),
      },
      checkbox: true,
      columns: columns,
      pagination: pagination,
    });
    
    self.setDom("pagination", pagination);
    self.setInst("dataTable", dataTable);
  }
  
  function _initEvent(self){
    const btn_insert_menu = self.el.querySelector("#btn_insert_menu");
    if( btn_insert_menu ){
      btn_insert_menu.addEventListener("click", _handleMenuModal("insert"));
    }

    const btn_update_menu = self.el.querySelectorAll(".content-col.menu_id");
    Array.from(btn_update_menu).forEach(function(btn){
      const data = btn.getAttribute("key");
      btn.addEventListener("click", _handleMenuModal("update", data));
    });
  }

  function _handleMenuModal(saveType, data){
    let options = {
      url: "/tmpl/manage/menus/menuForm"
    }

    if( saveType === "insert" ){
      options.title = "메뉴 등록";
    } else if ( saveType === "update" ){
      options.title = "메뉴 수정";
      /*
      options.data = {
        url: "/manage/menus/save"
        , data: {
          "menu_grp_id": data.split("/")[0]
          , "menu_id": data.split("/")[1]
        }
      }
      */
    }

    return function(event){
      event.preventDefault();
      _openModal(options);
    }
  }
  
  function _openModal(options){
    Object.assign(options, {
      "buttons": [
        {
          "text": "취소",
          "className": "modal-close"
        },
        {
          "text": "저장",
          "className": "modal-save",
          "onclick": _saveMenu
        }
      ]
    });
    Common.modal.openTemplate(options);
  }

  function _saveMenu(event){
    event.preventDefault();
  
    const modal = event.target.closest(".modal");
    const inst = M.Modal.getInstance(modal);
    const form = inst.el.querySelector("form");
    const values = Common.form.getValidValues(form);
    
    if( values.valid ){
      Common.form.save({
        url: "/manage/menus/save",
        data: values.data
      }, function(result, error){
        if( result ){
          inst.close();
        } else {
          alert("error"); 
        }
      });
    }
  }

  return {
    init: function(){
      _init(this);
    }
  }
})();

export default bindElement("dcMenuList", DochiMenuList, initConfig);