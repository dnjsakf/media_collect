a = document.getElementById("menus")
a.dcMenu();

/*
document.addEventListener("DOMContentLoaded", function(event){
  const load_menus = axios({
    method: "GET"
    , url: "/menus"
    , baseurl: "http://localhost:3000"
  }).then(function(result){    
    const menus = document.getElementById("menus");
    menus.innerHTML = result.data.html
    
    const sel_menu_buttons = document.getElementsByClassName("btn_sel_menu");
    Array.from(sel_menu_buttons).forEach(function(btn){
      const url = btn.getAttribute("href");
      const menu_type = btn.getAttribute("menu-type");
      const menu_name = btn.getAttribute("menu-name");

      btn.addEventListener('click', handleLoadMenu(url));
      btn.addEventListener('click', handleChangeMenu(menu_type, menu_name));
    });
  }).catch(function(error){
    console.error( error );
  });
});
*/