function loadJavascript(url){
  axios({
    method: "GET"
    , url: url
    , baseurl: "http://localhost:3000"
    , headers: {
      "Content-Type": "text/script"
    }
  }).then(function(result){
    const body = document.querySelector("body");
    const js = document.createElement("script");
    js.type = "text/javascript";
    js.text = result.data.js;
    body.appendChild(js);
  }).catch(function(error){
    console.error( error );
  });
}

function loadTemplates(url, js){
  axios({
    method: "GET"
    , url: url
    , baseurl: "http://localhost:3000"
    , headers: {
      "Content-Type": "text/html"
    }
  }).then(function(result){
    const content = document.getElementById("content");
    content.innerHTML = result.data.html;

    if( js ){
      const body = document.querySelector("body");
      const js = document.createElement("script");
      js.type = "text/javascript";
      js.text = result.data.js;
      body.appendChild(js);
    }
  }).catch(function(error){
    console.error( error );
  });
}

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



// function getData(event){
//   event.preventDefault();

//   const response = axios({
//     method: "get"
//     , url: "/data"
//     , baseurl: "http://localhost:3000/"
//   }).then(function(result){
//     console.log( result )
//     const root = document.querySelector("#content > .wrapper");
//     root.innerHTML = result.data.html;
//   }).catch(function(error){
//     console.error(error);
//   });
// }

// function getProductList(event){
//   event.preventDefault();

//   const response = axios({
//     method: "get"
//     , url: "/shop/product/coupang"
//     , baseurl: "http://localhost:3000/"
//   }).then(function(result){
//     console.log( result )
//     const root = document.querySelector("#content > .wrapper");
//     root.innerHTML = result.data.html;
//   }).catch(function(error){
//     console.error(error);
//   });
// }

// const response = axios({
//   method: "post"
//   , url: "/frame"
//   , baseurl: "http://localhost:3000/"
// }).then(function(result){
//   const root = document.getElementById("root");

//   root.innerHTML = result.data.html;

//   const js = document.createElement("script");
//   js.id = "data_js"
//   js.type = "text/javascript";
//   js.text = `
//   let btn_get_data = document.getElementById("btn_get_data");
//   btn_get_data.addEventListener("click", getData);
  
//   let btn_get_product_list = document.getElementById("btn_get_product_list");
//   btn_get_product_list.addEventListener("click", getProductList);
//   `;
//   document.body.appendChild(js);

// }).catch(function(error){
//   console.error(error);
// });
