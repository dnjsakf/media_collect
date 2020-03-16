import { bindElement } from '/public/js/common/dcCommon.js'

const initConfig = {
  url: "",
  js: [],
  parent: null,
  pagination: null,
  params: {
    page: 1
  },
  pagesCount: 10,
  rowsCount: 10,
  events: {}
}

const DochiPagination = function(config, el){
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

DochiPagination.prototype = (function(){
  function _validateModule(self){
    let valid = true;

    return valid;
  }

  function _init(self){
    const pagesCount = self.getConfig("pagesCount");
    const maxPage = self.getData("maxPage");
    const startPage = 1;
    const endPage = pagesCount >= maxPage ? maxPage : pagesCount;
    
    self.setData("startPage", startPage);
    self.setData("endPage", endPage);

    if( _validateModule(self) ){
      _initRender(self);
      _renderPages(self, self.getData("currentPage"));
      _initEvent(self);
    }
  }

  function _initRender(self){
    const html = `
    <ul id="pager" class="pagination">
    </ul>
    `;
    self.el.innerHTML = html;

    const pager = document.querySelector("#pager");
    self.setDom("pager", pager);
  }

  function _renderPages(self, currentPage){
    const pager = self.getDom("pager");

    const startPage = self.getData("startPage");
    const endPage = self.getData("endPage");

    const li_left = _renderChevronLeft(self);
    const li_right = _renderChevronRight(self);

    Array.from(pager.children).forEach(el=>el.remove());

    pager.appendChild(li_left);
    for(let page=startPage; page<=endPage; page++){
      const li_page = _rednerPage(self, page, page === currentPage);
      pager.appendChild( li_page );
    }
    pager.appendChild(li_right);
  }

  function _rednerPage(self, page, isActive){
    const url = self.getConfig("url");
    const li = document.createElement("li");
    const a = document.createElement("a");

    li.className = "page-num " + (isActive ? "active" : "waves-effect");
    a.setAttribute("href", [url, page].join("/"));
    a.addEventListener("click", _handleChangePage(self));

    a.appendChild(document.createTextNode(page));
    li.appendChild(a);

    return li;
  }
  
  function _renderChevronLeft(self, data){
    const isFirst = self.getData("currentPage") === 1;
    const li = document.createElement("li");
    const a = document.createElement("a");
    const icon = document.createElement("icon");
  
    li.className = isFirst ? "disabled" : "waves-effect";

    icon.className = "material-icons";
    icon.appendChild(document.createTextNode("chevron_left"));

    if( data && data.href ){
      a.setAttribute("href", data.href);
    }
    if( !isFirst ){
      a.addEventListener("click", _handlePrevPage(self));
    }
    a.appendChild(icon);

    li.appendChild(a);

    return li;
  }

  function _renderChevronRight(self, data){
    const isLast = self.getData("currentPage") === self.getData("maxPage");
    const li = document.createElement("li");
    const a = document.createElement("a");
    const icon = document.createElement("icon");

    li.className = isLast ? "disabled" : "waves-effect";
    icon.className = "material-icons";
    icon.appendChild(document.createTextNode("chevron_right"));

    if( data && data.href ){
      a.setAttribute("href", data.href);
    }
    if( !isLast ){
      a.addEventListener("click", _handleNextPage(self));
    }
    a.appendChild(icon);

    li.appendChild(a);

    return li;
  }

  function _changePage(self, page){
    const dataTable = self.getConfig("parent");
    const url = [dataTable.getConfig("url"), page].join("/");
    
    self.setData("currentPage", page);

    _renderPages(self, page);

    dataTable.reload(url);
  }

  function _handleChangePage(self){
    return function(event){
      event.preventDefault();
      let page = Number(event.target.text);
      
      _changePage(self, page);
    }
  }

  function _handlePrevPage(self){
    return function(event){
      event.preventDefault();

      const prevPage = Number(self.getData("currentPage"))-1;
      const pagesCount = self.getConfig("pagesCount");

      const maxPage = self.getData("maxPage");
      let startPage = self.getData("startPage");
      let endPage = self.getData("endPage");

      startPage = prevPage < startPage ? startPage - pagesCount : startPage;
      endPage = startPage - pagesCount <= startPage ? startPage + pagesCount - 1 : endPage;
      if( endPage >= maxPage ){
        endPage = maxPage;
      }

      self.setData("startPage", startPage);
      self.setData("endPage", endPage);
  
      _changePage(self, prevPage);
    }
  }

  function _handleNextPage(self){
    return function(event){
      event.preventDefault();

      const nextPage = Number(self.getData("currentPage"))+1;
      const pagesCount = self.getConfig("pagesCount");
      const maxPage = self.getData("maxPage");

      let startPage = self.getData("startPage");
      let endPage = self.getData("endPage");

      startPage = nextPage > endPage ? startPage + pagesCount : startPage;
      if( startPage <= 1 ){
        startPage = 1;
      }
      endPage = startPage + pagesCount >= maxPage ? maxPage : startPage + pagesCount - 1;

      self.setData("startPage", startPage);
      self.setData("endPage", endPage);

      _changePage(self, nextPage);
    }
  }
  
  function _initEvent(self){
    const pagination = self.getInst("pagination");

  }
  
  return {
    init: function(){
      _init(this);
    },
    changePage: function(page){
      _changePage(this, page);
    },
    setPageInfo: function(pageInfo){
      this.setData("currentPage", 1);
      this.setData("total", pageInfo.total);
      this.setData("maxPage", pageInfo.maxPage);
      this.setData("startPage", 1);
      this.setData("endPage", this.getConfig("pagesCount"));
    }
  }
})();

export default bindElement("dcPagination", DochiPagination, initConfig);