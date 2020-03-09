function handleChangeMenu(menu_type, menu_name){
  const navigator = document.getElementById("navigator");
  return function(event){
    event.preventDefault();
    navigator.innerHTML = `<h3>${ menu_type } > ${ menu_name }</h3>`;
  }
}

function handleLoadMenu(url, js){
  return function(event){
    event.preventDefault(); 
    loadTemplates(url, js);
  }
}

axios({
  method: "GET"
  , url: "/menus"
  , baseurl: "http://localhost:3000"
}).then(function(result){
  const menus = document.getElementById("menus");
  menus.innerHTML = result.data.html
  
  const sel_menu_buttons = document.getElementsByClassName("btn_sel_menu");
  Array.from(sel_menu_buttons).forEach(function(btn){
    const href = btn.getAttribute("href");
    const menu_type = btn.getAttribute("menu-type");
    const menu_name = btn.getAttribute("menu-name");

    btn.addEventListener('click', handleLoadMenu(href, true));
    btn.addEventListener('click', handleChangeMenu(menu_type, menu_name));
  });
}).catch(function(error){
  console.error( error );
});