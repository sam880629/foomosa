$(function () {

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


  //測試input換造型
  $('.inputFile').on('change', function () {
    var inputFiles = $(this)[0].files;
    var inputFileName = "";
    if (inputFiles.length > 1) {
      inputFileName = `選擇了 ${inputFiles.length} 個檔案`;
    } else {
      inputFileName = inputFiles[0].name;
    }
    var inputId = $(this).attr('id');
    if (inputId == 'file1') {
      $('#span1').text(inputFileName);
    } else if (inputId == 'image_files') {
      $('#span2').text(inputFileName);
    }
  });

  $('.click_here, .btn').on('click', function () {
    var fileNameId = $(this).attr('id');
    if (fileNameId == 'file-name1' || fileNameId == 'upload_btn1') {
      $('#file1').trigger('click');
    } else if (fileNameId == 'file-name2' || fileNameId == 'upload_btn2') {
      $('#image_files').trigger('click');
    }



  });
})