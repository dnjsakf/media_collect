const Common = function(){
  this.baseurl = "http://localhost:3000/"
}

Common.prototype = (function(){
  function _initData(self, callback){
    const js = self.getConfig('js');
    const load = _loadJavaScript(self, js);

    load.then(function(result){
      const url = self.getConfig("url");
      if( url ){
        const config = {
          method: "GET",
          url: url,
          baseurl: self.baseurl,
          data: self.getConfig("data") || null,
          params: self.getConfig("params") || null
        }
        axios(config).then(function(response){
          callback({
            success: response.data.success,
            data: response.data.success ? response.data.payload : null,
            error: null
          });
        }).catch(function(error){
          callback({
            success: false,
            data: null,
            error: error
          });
        })
      } else {
        callback({
          success: true,
          data: null,
          error: null
        });
      }
    });
  }

  function _initLoad(self, callback){
    const url = self.getConfig("url");
    const js = self.getConfig("js");
    
    _loadTemplates(self, url, function(success){
      if( success ){
        _loadJavaScript(self, js).then(callback);
      }
    });
  }
  
  function _loadTemplates(self, url, callabck){
    return axios({
      method: "GET"
      , url: url
      , baseurl: "http://localhost:3000"
      , headers: {
        "Content-Type": "text/html"
      }
    }).then(function(result){
      self.el.innerHTML = result.data.html;
      callabck(true);
    }).catch(function(error){
      console.error( error );
      callabck(false);
    });
  }

  function _loadJavaScript(self, urls){
    return Promise.all(
      urls.map(function(_url){
        return import("/public/"+_url+".js").then(function(module){
          //console.log( module.default );
        })
      })
    );
  }
  
  function _loadJavaScript2(self, urls){
    return new Promise(function(resolve, reject){
      if( urls && Array.isArray( urls ) ){
        const request_import = urls.map(function(_url){
          const url = "/public/"+_url+".js";
          const script = document.querySelector('script[src="'+url+'"]');
          if( !script ){
            return axios({
              method: "GET"
              , url: url
              , baseurl: "http://localhost:3000/"
              , headers: {
                "Content-Type": "text/html"
              }
            });
          }
        });
  
        Promise.all(request_import).then(function(imports){
          Promise.all(imports.map(function(result){
            return new Promise(function(_resolve, _reject){
              const head = document.querySelector("head");
              const script = document.createElement("script");
              script.src = result.config.url;
              script.text = result.data;
              script.onload = function(){
                _resolve(true);
              }
              head.appendChild(script);
            });
          })).then(function(result){
            resolve(result);
          }).catch(function(error){
            reject(error);
          });
        }).catch(function(error){
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }
  
  return {
    initData: function(callback){
      return _initData(this, callback);
    }, 
    initLoad: function(callback){
      return _initLoad(this, callback);
    },
    loadTemplates: function(url){
      return _loadTemplates(this, url);
    },
    loadJavaScript: function(urls){
      return _loadJavaScript(this, urls);
    },
    openModal: function(options){
      return _openModal(self, options);
    },
    lazyLoaded: function(query, callback){
      let el = document.querySelector(query);
      if( el ){
        callback(el);
      } else {
        let interval = setInterval(function(){
          el = document.querySelector(query);
          if(el){
            clearInterval(interval);
            callback(el);
          }
        }, 100);
      }
    }
  }
})();

Common.extendsModule = function(source, target){
  for(let key in source.prototype ){
    if( typeof source.prototype[key] === 'function' ){
      if( typeof target.__proto__[key] === 'undefined' ){
        target.__proto__[key] = source.prototype[key];
      }
    }
  }
}

Common.modal = (function(){
  const DEFAULT_CONFIG = {
    "onOpenEnd": function(event){
      M.updateTextFields();
    },
    "onCloseEnd": function(event){
      this.destroy();
      this.el.remove();
    },
    "startingTop": "5%",
    "endingTop": "5%"
  }

  async function _open(options){
    const modal = await axios({
      method: "GET"
      , url: options.url
      , baseurl: "http://localhost:3000/"
      , params: options.params || {}
      , headers: {
        "Content-Type": "application/json"
      }
    }).then(function(result){
      options.data = result.data.payload.data;

      const _modal = _makeModal(options);
      if( _modal ){
        _modal.open();
      }
      return _modal;
    }).catch(function(error){
      console.error(error);
      return _null;
    });
    return modal;
  }

  function _openHTML(options, html){
    return new Promise(function(resolve, reject){
      const modal = _makeModal(options, html);
      if( modal ){
        modal.open();
      }
      resolve(modal);
    });
  }
  
  function _openTmeplate(options){
    return new Promise(function(resolve, reject){
      const response = axios({
        method: "GET"
        , url: options.url
        , baseurl: "http://localhost:3000/"
        , params: options.params || {}
        , headers: {
          "Content-Type": "text/html"
        }
      }).then(function(result){
        const modal = _makeModal(options, result.data.html);
        if( modal ){
          modal.open();
        }
        resolve(modal);
      }).catch(function(error){
        console.error( error );
      });
    });
  }
  
  function _makeModal(options, html){
    const body = document.querySelector("body");
    const modal = document.createElement("div");
    const modal_header = _renderModalHeader(options);
    const modal_content = _rednerModalContent(options, html);
    const modal_footer = _renderModalFooter(options);
    
    modal.className = "modal modal-fixed-header modal-fixed-footer";

    modal.appendChild(modal_header);
    modal.appendChild(modal_content);
    modal.appendChild(modal_footer);
    
    body.appendChild(modal);
    
    if( !options.config ){
      options.config = DEFAULT_CONFIG
    }

    if( options.data ){
      options.config["onOpenStart"] = function(event){
        const inputs = modal_content.querySelectorAll("input, select");
        Array.from(inputs).forEach(function(input){
          const data = options.data[input.name];
          if( data ){
            input.value = data;
          }
        });
      }
    }
    
    return M.Modal.init(modal, options.config);
  }

  function _renderModalHeader(options){
    const modal_header = document.createElement("div");
    modal_header.className = "modal-header";
    
    const modal_header_text = document.createElement("a");
    modal_header_text.className = "btn-flat";
    modal_header_text.appendChild(document.createTextNode(options.title));
    
    modal_header.appendChild(modal_header_text);

    return modal_header;
  }

  function _rednerModalContent(options, html){
    const modal_content = document.createElement("div");
    modal_content.className = "modal-content";
    
    if( html ){
      modal_content.innerHTML = html;
    } else {
      modal_content.dcMenuForm();
    }

    return modal_content;
  }

  function _renderModalFooter(options){
    const modal_footer = document.createElement("div");
    modal_footer.className = "modal-footer";
    
    if( options.buttons ){
      options.buttons.forEach(function(btn_option){
        let button = _renderModalButton(btn_option);
        modal_footer.appendChild(button);
      });
    }

    return modal_footer;
  }

  function _renderModalButton(option){
    const button = document.createElement("a");
    
    button.className = "waves-effect waves-green btn-flat";
    if( option.id ){
      button.id = option.id;
    }
    if( option.className ){
      button.classList.add(option.className);
    }
    if( option.onclick ){
      button.addEventListener("click", option.onclick);
    }
    button.appendChild(document.createTextNode(option.label));
    
    return button;
  }
  
  return {
    open: function(options){
      return _open(options);
    },
    openHTML: function(options, html){
      return _openHTML(options, html);
    },
    openTemplate: function(options){
      return _openTmeplate(options);
    }
  }
})();


Common.form = (function(){
  function _getValues(self, form){
    return Array.from(form.querySelectorAll("input, select"))
      .filter(input=>!input.classList.contains("unused"))
      .map(input=>({
        name: input.name 
        , value: input.value
        , required: input.classList.contains("validate")
        , el: input
      }));
  }

  function _clear(self, form){
    const inputs = form.querySelectorAll("input, select");
    Array.from(inputs).forEach(function(input, idx){
      input.classList.remove("valid", "invalid");
      if( input.type == "text" ){
        input.value = "";
      } else if ( input.type == "select-one" ){
        const first_option = input.querySelectorAll("option");
        if( first_option && first_option.length > 0 ){
          Array.from(first_option).forEach(function(option, idx){
            option.selected = (idx === 0);
          })
        }
      }
      if( idx === 0 ){
        input.focus();
      }
    });
  }

  function _getValidValues(self, form){
    let invalid = null;
    let values = _getValues(self, form).map(function(data){
      data.el.classList.remove("valid", "invalid");
      if( data.required && !data.value ){
        console.log( data.el );
        data.el.classList.add("invalid");
        if( invalid == null ){
          invalid = data.el;
        }
      } else {
        data.el.classList.add("valid");
      }
      return data;
    });

    console.log( values );
  
    if( invalid == null ){
      values = values.reduce(function(prev, crnt, idx){
        if( idx === 1 ){
          let _temp = {}
          _temp[prev.name] = prev.value;
          prev = _temp;
        }
        prev[crnt.name] = crnt.value;
        return prev;
      });
    } else {
      invalid.focus();
    }
  
    return {
      valid: invalid == null
      , data: invalid == null ? values : null
    }
  }
  function _save(self, config, callback){
    axios({
      method: "POST"
      , url: config.url
      , data: config.data
      , baseurl: "http://localhost:3000/"
      , headers: {
        "Content-Type": "application/json"
      }
    }).then(function(result){
      const success = result.data.success;
      callback(success, null);
    }).catch(function(error){
      console.error( error );
      callback(false, error);
    });
  }

  return {
    getValues: function(form){
      return _getValues(this, form);
    },
    getValidValues: function(form){
      return _getValidValues(this, form);
    },
    clear: function(form){
      return _clear(this, form);
    },
    save: function(config, callback){
      _save(this, config, callback);
    }
  }
})();

export function bindElement(name, func, initConfig){
  let config = {
    url: "",
    js: [],
    parent: null
  }
  
  if( initConfig ){
    Object.assign(config, initConfig);
  }

  Element.prototype[name] = function(setting){
    if( setting ){
      Object.assign(config, setting);
    }
    
    const p = new func(config, this);
    Common.extendsModule(Common, p);
    p.init();
    
    return p;
  };

  return func;
}

export default Common;