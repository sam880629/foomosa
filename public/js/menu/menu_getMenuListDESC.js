$(document).ready(function () {
  //get全部
  var flag = true;
  $('#DESC').on('click', function () {

    if (flag) {
      function getMenuListDESC() {
        $.ajax({
          url: "/menuSelect/orderByDESC",//想要獲得3000要在sever那邊先開放
          type: "GET",
          success: function (Mlist) {
            //檢查是否有進來
            // console.log('我是getMenuList-success')
            //檢查有沒有url資料
            // console.log(Mlist)
            $('tbody').empty();
            $.each(Mlist, function (index, myMenulist) {

              $('tbody').append(
                `   <tr>
                <td class="align-middle text-center">
                  <div class="d-flex px-3 py-0">
                    <div class="d-flex flex-column justify-content-center">
                      <span name="menu_id" class="mb-0 text-sm" style="display: none;">${myMenulist.menu_id}</span>
                      <span name="menu_name" class="mb-0 text-sm">${myMenulist.menu_name}</span>

                    </div>
                  </div>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_type" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_type}</span>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_price" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_price}</span>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_uber" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_uber ? myMenulist.menu_uber : ""}</span>
                  </td>
                  <td class="align-middle text-center">
                    <span name="menu_panda" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_panda ? myMenulist.menu_panda : ""}</span>
                </td>
                <td class="align-middle text-center">
                  <img name="menu_picture" src="${myMenulist.menu_picture}" alt="profile_image" class=" border-radius-round " style="height: 50px;width: auto;max-width: 75px;object-fit: cover;">
                  <span name="menu_pictureName" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_picture.split("/").pop().split("-").pop()}</span>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_editdate" class="text-secondary text-xs font-weight-bold">${myMenulist.created_at}</span>
                </td>
                <td class=" align-middle text-end gx-1">
                  <button type="button" class="editMenu btn btn-outline-primary  "
                          data-bs-toggle="modal" data-bs-target="#myModal_V2" title="編輯">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                        <button type="button" class="delMenu btn btn-outline-warning "
                          data-bs-toggle="modal" data-bs-target="#myModal_V3" title="刪除">
                          <i class="bi bi-trash3-fill"></i>
                        </button>
                </td>
              </tr>`
              )

            })

          }
        })

      }

      getMenuListDESC()
      
      $("#DESC i").removeClass('bi-arrows-expand');
      $("#DESC i").removeClass('bi-arrow-up-short');
      $("#DESC i").addClass('bi-arrow-down-short');
      flag = false;
    } else {
      function getMenuListASC() {
        $.ajax({
          url: "/menuSelect/orderByASC",//想要獲得3000要在sever那邊先開放
          type: "GET",
          success: function (Mlist) {
            //檢查是否有進來
            // console.log('我是getMenuList-success')
            //檢查有沒有url資料
            // console.log(Mlist)
            $('tbody').empty();
            $.each(Mlist, function (index, myMenulist) {

              $('tbody').append(
                `   <tr>
                <td class="align-middle text-center">
                  <div class="d-flex px-3 py-0">
                    <div class="d-flex flex-column justify-content-center">
                      <span name="menu_id" class="mb-0 text-sm" style="display: none;">${myMenulist.menu_id}</span>
                      <span name="menu_name" class="mb-0 text-sm">${myMenulist.menu_name}</span>

                    </div>
                  </div>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_type" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_type}</span>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_price" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_price}</span>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_uber" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_uber ? myMenulist.menu_uber : ""}</span>
                  </td>
                  <td class="align-middle text-center">
                    <span name="menu_panda" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_panda ? myMenulist.menu_panda : ""}</span>
                </td>
                <td class="align-middle text-center">
                  <img name="menu_picture" src="${myMenulist.menu_picture}" alt="profile_image" class=" border-radius-round " style="height: 50px;width: auto;max-width: 75px;object-fit: cover;">
                  <span name="menu_pictureName" class="text-secondary text-xs font-weight-bold">${myMenulist.menu_picture.split("/").pop().split("-").pop()}</span>
                </td>
                <td class="align-middle text-center">
                  <span name="menu_editdate" class="text-secondary text-xs font-weight-bold">${myMenulist.created_at}</span>
                </td>
                <td class=" align-middle text-end gx-1">
                  <button type="button" class="editMenu btn btn-outline-primary  "
                          data-bs-toggle="modal" data-bs-target="#myModal_V2" title="編輯">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                        <button type="button" class="delMenu btn btn-outline-warning "
                          data-bs-toggle="modal" data-bs-target="#myModal_V3" title="刪除">
                          <i class="bi bi-trash3-fill"></i>
                        </button>
                </td>
              </tr>`
              )

            })

          }
        })

      }

      getMenuListASC()
      $("#DESC i").removeClass('bi-arrow-down-short');
      // $("#DESC i").removeClass('');
      $("#DESC i").addClass('bi-arrow-up-short');
      flag = true;
    }
  })

})
