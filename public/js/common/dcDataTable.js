import { bindElement } from '/public/js/common/dcCommon.js'

const initConfig = {
  url: "",
  js: [
    "js/common/dcPagination"
  ],
  parent: null,
  checkbox: true,
  rowsCount: 10,
  pagesCount: 10,
}

const DochiDataTable = function(config, el){
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

DochiDataTable.prototype = (function(){
  function _validateModule(self){
    let valid = true;

    return valid;
  }
  
  function _init(self){
    self.setConfig("params", {
      rowsCount: self.getConfig("rowsCount")
    });

    if( _validateModule(self) ){
      self.initData(function(res){
        if( res.success ){
          if( res.data ){
            self.setDatas(res.data);
          }
          _initRender(self);
          _renderTable(self, res.data.list);
        } else {
          console.error(res.error);
        }
      });
    }
  }

  function _initRender(self){
    const html = `
    <table id="content_table" class="highlight striped">
    </table>
    `;
    self.el.innerHTML = html;

    const table = document.querySelector("#content_table");
    self.setDom("table", table);

    const pagination = self.getConfig("pagination");
    if( pagination ){
      const pager = pagination.dcPagination({
        parent: self,
        url: self.getConfig("url"),
        data: self.getData("page"),
        rowsCount: self.getConfig("rowsCount"),
        pagesCount: self.getConfig("pagesCount"),
      });
      self.setInst("pager", pager);
    }
  }
  
  function _renderTable(self, data){
    const table = self.getDom("table");
    const thead = _rednerTableHead(self);
    const tbody = _renderTableBody(self, data);

    Array.from(table.children).forEach(el=>el.remove());

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  function _rednerTableHead(self){
    const columns = self.getConfig("columns");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    // 초기화
    Array.from(thead.children).forEach(el=>el.remove());

    // 전체선택 Checkbox
    const checkbox = self.getConfig("checkbox");
    if( checkbox ){
      const checkbox = _renderCheckBox(self, "select_all", null);
      const th_checkbox = document.createElement("th");

      th_checkbox.className = "content-sel";
      th_checkbox.appendChild(checkbox);

      tr.appendChild(th_checkbox);
    }

    // column 설정
    columns.forEach(function(column){
      const th = document.createElement("th");

      if( column.className ){
        th.className = `${column.className}`;  
      }
      if( column.name ){
        th.classList.add( column.name );
      }
      if( column.label ){
        th.appendChild(document.createTextNode(column.label));
      }
      
      tr.appendChild(th);
    });

    thead.appendChild(tr);

    return thead;
  }

  function _renderCheckBox(self, name, value){
    const checkbox = document.createElement("input");
      
    checkbox.type = "checkbox";
    checkbox.id = name;
    checkbox.name = name;
    checkbox.value = value;

    return checkbox;
  }

  function _renderTableBody(self, datas){
    const tbody = document.createElement("tbody");

    // 초기화
    Array.from(tbody.children).forEach(el=>el.remove());

    datas.forEach(function(data){
      const tr = _renderRow(self, data);
      tbody.appendChild(tr);
    });

    return tbody;
  }

  function _renderRow(self, data){
    const columns = self.getConfig("columns");
    const tr = document.createElement("tr");

    // 선택 Checkbox
    const checkbox = self.getConfig("checkbox");
    if( checkbox ){
      const checkbox = _renderCheckBox(self, "select_one", data.menu_id);
      const td_checkbox = document.createElement("td");

      td_checkbox.className = "content-sel";
      td_checkbox.appendChild(checkbox);

      tr.appendChild(td_checkbox);
    }

    columns.forEach(function(column){
      const td = document.createElement("td");

      if( column.className ){
        td.className = `content-col ${column.className}`;  
      }
      td.classList.add( column.name );

      td.appendChild(document.createTextNode(data[column.name]));
      tr.appendChild(td); 
    });

    return tr;
  }

  function _reload(self, url){
    const resopnse = axios({
      method: "GET",
      url: url,
      params: {
        rowsCount: self.getConfig("rowsCount"),
      }
    }).then(function(result){
      const data = result.data.payload.list;
      
      _renderTable(self, data);
    }).catch(function(error){
      console.error(error);
    });
  }
  
  function _initEvent(self){
    
  }
  
  return {
    init: function(){
      _init(this);
    }, reload: function(url){
      _reload(this, url);
    }
  }
})();

export default bindElement("dcDataTable", DochiDataTable, initConfig);