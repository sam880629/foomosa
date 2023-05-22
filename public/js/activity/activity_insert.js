//activity_CRUD---start
      $('#insertActivity').on('click', function () {
        const title = $('#activityInsertCard input[name="title"]').val();
        const startdate = $('#activityInsertCard input[name="startdate"]').val();
        const enddate = $('#activityInsertCard input[name="enddate"]').val();
        const memo = $('#memo').val();
        const picture = $('#picture')[0].files[0];
        // console.log(`title=${title}, startdate=${startdate}, enddate=${enddate}, memo=${memo}, picture=${picture.name}`)
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
                  getActivityList();
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
              getActivityList();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(`Ajax request failed: ${textStatus} - ${errorThrown}`);
            }
          });
        }
      });
