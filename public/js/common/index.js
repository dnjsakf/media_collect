const Common = function(){}

Common.prototype = (function(){
  function _initLoad(self, callback){
    const url = self.getConfig("url");
    const js = self.getConfig("js");
    
    _loadTemplates(self, url, function(success){
      if( success ){
        _loadJavaScript(self, js);
        callback() 
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
    if( urls && Array.isArray( urls ) ){
      urls.forEach(function(_url){
        const url = "/public/"+_url+".js";
        const script = document.querySelector('script[src="'+url+'"]');
        if( !script ){
          const body = document.querySelector("body");
          const js = document.createElement("script");
          axios({
            method: "GET"
            , url: url
            , baseurl: "http://localhost:3000/"
            , headers: {
              "Content-Type": "text/html"
            }
          }).then(function(result){
            js.src = url;
            js.text =result.data;
            body.appendChild(js);
          }).catch(function(error){
            console.log(error);
          });
        }
      });
    }
  }
  
  function _openModal(self, options){

  }
  
  return {
    initLoad: function(callback){
      _initLoad(this, callback);
    },
    loadTemplates: function(url){
      _loadTemplates(this, url);
    },
    loadJavaScript: function(url){
      _loadJavaScript(this, url);
    },
    openModal: function(options){
      _openModal(self, options);
    }
  }
})();

Common.extends = function(obj){  
  for(let key in Common.prototype ){
    if( typeof Common.prototype[key] === 'function' ){
      obj.__proto__[key] = Common.prototype[key];
    }
  }
}

Common.modal = (function(){
  modals = [];
  
  function _open(options){
      axios({
      method: "GET"
      , url: options.url
      , baseurl: "http://localhost:3000/"
      , headers: {
        "Content-Type": "text/html"
      }
    }).then(function(result){
      const modal = _makeModal(result.data.html, options);
      if( modal ){
        modals.push(modal);
        modal.open();
      }
    }).catch(function(error){
      console.error( error );
    });
  }
  
  function _makeModal(html, options){
    const body = document.querySelector("body");
    
    const modal = document.createElement("div");
    modal.className = "modal modal-fixed-header modal-fixed-footer";
    
    /* Header */
    const modal_header = document.createElement("div");
    modal_header.className = "modal-header";
    
    const modal_header_text = document.createElement("a");
    modal_header_text.className = "btn-flat";
    modal_header_text.appendChild(document.createTextNode(options.title));
    
    modal_header.appendChild(modal_header_text);
    /* Header */
    
    /* Content */
    const modal_content = document.createElement("div");
    modal_content.className = "modal-content";
    modal_content.innerHTML = html;
    /* Content */
    
    /* Footer */
    const modal_footer = document.createElement("div");
    modal_footer.className = "modal-footer";
    
    options.buttons.forEach(function(btn_option){
      let button = _makeModalButton.call(null, modal, btn_option);
      modal_footer.appendChild(button);
    });
    /* Footer */
    
    modal.appendChild(modal_header);
    modal.appendChild(modal_content);
    modal.appendChild(modal_footer);
    
    body.appendChild(modal);
    
    if( !options.config ){
      options.config = {}
    }
    
    return M.Modal.init(modal, options.config);
  }

  function _makeModalButton(modal, option){
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
    button.appendChild(document.createTextNode(option.text));
    
    return button;
  }
  
  return {
    open: function(options){
      _open(options);
    },
    modals: this.modals
  }
})([]);


function getFormValues(form){
  const inputs = form.querySelectorAll("input, select");
  return Array.from(inputs).map(function(input){
    return {
      name: input.name 
      , value: input.value
      , required: input.getAttribute("required") != null
      , el: input
    }
  });
}

function validateFormValues(form){
  let invalid = null;

  let values = getFormValues(form).map(function(data){
    data.el.classList.remove("valid", "invalid");
    if( data.required && !data.value ){
      data.el.classList.add("invalid");
      if( invalid == null ){
        invalid = data.el;
      }
    } else {
      data.el.classList.add("valid");
    }
    return data;
  })

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
    , values: invalid == null ? values : null
  }
}

function clearForm(form){
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


