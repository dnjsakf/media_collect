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
  let btn = document.getElementById("btn_get_data");
  btn.addEventListener("click", getData);
  `;
  document.body.appendChild(js);

}).catch(function(error){
  console.error(error);
});
