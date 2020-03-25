const Common = function(){}

Common.prototype = (function(){
  return {
    test: function(){
      console.log( 'test' );
    }
  }
})();

Common.event = (function(){
  bindings = [];

  function _bind(el, action, event, args){
    const binded = bindings.filter(function(binding){
      return binding.target === el && binding.action === action;
    });
    if( binded.length === 0 ){
      el.addEventListener(action, event, true);
      bindings.push({
        target: el,
        action: action,
        event: event,
        args: args
      });
    }
  }

  function _unbind(el, action){
    const binded = bindings.filter(function(binding){
      return binding.target === el && binding.action === action;
    });
    if( binded && binded.length > 0 ){
      const _binded = binded[0];
      _binded.target.removeEventListener(_binded.action, _binded.event, true);
      bindings = bindings.filter(function(binding){
        return JSON.stringify(binding) !== JSON.stringify(_binded)
      });
    }
  }

  return {
    bind: function(el, action, event, args){
      _bind(el, action, event, args)
    },
    unbind: function(el, action){
      _unbind(el, action);
    }
  }
})();

Element.prototype.bindings = [];
Element.prototype.bindEvent = function(action, event, args){
  const el = this;
  const binded = el.bindings.filter(function(binding){
    return binding.target === el && binding.action === action;
  });
  if( binded.length === 0 ){
    el.addEventListener(action, event, true);
    el.bindings.push({
      target: el,
      action: action,
      event: event,
      args: args
    });
  }
}
Element.prototype.unbindEvent = function(action){
  const el = this;
  const binded = el.bindings.filter(function(binding){
    return binding.target === el && binding.action === action;
  });
  if( binded && binded.length > 0 ){
    const _binded = binded[0];
    _binded.target.removeEventListener(_binded.action, _binded.event, true);
    el.bindings = el.bindings.filter(function(binding){
      return JSON.stringify(binding) !== JSON.stringify(_binded)
    });
  }
}

Common.extends = function(funcs, setting){
  const self = this;
  function _load(func){
    if( typeof(func) === 'function' ){
      const obj = new func(setting);
      Object.keys(obj.__proto__).forEach(function(proto){
        if( typeof(self.__proto__[proto]) === 'undefined' ){
          
          self.__proto__[proto] = obj.__proto__[proto]
        }
      });
    }
  }
  if(funcs && Array.isArray(funcs)){
    funcs.forEach(function(func, idx){
      let _setting = null;
      if( setting && Array.isArray(setting) ){
        try {
          _setting = setting[idx];
        } catch {}
      }
      _load(func, _setting);
    });
  } else {
    _load(funcs, setting);
  }
}

Common.bindElement = function(func, initConfig){
  Element.prototype[func.name] = function(setting){
    const config = initConfig;

    if( setting ){
      Object.assign(config, setting);
    }

    // const obj = Common.extends(new func(config, this));
    const obj = new func(config, this);

    obj.init();

    return obj;
  }
}