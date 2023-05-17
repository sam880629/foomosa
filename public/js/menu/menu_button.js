$(function(){

//獲得Tr內容
function getTrData(row) {
    const meid = row.find("span[name='menu_id']").text();
    const mename = row.find("span[name='menu_name']").text();
    const metype = row.find("span[name='menu_type']").text();
    const meprice = row.find("span[name='menu_price']").text();
    const meuber = row.find("span[name='menu_uber']").text();
    const mepanda = row.find("span[name='menu_panda']").text();
    const mepicture = row.find("img[name='menu_picture']").attr('src');
    const mepictureName = row.find("span[name='menu_pictureName']").text();
    //const meeditdate = row.find("span[name='menu_editdate']").text();

    return {
      meid,
      mename,
      metype,
      meprice,
      meuber,
      mepanda,
      mepicture,
      mepictureName,
    };
  }

  //編輯按鈕
  function getEditMenu() {
    $('tbody').on('click', '.editMenu', function () {
      console.log('edit edit')
      var row = $(this).closest('tr');
      var trData = getTrData(row);
      console.log(trData);

      $('#editName').val(trData.mename);
      $('#editPrice').val(trData.meprice);
      $('#editUber').val(trData.meuber);
      $('#editPanda').val(trData.mepanda);
      $('#editType').val(trData.metype);
      $('#editId').text(trData.meid);
      $('#editImg').attr("src", trData.mepicture);
    });
  }

  //刪除按鈕
  function getDelMenu() {
    $('tbody').on('click', '.delMenu', function () {
      console.log('delete delete')
      var row = $(this).closest('tr');
      var trData = getTrData(row);
      console.log(trData);

      $('#delName').text(trData.mename);
      $('#delId').text(trData.meid);
    });
  }
    
})