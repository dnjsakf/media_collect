function getData(event){
  event.preventDefault();

  const response = axios({
    method: "get"
    , url: "/data"
    , baseurl: "http://localhost:3000/"
  }).then(function(result){
    console.log( result )
    const root = document.querySelector("#content > .wrapper");
    root.innerHTML = result.data.html;
  }).catch(function(error){
    console.error(error);
  });
}

function getProductList(event){
  event.preventDefault();

  const response = axios({
    method: "get"
    , url: "/shop/product/coupang"
    , baseurl: "http://localhost:3000/"
  }).then(function(result){
    console.log( result )
    const root = document.querySelector("#content > .wrapper");
    root.innerHTML = result.data.html;
  }).catch(function(error){
    console.error(error);
  });
  
}

const response = axios({
  method: "post"
  , url: "/frame"
  , baseurl: "http://localhost:3000/"
}).then(function(result){
  const root = document.getElementById("root");

  root.innerHTML = result.data.html;

  const js = document.createElement("script");
  js.id = "data_js"
  js.type = "text/javascript";
  js.text = `
  let btn_get_data = document.getElementById("btn_get_data");
  btn_get_data.addEventListener("click", getData);
  
  let btn_get_product_list = document.getElementById("btn_get_product_list");
  btn_get_product_list.addEventListener("click", getProductList);
  `;
  document.body.appendChild(js);

}).catch(function(error){
  console.error(error);
});
