import { bindElement } from '/public/js/common/dcCommon.js'

const initConfig = {
  url: "",
  js: [],
  parent: null,
  pagination: null,
  params: {
    page: 1,
    rowsCount: 10,
  },
  pagesCount: 2,
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

  this.setPage = (v)=>{ config.page.current = v; }
  this.getPage = ()=>config.page.current;
  this.setMaxPage = (v)=>{ config.page.max = v; }
  this.getMazPage = ()=>config.page.max;
  this.setRowsCount = (v)=>{ config.page.rowsCount = v; }
  this.getRowsCount = ()=> config.page.rowsCount;
}

DochiPagination.prototype = (function(){
  function _init(self){
    _initRender(self);
    _renderPages(self, self.getData("current"));
    _initEvent(self);
  }

  function _initRender(self){
    const html = `
    <ul id="pager" class="pagination">
    </ul>
    `;
    self.el.innerHTML = html;

    const pager = document.querySelector("#pager");
    self.setDom("pager", pager);


    self.setConfig("startPage", 1);
  }

  function _renderPages(self, currentPage){
    const pager = self.getDom("pager");

    const pagesCount = self.getConfig("pagesCount");
    const maxPage = self.getData("max");
    const startPage = self.getConfig("startPage") + (( currentPage % (pagesCount + 1) ) == 0 ? pagesCount : 0 );
    const endPage = ( maxPage > startPage + pagesCount - 1 ) ? ( startPage + pagesCount - 1 ) : maxPage;

    self.setConfig("startPage", startPage);
    console.log( currentPage, currentPage % (pagesCount+1),  startPage, endPage );

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
    const li = document.createElement("li");
    const a = document.createElement("a");
    const icon = document.createElement("icon");
  
    li.className = self.getData("current") === 1 ? "disabled" : "waves-effect";
    if( data && data.href ){
      a.setAttribute("href", data.href);
    }
    icon.className = "material-icons";
    icon.appendChild(document.createTextNode("chevron_left"));

    a.addEventListener("click", _handlePrevPage(self));
    a.appendChild(icon);
    li.appendChild(a);

    return li;
  }

  function _renderChevronRight(self, data){
    const li = document.createElement("li");
    const a = document.createElement("a");
    const icon = document.createElement("icon");

    li.className = self.getData("current") === self.getData("max") ? "disabled" : "waves-effect";
    if( data && data.href ){
      a.setAttribute("href", data.href);
    }
    icon.className = "material-icons";
    icon.appendChild(document.createTextNode("chevron_right"));

    a.addEventListener("click", _handleNextPage(self));
    a.appendChild(icon);
    li.appendChild(a);

    return li;
  }

  function _handleChangePage(self){
    const dataTable = self.getConfig("parent");

    return function(event){
      event.preventDefault();
      
      const page = Number(event.target.text);
      const url = dataTable.getConfig("url");

      const response = axios({
        method: "GET",
        url: [url,page].join("/"),
        params: {
          rowsCount: self.getData("rowsCount"),
          
        }
      }).then(function(result){
        const data = result.data.payload.list;
        const pageInfo = result.data.payload.page;

        console.log( pageInfo );

        self.setDatas(pageInfo);

        _renderPages(self, page)
        dataTable.reload(data);

      }).catch(function(error){
        console.error(error);
      });
    }
  }

  function _handlePrevPage(self){
    const dataTable = self.getConfig("parent");

    return function(event){
      event.preventDefault();
      
      let page = Number(self.getData("current"));
      if( page > 1 ){
        page -= 1;
      }
      const url = dataTable.getConfig("url");

      const response = axios({
        method: "GET",
        url: [url,page].join("/"),
        params: {
          rowsCount: self.getData("rowsCount"),
          
        }
      }).then(function(result){
        const data = result.data.payload.list;
        const pageInfo = result.data.payload.page;

        self.setDatas(pageInfo);

        _renderPages(self, page)
        dataTable.reload(data);

      }).catch(function(error){
        console.error(error);
      });
    }
  }

  function _handleNextPage(self){
    const dataTable = self.getConfig("parent");

    return function(event){
      event.preventDefault();
      
      let page = Number(self.getData("current"));
      if( page < self.getData("max") ){
        page += 1;
      }
      const url = dataTable.getConfig("url");

      const response = axios({
        method: "GET",
        url: [url,page].join("/"),
        params: {
          rowsCount: self.getData("rowsCount"),
          
        }
      }).then(function(result){
        const pageInfo = result.data.payload.page;
        const data = result.data.payload.list;

        self.setDatas(pageInfo);

        _renderPages(self, page)
        dataTable.reload(data);

      }).catch(function(error){
        console.error(error);
      });
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
      _renderPages(this, page)
    }
  }
})();

export default bindElement("dcPagination", DochiPagination, initConfig);