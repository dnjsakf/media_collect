// import Handler from './modules/Handler/Handler.js'

const Board = function(config, el){
  const self = this;
  const datas = {}
  const insts = {}
  const doms = {}
  
  self.el = el;
  
  self.setConfig = (k,v)=>{ config[k] = v; }
  self.getConfig = (k)=>config[k];      
  self.setData = (k,v)=>{ datas[k] = v; }
  self.getData = (k)=>datas[k];
  self.setInst = (k,v)=>{ insts[k] = v; }
  self.getInst = (k)=>insts[k];
  self.setDom = (k,v)=>{ doms[k] = v; }
  self.getDom = (k)=>doms[k];

  Common.extends.bind(self)([Handler]);
}

Board.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    const size = self.getConfig("size");
    if( !size ){
      console.error("Invalid size option.", size);
      return false;
    }
    
    return valid;
  }
  
  function _initData(self){
    const size = self.getConfig("size");
    if( size ){
      const matrixMapping = {
        "small": { rows: 3, cols: 3 },
        "medium": { rows: 6, cols: 6 },
        "large": { rows: 9, cols: 9 }
      }
      const boxSizeMapping = {
        "small": { width: 150, height: 150 },
        "medium": { width: 75, height: 75 },
        "large": { width: 50, height: 50 }
      }
      self.setData("matrix", matrixMapping[size]);
      self.setData("boxSize", boxSizeMapping[size]);
    }
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    if( self.el.children ){
      Array.from(self.el.children).forEach(children=>children.remove());
    }
  
    let cols = []
    const matrix = self.getData("matrix");
    const rows = Array(matrix.rows).fill(1).map(function(rowInc, rowIdx){
      const rowIndex = rowIdx+rowInc;
      const row = document.createElement("div").BoardRow({
        parent: self.el,
        index: rowIndex,
        id: "r"+rowIndex
      });
      
      const _cols = Array(matrix.cols).fill(1).map(function(colInc, colIdx){
        const colIndex = colIdx+colInc;
        const col = document.createElement("div").BoardCol({
          parent: row,
          index: colIndex,
          id: "c"+colIndex,
          size: self.getData("boxSize")
        });

        if( rowIndex === 1 && colIndex === 1 ){
          col.appendNumber(1);
        }

        if( rowIndex === 2 && colIndex === 1 ){
          col.appendNumber(1);
        }
        if( rowIndex === 2 && colIndex === 6 ){
          col.appendNumber(2);
        }
        if( rowIndex === 3 && colIndex === 1 ){
          col.appendNumber(1);
        }
        if( rowIndex === 3 && colIndex === 5 ){
          col.appendNumber(1);
        }
        if( rowIndex === 3 && colIndex === 6 ){
          col.appendNumber(2);
        }

        return col;
      });
      
      row.setCols(_cols);
      cols.push(_cols);
      
      return row;
    });

    if( cols ){
      self.setInst("cols", cols);
    }

    if( rows && Array.isArray(rows) ){
      self.setInst("rows", rows);
      rows.forEach(function(row){
        self.el.appendChild(row.el);
      });
    }
  }

  function _initEvent(self){
    const handleKeyDown = self.handleKeyDown({
      rows: self.getInst("rows"),
      cols: self.getInst("cols"),
      matrix: self.getData("matrix").rows,
    });

    Common.event.unbind(document, "keydown", handleKeyDown);
    Common.event.bind(document, "keydown", handleKeyDown);
  }

  return {
    init: function(){
      _init(this);
    }
  }
})();

Common.bindElement(Board, {
  parent: null,
  size: "medium"
});