Common.prototype.loadJavaScript([
  "js/common/dcMenu"
]).then(function(){
  const menus = document.getElementById("menus");

  menus.dcMenu();
});