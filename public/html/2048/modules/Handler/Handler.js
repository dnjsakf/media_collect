const Handler = function(config){
  const self = this;
  const datas = {}
  const insts = {}
  const doms = {}
  
  self.setConfig = (k,v)=>{ config[k] = v; }
  self.getConfig = (k)=>config[k];
  self.setData = (k,v)=>{ datas[k] = v; }
  self.getData = (k)=>datas[k];
  self.setInst = (k,v)=>{ insts[k] = v; }
  self.getInst = (k)=>insts[k];
  self.setDom = (k,v)=>{ doms[k] = v; }
  self.getDom = (k)=>doms[k];
}

Handler.prototype = (function(){
  function _handleKeyDown(self, board){
    return function(event){
      let vector = null;
      if( event.key === "ArrowUp" ){
        vector = "up";
      } else if( event.key === "ArrowDown" ){
        vector = "down";
      } else if( event.key === "ArrowLeft" ){
        vector = "left";
      } else if( event.key === "ArrowRight" ){
        vector = "right";
      }
      
      if( vector ){
        self.move(vector);
      }
    }
  }
  
  function _handleMouseDrag(self, setting){
    return function(event){
      event.preventDefault();
      
      const lock = self.getData("lock");
      const focusPos = self.getData("focusPos");
      
      if( lock && focusPos ){
        console.log( focusPos.x - event.clientX, focusPos.y - event.clientY );
      }
    }
  }
  
  function _handleMouseDown(self, setting){
    return function(event){
      event.preventDefault();
      self.setData("lock", true);
      self.setData("focusPos", { x: event.clientX, y: event.clientY });
    }
  }
  
  function _handleMouseUp(self, setting){
    return function(event){
      event.preventDefault();
      
      const lock = self.getData("lock");
      const focusPos = self.getData("focusPos");
      
      if( lock && focusPos ){
        const leftAndRight = focusPos.x - event.clientX;
        const upAndDown = event.clientY - focusPos.y;
        
        let vector = null;
        if( Math.abs(upAndDown) > Math.abs(leftAndRight) ){
          if( upAndDown > 0 ){  
            vector = "down";
          } else if ( upAndDown < 0 ) {
            vector = "up";  
          }
        } else if ( Math.abs(upAndDown) < Math.abs(leftAndRight) ){
          if( leftAndRight > 0 ){  
            vector = "left";
          } else if ( leftAndRight < 0 ) {
            vector = "right";  
          }
        }
        
        if( vector ){
          self.move(vector);
        }
      }
      
      self.setData("lock", false);
      self.setData("focusPos", null);
    }
  }

  return {
    handleKeyDown: function(setting){
      return _handleKeyDown(this, setting);
    },
    handleMouseDown: function(status){
      return _handleMouseDown(this, status);
    },
    handleMouseUp: function(status){
      return _handleMouseUp(this, status);
    },
    handleMouseDrag: function(status){
      return _handleMouseDrag(this, status);
    }
  }
})();