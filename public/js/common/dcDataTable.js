Element.prototype.dcDataTable = function(setting){
  let config = {
    url: ""
    , js: [
    ],
    parent: null,
    checkbox: true
  }
  
  if( setting ){
    Object.assign(config, setting);
  }
  
  const p = new DochiDataTable(config, this);
  Common.extends(p);
  p.init();
  
  return p;
}

const DochiDataTable = function(config, el){
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

DochiDataTable.prototype = (function(){
  function _init(self){
    self.initData(function(res){
      if( res.success ){
        if( res.data ){
          self.setDatas(res.data);
        }
        _initRender(self);
      } else {
        console.error( res.error );
      }
    });
  }

  function _initRender(self){
    const headers = self.getData("headers");
    const data = self.getData("list");

    const thead = _rednerTableHead(self, headers);
    const tbody = _renderTableBody(self, headers, data);

    self.el.appendChild(thead);
    self.el.appendChild(tbody);
  }

  function _rednerTableHead(self, headers){
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    // 초기화
    Array.from(thead.children).forEach(el=>el.remove);

    // 전체선택 Checkbox
    const checkbox = self.getConfig("checkbox");
    if( checkbox ){
      const checkbox = _renderCheckBox(self, "select_all", null);
      const th_checkbox = document.createElement("th");

      th_checkbox.className = "content-sel";
      th_checkbox.appendChild(checkbox);

      tr.appendChild(th_checkbox);
    }

    // Header 설정
    headers.forEach(function(header){
      const th = document.createElement("th");
      th.className = `${header}`;
      th.appendChild(document.createTextNode(header));
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

  function _renderTableBody(self, headers, datas){
    const tbody = document.createElement("tbody");

    // 초기화
    Array.from(tbody.children).forEach(el=>el.remove);

    datas.forEach(function(data){
      const tr = _renderRow(self, headers, data);
      tbody.appendChild(tr);
    });

    return tbody;
  }

  function _renderRow(self, headers, data){
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

    headers.forEach(function(header){
      const td = document.createElement("td");
      td.className = `content-col ${header}`;
      td.appendChild(document.createTextNode(data[header]));
      tr.appendChild(td); 
    });

    return tr;
  }
  
  function _initEvent(self){
    
  }
  
  return {
    init: function(){
      _init(this);
    }
  }
})();