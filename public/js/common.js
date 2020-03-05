const root = document.getElementById("root");

const response = axios({
  method: "post"
  , url: "/frame"
  , baseurl: "http://localhost:3000/"
});      
response.then(function(result){
  console.log( result )
  root.innerHTML = result.data.html;
});
response.catch(function(error){
  console.error(error);
});