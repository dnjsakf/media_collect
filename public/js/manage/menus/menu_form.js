function handleFormClearButton(form_name){
  const form = document.getElementById(form_name);
  return function(event){
    event.preventDefault();
    clearForm(form);
  }
}

function handleFormSaveButton(form_name){
  const form = document.getElementById(form_name);
  return function(event){
    event.preventDefault();
    const checked = validateFormValues(form);
    if( checked.valid ){
      if( confirm("저장하시겠습니까?") ){
        const response = axios({
          method: "POST"
          , url: "/manage/menus/save"
          , baseurl: "http://localhost:3000/"
          , data: checked.values
        }).then(function( result ){
          console.log( result );
          if( result.data.success ){
            alert("저장을 완료하였습니다.");
          } else {
            alert("저장에 실패하였습니다.");
          }
        }).catch(function(error){
          console.error( error );
          alert("오류가 발생하였습니다.");
        })
      }
    }
  }
}

const form_clear_buttons = document.getElementsByClassName("btn_form_clear");
const form_save_buttons = document.getElementsByClassName("btn_form_save");

Array.from(form_clear_buttons).forEach(function(btn){
  const form_name = btn.getAttribute("form-name");
  btn.addEventListener("click", handleFormClearButton(form_name));
});
Array.from(form_save_buttons).forEach(function(btn){
  const form_name = btn.getAttribute("form-name");
  btn.addEventListener("click", handleFormSaveButton(form_name));
});