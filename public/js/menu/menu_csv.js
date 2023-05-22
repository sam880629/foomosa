
$(document).ready(function () {
    //CSV的部分
    $('#csvFileBtn1').click(function () {

      var file = $('#file1')[0].files[0];
      if (!file) {
        alert('未選擇任何檔案');
        return;
      }
      var reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function (event) {
        var csvData = event.target.result;
        // console.log(csvData)
        var jsonData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
        // console.log(jsonData)

        var csvFormData = new FormData();
        //csv檔案名稱為menu
        csvFormData.append('menu', JSON.stringify(jsonData));
        // console.log(...csvFormData.entries())

          $.ajax({
            type: 'POST',
            url: '/menu_csvinsert',
            data: csvFormData,
            processData: false,
            contentType: false,
            //因為formData已設定格式所以processData: false,contentType: false,否則會造成重複編碼與錯誤
            success: function (response) {
              console.log(response);
              alert('上傳成功!稍後頁面重新整理');
              location.reload();
            },
            error: function (xhr, status, error) {
              console.error(error);
            }
          });
      };
    });
})