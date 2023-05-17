//獲得Tr內容
function getTrData(row) {
    var imgSrc = row.find("img").attr("src");
    var pvtitle = row.find('span')[3].innerText;
    var pvimage = row.find('span')[0].innerText;
    var pvstratdate = row.find('span')[1].innerText;
    var pvenddate = row.find('span')[2].innerText;
    var pvmemo = row.find('.memo').text();
    var pvid = row.find('.id').text();

    return {
      imgSrc,
      pvtitle,
      pvimage,
      pvstratdate,
      pvenddate,
      pvmemo,
      pvid
    };
  }

  //預覽按鈕
  function getThisActivity() {
    $('tbody').on('click', '.thisActivity', function () {
      var row = $(this).closest('tr');
      var trData = getTrData(row);
      console.log(trData);

      $('#previewTitle').text(trData.pvtitle);
      $('#previewStartdate').text(trData.pvstratdate);
      $('#previewEnddate').text(trData.pvenddate);
      $('#previewMemo').text(trData.pvmemo);
      $('#previewId').text(trData.pvid);
      $('#previewImg').attr("src", trData.imgSrc);
    });
  }
  //刪除按鈕
  function getDelActivity() {
    $('tbody').on('click', '.delActivity', function () {
      console.log('delete delete')
      var row = $(this).closest('tr');
      var trData = getTrData(row);
      console.log(trData);

      $('#delTitle').text(trData.pvtitle);
      $('#delStartdate').text(trData.pvstratdate);
      $('#delEnddate').text(trData.pvenddate);
      $('#delMemo').text(trData.pvmemo);
      $('#delId').text(trData.pvid);
    });
  }

  //編輯按鈕
  function getEditActivity() {
    $('tbody').on('click', '.editActivity', function () {
      console.log('edit edit')
      var row = $(this).closest('tr');
      var trData = getTrData(row);
      console.log(trData);

      $('#editTitle').val(trData.pvtitle);
      $('#editStartdate').val(trData.pvstratdate);
      $('#editEnddate').val(trData.pvenddate);
      $('#editMemo').text(trData.pvmemo);
      $('#editId').text(trData.pvid);
      $('#editImg').attr("src", trData.imgSrc);
    });
  }


  function getThisToggle() {

    var flag = true;
    $('tbody').on('click', '#at_table_tbody i', function () {
      console.log("toggle click")
      if (flag) {

        $(this).removeClass('bi-toggle-on text-warning');
        $(this).addClass('bi-toggle-off text-secondary');
        flag = false;
      } else {
        $(this).removeClass('bi-toggle-off text-secondary').addClass('bi-toggle-on text-warning');
        flag = true;
      }
    })
  }