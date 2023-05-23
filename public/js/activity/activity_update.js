$(function () {
  // 初始狀態顯示進行中的活動
  var showOpenData = true;

  // 點選進行中的活動按鈕
  $('#openingData').on('click', function () {
    if (!showOpenData) {
      showOpenData = true;
      //getActivityList();
    }
  });

  // 點選歷史紀錄按鈕
  $('#closingData').on('click', function () {
    if (showOpenData) {
      showOpenData = false;
      //getActivityList();
    }
  });

function getActivityList() {
    $.ajax({
      url: "http://localhost:3000/activitySelect",
      type: "GET",
      success: function (alist) {
        //檢查是否有進來
        // console.log('我是getActivityList-success')
        //檢查有沒有url資料
        // console.log(alist)
        $('tbody').empty();
        $.each(alist[0], function (index, myactivitylist) {
          if ((showOpenData && myactivitylist.active_ifDel == 1) || (!showOpenData && myactivitylist.active_ifDel == 0)) {
            $('tbody').append(
              `   <tr>
                    <td class="align-middle text-center">
                          <div class="d-flex align-items-center justify-content-center flex-grow-1">
                            <div class=" position-relative">
                              <img src="${myactivitylist.active_picture}" alt="profile_image"
                                class="w-100 border-radius-round " style="height: 30px; width: auto";>
                            </div>
                          </div>
                          <span class=" text-secondary text-xs font-weight-bold string-container" data-full-text="">${myactivitylist.active_picture.split("/").pop()
              }</span>
                        </td>
                        <td class="align-middle text-center">
                          <span class="text-secondary text-xs font-weight-bold">${myactivitylist.active_startdate}</span>
                          <p class="text-xs font-weight-bold mb-0 align-middle text-center">～</p>
                          <span class="text-secondary text-xs font-weight-bold">${myactivitylist.active_enddate}</span>
                        </td>
                        <td class="align-middle text-center">
                          <span class="  text-xs font-weight-bold string-container">${myactivitylist.active_title}</span>
                        </td>
                        <td class="align-middle text-center">
                          <span class="memo" style="display: none;">${myactivitylist.active_content}</span>
                          <span class="id" style="display: none;">${myactivitylist.active_id}</span>

                          <span class=" text-lg "><i class="bi bi-ticket-perforated-fill text-warning fs-2" name=couponOpen></i></span>
                        </td>
                        <td class=" align-middle  text-center">
                          <button type="button" class="thisActivity btn btn-outline-secondary  "
                            data-bs-toggle="modal" data-bs-target="#myModal" title="預覽">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button type="button" class="editActivity btn btn-outline-primary  "
                            data-bs-toggle="modal" data-bs-target="#myModal_V2" title="編輯">
                            <i class="bi bi-pencil-square"></i>
                          </button>
                          <button type="button" class="delActivity btn btn-outline-warning "
                            data-bs-toggle="modal" data-bs-target="#myModal_V3" title="切換優惠狀態">
                            <i class="bi bi-folder-symlink"></i>
                          </button>
                        </td>
                      </tr>`
            )
          }
        })
	if (alist[1][0].shop_logo_img) {
          $('#avatar img').prop('src', '../' + alist[1][0].shop_logo_img);
        }

        // 將左側 menu 的文字改成店名
        $('#welcomeText').text(`Welcome! ${alist[1][0].shop_name.split(" ")[0]}`);
      }
    })

  }


  


  $('#insertActivity').on('click', function () {
    // console.log("insert")
    const title = $('#activityInsertCard input[name="title"]').val();
    const startdate = $('#activityInsertCard input[name="startdate"]').val();
    const enddate = $('#activityInsertCard input[name="enddate"]').val();
    const memo = $('#memo').val();
    const picture = $('#picture')[0].files[0];
    // console.log(`title=${title}, startdate=${startdate}, enddate=${enddate}, memo=${memo}, picture=${picture}`)
    //判斷是否有上傳圖片
    if (picture) {
      const formData = new FormData();
      formData.append('picture', picture);
      // console.log(...formData.entries())

      // 透過ajax將圖片上傳至伺服器
      $.ajax({
        url: 'http://localhost:3000/activityInsert/upload_image',//這裡的操作要再多包一層http://localhost:3000/upload/upload_image下面比照辦理，後半段對應伺服器
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {//練習用await

          const pictureName = picture.name;
          // console.log(pictureName)
          // 透過ajax將其他資料送至伺服器
          $.ajax({
            url: 'http://localhost:3000/activityInsert/insertData',//這裡的操作要再多包一層
            type: 'POST',
            data: { title, startdate, enddate, memo, pictureName },
            success: function (res) {
              // console.log(res);
              // confirm("是否發送優惠卷？")
              // if (confirm("是否發送優惠卷？")) {
              //   $('#couponModal').modal('show');
              // }
              
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(`Ajax request failed: ${textStatus} - ${errorThrown}`);
            }
          });
        }
      });
    } else {
      // 透過ajax將其他資料送至伺服器
      $.ajax({
        url: 'http://localhost:3000/activityInsert/insertData',
        type: 'POST',
        data: { title, startdate, enddate, memo },
        success: function (res) {
          // console.log(res);
          // if (confirm("是否發送優惠卷？")) {
          //   $('#couponModal').modal('show');
          // }
         
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(`Ajax request failed: ${textStatus} - ${errorThrown}`);
        }
      });
     }
  });

  //update AJAX

  $('#btnEdit').on('click', function () {
    const formData = new FormData();
    formData.append('file', fileUpload.files[0]);
    formData.append('title', $('#editTitle').val());
    formData.append('startdate', $('#editStartdate').val());
    formData.append('enddate', $('#editEnddate').val());
    formData.append('memo', $('#editMemo').val());
    formData.append('id', $('#editId').text());

    $.ajax({
      type: "put",
      url: "http://localhost:3000/activityUpdate",
      data: formData,
      contentType: false,
      processData: false,
      success: function (x) {
        // console.log(x)
        alert(x)
        //重新整理畫面
        getActivityList();
      }
    });
  });


  $('#btnEdit').on('click', function () {
    $.ajax({
      type: "put",
      url: "http://localhost:3000/myActivityEdit",
      data: {
        title: $('#editTitle').val(),
        startdate: $('#editStartdate').val(),
        enddate: $('#editEnddate').val(),
        memo: $('#editMemo').text(),
        id: $('#editId').text()
      },
      success: function (x) {
        // console.log(x)
        alert(x)
        //重新整理畫面
        getActivityList();
      }
    })
  })



  $('#btnDelete').on('click', function () {
    $.ajax({
      type: "put",
      url: "http://localhost:3000/activityDelete",
      data: {
        id: $('#delId').text(),
      },
      success: function (x) {
        // console.log(x)
        alert(x)
        //重新整理畫面
        getActivityList();
      }
    })
  })
  getActivityList();
})