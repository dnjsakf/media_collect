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
  
  /**
   * Table 렌더링
   */
  function _renderTable(self, data){
    const table = self.getDom("table");
    const thead = _rednerTableHead(self);
    const tbody = _renderTableBody(self, data);

    Array.from(table.children).forEach(el=>el.remove());

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  /**
   * Thead 렌더링
   */
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

    columns.forEach(function(column){
      const th = _renderTableHeadCell(self, column);
      tr.appendChild(th);
    });

    thead.appendChild(tr);

    return thead;
  }

  /**
   * Table Head Cell 렌더링
   */
  function _renderTableHeadCell(self, data){
    const cell = document.createElement("th");

    if( data.className ){
      cell.className = `${data.className}`;  
    }
    if( data.name ){
      cell.classList.add( data.name );
    }
    if( data.label ){
      cell.appendChild(document.createTextNode(data.label));
    }

    return cell;
  }

  /**
   * Table Body 렌더링
   */
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

  /**
   * Checkbox 렌더링
   */
  function _renderCheckBox(self, name, value){
    const checkbox = document.createElement("input");
      
    checkbox.type = "checkbox";
    checkbox.id = name;
    checkbox.name = name;
    checkbox.value = value;

    return checkbox;
  }

  /**
   * Table Row 렌더링
   */
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
      const td = _renderTableCell(self, column, data);
      tr.appendChild(td);
    });

    return tr;
  }

  /**
   * Table Cell 렌더링
   */
  function _renderTableCell(self, column, data){
    const cell = document.createElement("td");

    if( column.className ){
      cell.className = `content-col ${column.className}`;  
    }
    cell.classList.add(column.name);

    let text = null;
    if( column.onclick ){
      text = document.createElement("a");
      text.onclick = column.onclick(data.menu_grp_id, data.menu_id);
      text.appendChild(document.createTextNode(data[column.name]));
    } else {
      text = document.createTextNode(data[column.name]);
    }

    cell.appendChild(text);
    
    return cell;
  }

  /**
   * Reload Data
   */
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
      if( !url ){
        url = this.getConfig("url");
      }
      _reload(this, url);
    }
  }
})();

export default bindElement("dcDataTable", DochiDataTable, initConfig);