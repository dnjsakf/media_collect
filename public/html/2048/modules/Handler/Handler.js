const Handler = function(config){
  const self = this;
  const datas = {}
  const insts = {}
  const doms = {}
  const status = {
    focus: null,
    lock: false
  }
  
  self.setConfig = (k,v)=>{ config[k] = v; }
  self.getConfig = (k)=>config[k];
  self.setData = (k,v)=>{ datas[k] = v; }
  self.getData = (k)=>datas[k];
  self.setInst = (k,v)=>{ insts[k] = v; }
  self.getInst = (k)=>insts[k];
  self.setDom = (k,v)=>{ doms[k] = v; }
  self.getDom = (k)=>doms[k];
  self.setStatus = (k,v)=>{ status[k] = v; }
  self.getStatus = (k)=>status[k];
}

Handler.prototype = (function(){

  function _crossMatrix(matrix, cross, reverse){
    let temp = matrix.map(function(row){
      return row.getInst("cols").map(function(){
        return Array();
      });
    });

    matrix.forEach(function(row, rowIdx){
      let _rowIdx = null;
      let _colIdx = null;
      row.getInst("cols").forEach(function(col, colIdx){
        _rowIdx = cross ? colIdx : rowIdx;
        _colIdx = cross ? rowIdx : colIdx;

        col.setData("index", _colIdx);

        temp[_rowIdx][_colIdx] = col;
      });
    });

    return reverse ? temp.map((row)=>(row.reverse(cross))) : temp ;
  }

  function _calcNumbers(numbers){
    if( numbers && Array.isArray(numbers) && numbers.length > 1 ){
      const storage = [];
      numbers.reduce(function(prev, crnt, _idx){
        let throwNumber = null;
  
        if( prev === crnt ){
          throwNumber = crnt+prev;
        } else {
          storage.push(prev);
          throwNumber = crnt;
        }
        if( _idx === numbers.length -1 ){
          storage.push(throwNumber);
        }
        return throwNumber;
      });
      return storage;
    } else {
      return numbers;
    }
  }

  function _resetMatrix(matrix, cross, reverse){
    const matrixSize = matrix.length;
    const crossedMatrix = _crossMatrix(matrix, cross, reverse);

    crossedMatrix.forEach(function(row){
      const originRow = row;
      const reverseRow = [].concat(row).reverse(cross);
      const numbers = originRow.map(col=>col.getData("number")).filter(number=>!!number);

      let calcNumbers = []
      if( reverse ){
        calcNumbers = _calcNumbers(numbers).reverse(cross);
        calcNumbers = calcNumbers.concat(Array(matrixSize - calcNumbers.length).fill(null));
      } else {
        calcNumbers = _calcNumbers(numbers.reverse(cross)).reverse(cross);
        calcNumbers = Array(matrixSize - calcNumbers.length).fill(null).concat(calcNumbers);
      }

      calcNumbers.forEach(function(number, idx){
        const baseCol = reverse ? reverseRow[idx] : originRow[idx];

        baseCol.appendNumber(number)
      });
    });

    return crossedMatrix;
  }

  function _handleKeyDown(config){
    // Init Config
    return function(event){
      let reverse = false;
      let cross = false;
      
      let moving = null;
      if( event.key === "ArrowUp" ){
        moving = "top";
        reverse = true;
        cross = true;
      } else if( event.key === "ArrowDown" ){
        moving = "down";
        reverse = false;
        cross = true;
      } else if( event.key === "ArrowLeft" ){
        moving = "left";
        reverse = true;
        cross = false;
      } else if( event.key === "ArrowRight" ){
        moving = "right";
        reverse = false;
        cross = false;
      }

      if( moving ){
        const rand = parseInt(Math.random()*6);
        const matrix = config.rows;
        const crossedMatrix = _resetMatrix(matrix, cross, reverse);
        const shuffle = crossedMatrix.filter((_, idx)=>(rand === idx))[0][0];

        shuffle.appendNumber(2);

        matrix.forEach(function(row){
          if( !row.el.classList.contains("move") ){
            row.el.classList.add("move", moving);
            setTimeout(function(){
              row.el.classList.remove("move", moving);
            }, 310);
          }
        });
      }
    }
  }

  function _handleMouseMove(event){
    if( status.focus && status.lock ){
      const focusPos = status.focusPos;

      const focusX = focusPos.x;
      const focusY = focusPos.y;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const moveX = mouseX-focusX;
      const moveY = mouseY-focusY;

      status.focus.style.left = moveX+"px";
      status.focus.style.top = moveY+"px";
    }
  }
  function _handleMouseDown(event){
    event.preventDefault();

    const pos = this.getBoundingClientRect();

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    status.lock = true;
    status.focus = this;
    status.focusPos = {
      x: (mouseX-pos.x),
      y: (mouseY-pos.y)
    }
  }
  
  function _handleMouseUp(event){
    event.preventDefault();
    
    status.lock = false;
    status.focus = null;
    status.focusPos = null;
  }

  return {
    handleKeyDown: function(setting){
      return _handleKeyDown(setting);
    },
    handleMouseDown: function(status){
      if( status ){
        Object.assign(this.status, status);
      }
      return _handleMouseDown;
    },
    handleMouseUp: function(status){
      if( status ){
        Object.assign(this.status, status);
      }
      return _handleMouseUp;
    },
    handleMouseMove: function(status){
      if( status ){
        Object.assign(this.status, status);
      }
      return _handleMouseMove;
    }
  }
})();

Handler.extends = function(obj){
  if( typeof(obj) === 'object' ){
    Object.keys(Handler.prototype).forEach(function(proto){
      if( typeof(obj.__proto__[proto]) === 'undefined' ){
        obj.__proto__[proto] = Handler.prototype[proto];
      }
    });
  }
  return obj;
}