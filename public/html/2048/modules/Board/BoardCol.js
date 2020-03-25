const BoardCol = function(_config, el){
  const self = this;
  const datas = {}
  const insts = {}
  const doms = {}
  const config = _config;
  
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

BoardCol.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    if( !self.getConfig("index") ){
      console.error("Invalid index option.", self.getConfig("index"));
      return false;
    }
    
    if( !self.getConfig("size") ){
      console.error("Invalid size option.", self.getConfig("size"));
      return false;
    }
    
    return valid;
  }
  
  function _initData(self){
  
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    const pIndex = self.getConfig("parent").getConfig("index")
    const index = self.getConfig("index");
    const size = self.getConfig("size");
    
    self.el.className = `pannel col r${pIndex} c${index} w${size.width} h${size.height} blank`;
    self.el.style.left = ((size.width*(index-1))+(5*index))+"px";
    self.el.style.top = ((size.height*(pIndex-1))+(5*pIndex))+"px";
    self.el.style.paddingTop = (parseInt(size.height/2)-15)+"px"

    self.setData("index", index);
    self.setData("pIndex", pIndex);
  }
  
  function _initEvent(self){
    const col = self.el;

    col.addEventListener("mousedown", self.handleMouseDown());
    col.addEventListener("mouseup", self.handleMouseUp());
  }

  function _appendNumber(self, number){
    Array.from(self.el.children).forEach(children=>children.remove());
    self.el.style.removeProperty("background-color");

    if( number ){
      const a = document.createElement("a");
      const text = document.createTextNode(number);
      a.appendChild(text);
  
      if( self.el.classList.contains("blank") ){
        self.el.classList.remove("blank");
      }
      self.el.style.backgroundColor = `rgba(144,80,100,0.${number})`;
      self.el.appendChild(a);
    }
    self.setData("number", number);
  }

  function _removeNumber(self){
    Array.from(self.el.children).forEach(children=>children.remove());
    self.el.classList.add("blank");
    self.el.style.removeProperty("background-color");
    self.setData("number", null);
  }

  function _move(self, moving){
    if( moving === "up" ){

    } else if ( moving === "down" ){

    } else if ( moving === "left" ){

    } else if ( moving === "right"){
      
    }
  }

  return {
    init: function(){
      _init(this);
    }, move: function(moving){
      _move(this, moving);
    }, appendNumber: function(number){
      _appendNumber(this, number);
    }, removeNumber: function(){
      _removeNumber(this);
    }
  }
})();

Common.bindElement(BoardCol, {
  parent: null,
  index: null,
  size: {
    width: 100,
    height: 100
  }
});