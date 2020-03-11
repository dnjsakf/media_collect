Element.prototype.dcMenuList = function(setting){
  let config = {
    url: "",
    js: [
      "js/manage/menus/dcMenuForm",
      "js/common/dcDataTable"
    ],
    parent: null,
    checkbox: true
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
  let datas = {}
  let insts = {}
  
  this.el = el;
  this.setConfig = (k,v)=>{ config[k] = v }
  this.getConfig = (k)=>config[k]
  this.setData = (k,v)=>{ datas[k] = v }
  this.setDatas = (v)=>{ datas=v }
  this.getData = (k)=>datas[k]
  this.getDatas = ()=>datas
  this.setInst = (k,v)=>{ insts[k] = v }
  this.getInst = (k)=>insts[k]
  this.getInsts = ()=>insts
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
    const html = `
    <div class="viewer-wrapper">
      <div id="content_search">
        <div class="search-wrapper">
          search
        </div>
      </div>
      <div id="content">
        <div class="content-wrapper">
          <table id="content_table" class="highlight striped">
          </table>
        </div>
      </div>
      <div id="content_control">
        <div class="control-wrapper row">
          <div class="col s3">
            <div class="support-wrapper">
            </div>
          </div>
          <div class="col s6">
            <div class="pagination-wrapper">
              <ul id="pagination" class="pagination">
                <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                <li class="active"><a href="#!">1</a></li>
                <li class="waves-effect"><a href="#!">2</a></li>
                <li class="waves-effect"><a href="#!">3</a></li>
                <li class="waves-effect"><a href="#!">4</a></li>
                <li class="waves-effect"><a href="#!">5</a></li>
                <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
              </ul>
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

    const table = document.querySelector("#content_table");
    const pagination = document.querySelector("#pagination");

    self.setInst("table", table);
    self.setInst("pagination", pagination);
    
    table.dcDataTable({
      url: "/api/manage/menus/menuList",
      checkbox: true
    });
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
      options.data = {
        url: "/manage/menus/save"
        , data: {
          "menu_grp_id": data.split("/")[0]
          , "menu_id": data.split("/")[1]
        }
      }
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