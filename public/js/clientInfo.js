$(document).ready(function () {
    renewPage();

    // swalOpen(); // 詢問是否立刻開店
})


function renewPage() {
    // 抓資料庫的資料
    $.ajax({
        url: "/getClient",
        methed: "GET",
        datatype: "json",
        success: async function (data) {
            if ($.cookie('potential')) {
                await setPotentialData(data);
            } else {
                await setInitialData(data);
            }
            await showServiceArea();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    })
}

let loginIdNow; // 全域變數，存現在登入的shop id
// 當網頁載入時，載入資料庫現存的資料
function setInitialData([shop]) {
    loginIdNow = shop.shop_id;

    // 店家資訊區塊
    $('#shopName').val(shop.shop_name); // 店家名字
    $('#shopAddress').val(shop.shop_address); // 店家地址
    $('#shopPhone').val(shop.shop_phone); // 店家電話
    $('#shopEmail').val(shop.shop_email); // 聯絡信箱
    $('#shopTaxId').val(shop.shop_tax_id); // 統一編號
    $('#shopClass').val(shop.class_id); // 店家分類
    $('#sParking').prop('checked', shop.shop_parking);
    $('#sChild').prop('checked', shop.shop_child);
    $('#sPet').prop('checked', shop.shop_pet);
    $('#sCreditCard').prop('checked', shop.shop_credit_card);
    $('#slinePay').prop('checked', shop.shop_linepay);
    $('#sJko').prop('checked', shop.shop_jkopay);

    // 營業時間區塊
    let week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let breakArray = [];

    // 判斷有沒有公休日，有的話轉成陣列
    if (shop.shop_break) {
        breakArray = shop.shop_break.split(',');
    }
    $(".week-area").empty();

    // 將公休日結果渲染到按鈕
    $.each(week, (index, value) => {
        let btnClass = breakArray.includes(`${++index}`) ? "btn-break" : "btn-orange";
        let btn = `
            <button name="${index}" class="btn ${btnClass} rounded-circle me-3">
            <span>${value}</span>
            </button>`;
        $(".week-area").append(btn);
    })

    // 設定公休日按鈕事件
    setWorkDayBtn();

    // 將資料庫撈出來的營業時間存成一個陣列
    let timeArray = [];
    $.each([shop.shop_start_1, shop.shop_end_1, shop.shop_start_2, shop.shop_end_2], (index, value) => {

        // 營業時間有值的話，分解存進 timeArray 陣列
        if (value) {
            timeArray = timeArray.concat(value.split(':'));
        }
    })

    for (let i = 0; i < timeArray.length / 4; i++) {
        SetIncreaseTimeBtn();
    }

    $.each(timeArray, (index, value) => {
        $('.time-area input').eq(index).val(value);
    });


    // 圖片上傳區
    setInitialImg(shop);

    // 換成資料庫抓到的logo圖像路徑(如果有的話)
    if (shop.shop_logo_img) {
        $('.avatar img').prop('src', '../' + shop.shop_logo_img);
    }

    // 將左側 menu 的文字改成店名
    $('#welcomeText').text(`Welcome! ${shop.shop_name.split(" ")[0]}`);
    // $('.welcomeText').html("hi");
}

// 當網頁載入時，載入資料庫現存的資料
function setPotentialData([shop]) {
    // 店家資訊區塊
    // console.log(shop);
    $('#shopName').val(shop.p_shop_name); // 店家名字
    $('#shopAddress').val(shop.p_shop_address); // 店家地址
    $('#shopPhone').val(shop.p_shop_phone); // 店家電話
    $('#shopEmail').val(shop.p_shop_email); // 聯絡信箱

    // 營業時間區塊
    let week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // let breakArray = shop.shop_break.split(',');
    $(".week-area").empty();
    $.each(week, (index, value) => {
        let btnClass = breakArray.includes(`${index + 1}`) ? "btn-break" : "btn-orange";
        let btn = `
            <button name="${index++}" class="btn btn-orange rounded-circle me-3">
            <span>${value}</span>
            </button>`;
        $(".week-area").append(btn);
    })

    // 設定上面建的按鈕事件
    setTimeBtn();


}




// 設施服務摺疊區域
$("#btnCollapseOption").on('click', function () {
    let expanded = $("#btnCollapseOption").attr('aria-expanded');
    if (expanded == 'true') {
        // 改圖示
        $("#btnCollapseOption i").text("arrow_drop_up");
    } else {
        // 改圖示
        $("#btnCollapseOption i").text("arrow_drop_down");
    }
})


// 設施服務的 checkbox 勾選事件，要改變 fakeInput
$("#myCollapse :checkbox").on('change', (e) => {
    showServiceArea()
})

// 處理修改資料的功能
let changeObj = {} // 存有變動過的欄位
$(".info-area form").on('change', (e) => {
    let elem = $(e.target);

    // 如果資訊有改變的話，儲存按鈕變可按
    $("#clientInfoSumit").attr('disabled', false);

    if (elem.is(":text")) {
        changeObj[`${elem.prev('p').text()}`] = elem.val();
    } else if (elem.is("[type='email']")) {
        changeObj[`${elem.prev('p').text()}`] = elem.val();
    } else if (elem.is(":checkbox")) {
        let service = [];
        $("#myCollapse input").each((index, elem) => {
            if (elem.checked) {
                service.push($(elem).val());
            }
        });
        changeObj["設施服務"] = service;
    } else if (elem.is("select")) {
        let select = $(elem).children('option:selected').text();
        changeObj["店家分類"] = select;
    }
})

// 店家基本資訊區域的儲存按鈕點擊後，顯示更動結果詢問是否變更
$("#clientInfoSumit").on('click', function () {
    // 將目前有更動的內容放到 .modal-body
    $.each(changeObj, function (key, value) {
        let p = $("<p></p>").text(`${key}: ${value}`);
        $(".modal-body").append(p);
    })
})

// 店家營業時間區域的儲存按鈕點擊後，顯示更動結果詢問是否變更
$("#timeSumit").on('click', function () {
    // 接一些錯誤狀況 ex沒填

    // 判斷星期幾的按鈕有亮
    var breakday = [];
    $.each($(".week-area button"), function () {
        if ($(this).hasClass('btn-break')) {
            breakday.push($(this).prop('name'));
        }
    })

    // 儲存到資料庫
    var data = {
        "shop_start_1": `${$('.time-area input').eq(0).val()}:${$('.time-area input').eq(1).val()}`,
        "shop_end_1": `${$('.time-area input').eq(2).val()}:${$('.time-area input').eq(3).val()}`,
        "shop_break": breakday.toString()
    };

    // 判斷公休日是不是 null 
    data["shop_break"] = breakday ? breakday.toString() : null;


    // 判斷營業時間 2 有沒有值
    if ($('.time-area input').eq(4).val()) {
        data['shop_start_2'] = `${$('.time-area input').eq(4).val()}:${$('.time-area input').eq(5).val()}`;
        data['shop_end_2'] = `${$('.time-area input').eq(6).val()}:${$('.time-area input').eq(7).val()}`;
    } else {
        data['shop_start_2'] = null;
        data['shop_end_2'] = null;
    }
    // console.log(data);
    $.ajax({
        url: "/putClient/time",
        type: "put",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: async function (data) {
            await swal('儲存成功', '', 'success');
            await (function () {
                window.location = "/backstage/clientinfo";
            }());
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log("更新錯誤");
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    })

})


// 檔案上傳區
let file_index; // this is a global variable
let file_logo; // this is a global variable

// 點擊商家首頁圖上傳框框，等於點擊隱藏的input:file
const indexImgUpload = document.querySelector('#index_img');
const fileIndex = document.querySelector('#file_index');
indexImgUpload.addEventListener('click', () => {
    fileIndex.click();
});

// 點擊商家頭像上傳框框，等於點擊隱藏的input:file
const logoUpload = document.querySelector('#logo_img');
const fileLogo = document.querySelector('#file_logo');
logoUpload.addEventListener('click', () => {
    fileLogo.click();
});

$(".img_upload input:file").on('change', ({ target }) => {
    let parentId = $(target).closest('.img_upload').prop("id");
    if (parentId == 'index_img') {
        file_index = target.files[0];
        showImg(target, false);
    } else if (parentId == 'logo_img') {
        file_logo = target.files[0];
        showImg(target, true);
    }

})



// when click del button
// 如果資料庫有圖片，則刪除資料庫的資料
// 如果預覽圖片區有圖片，移除









/* *********************************
        商店基本資訊區
********************************* */

// 將有被打勾的設施服務渲染在 serviceArea
function showServiceArea() {
    let count = 0;
    $(".fakeInput").empty();
    $("#myCollapse input").each((index, elem) => {
        if (elem.checked && count < 2) {
            var btn = `                  
                <button name="${$(elem).prop('id')}" onclick="serviceButtonClick(this)" class="small d-flex align-items-center justify-content-between me-2" type="button">
                    <span class="me-2">${$(elem).val()}</span>
                    <i class="material-icons" style="font-size:16px;">close</i>
                </button>`;
            $(".fakeInput").append(btn);
            count++;
        } else if (elem.checked && count == 2) {
            $(".fakeInput").append("<span>...</span>");
            count++;
        }
    });
}

// 設施服務結果框的按鈕，點一下可以取消
function serviceButtonClick(thisBtn) {
    const value = $(thisBtn).prop('name');
    $(`#${value}`).prop('checked', false);
    showServiceArea()
}

// 點擊 modal 中的取消 => 重新把資料庫的內容渲染到畫面
$("#modalCancel").click(function () {
    renewPage();
})

// 點擊 modal 中的送出 => 把更新的內容存到資料庫
$("#modalSubmit").click(function () {
    var data = {
        "shop_address": $("#shopAddress").val(),
        "shop_phone": $("#shopPhone").val(),
        "shop_email": $("#shopEmail").val(),
        "shop_parking": $("#sParking").prop('checked'),
        "shop_child": $("#sChild").prop('checked'),
        "shop_pet": $("#sPet").prop('checked'),
        "shop_credit_card": $("#sCreditCard").prop('checked'),
        "shop_linepay": $("#slinePay").prop('checked'),
        "shop_jkopay": $("#sJko").prop('checked'),
        "class_id": $("#shopClass").val(),
    };

    $.ajax({
        url: "/putClient/info",
        type: "put",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data) {
            console.log("成功拉!!!");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    })

    window.location = "/backstage/clientinfo";

})

/* *********************************
        營業時間區
********************************* */

// 設定營業時間的按鈕事件
function setWorkDayBtn() {
    $(".week-area button").on('click', function () {
        if ($(this).hasClass('btn-orange')) {
            // 變更按鈕樣式
            $(this).removeClass('btn-orange');
            $(this).addClass('btn-break');
        } else {
            // 變更按鈕樣式
            $(this).removeClass('btn-break');
            $(this).addClass('btn-orange');
        }
    })
}

// 按營業時間 + 按鈕的事件
function SetIncreaseTimeBtn() {
    let timeNum = $(".time-area>div").length;
    switch (timeNum) {
        case 0: {
            getServiceTimeElem(timeNum); // 新增營業時間的輸入框
            let btn = '<button onclick="SetIncreaseTimeBtn()"><i class="material-icons">add</i></button>'; // 新增 + 按鈕在第一個輸入框後面
            $(".time-area>div").eq(timeNum).append(btn);
            break;
        }
        case 1: {
            getServiceTimeElem(timeNum); // 新增營業時間的輸入框
            let btn1 = '<button onclick="SetIncreaseTimeBtn()"><i class="material-icons">add</i></button>';
            let btn2 = '<button onclick="SetDecreaseTimeBtn()"><i class="material-icons">remove</i></button>';
            $(".time-area>div").eq(1).append(btn1);
            $(".time-area>div").eq(1).append(btn2);
            $(".time-area>div").eq(0).children('button').remove(); // 拿掉第一個輸入框後面的按鈕
            break;
        }
        case 2: {
            getServiceTimeElem(timeNum); // 新增營業時間的輸入框
            let btn2 = '<button onclick="SetDecreaseTimeBtn()"><i class="material-icons">remove</i></button>';
            $(".time-area>div").eq(2).append(btn2);
            $(".time-area>div").eq(1).children('button').remove(); // 拿掉第二個輸入框後面的按鈕
            break;
        }
    }
}

// 按營業時間 - 按鈕的事件
function SetDecreaseTimeBtn() {
    let timeNum = $(".time-area>div").length;
    switch (timeNum) {
        case 2: {
            $(".time-area>div").eq(1).remove();
            let btn = '<button onclick="SetIncreaseTimeBtn()"><i class="material-icons">add</i></button>';
            $(".time-area>div").eq(0).append(btn);
            break;
        }
        case 3: {
            $(".time-area>div").eq(2).remove();
            let btn = '<button onclick="SetIncreaseTimeBtn()"><i class="material-icons">add</i></button>';
            let btn2 = '<button onclick="SetDecreaseTimeBtn()"><i class="material-icons">remove</i></button>';
            $(".time-area>div").eq(1).append(btn);
            $(".time-area>div").eq(1).append(btn2);
            break;
        }
    }
}

// 計算有幾個營業時間區塊
function getServiceTimeElem(timeNum) {
    let titleList = ['營業時段一', '營業時段二', '營業時段三'];
    let timediv = `
        <div class="d-flex flex-row py-1 align-items-center">
        <p class="m-0 me-4">${titleList[timeNum]}</p>
            <div class="d-flex flex-row align-items-center me-3">
                <div class="d-flex flex-row">                    
                    <input type="text" class="form-control" required>
                    <span>&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <input type="text" class="form-control" required>
                </div>
                <span class="mx-4">至</span>
                <div class="d-flex flex-row">                    
                    <input type="text" class="form-control" required>
                    <span>&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <input type="text" class="form-control" required>
                </div>
            </div>
        </div>`;
    $('.time-area').append(timediv);
}


/* *********************************
        檔案上傳區
********************************* */
function showImg(target, ifLogo) {
    let fileType = (ifLogo) ? file_logo.type : file_index.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"] // 只吃這幾種圖片格式
    if (validExtensions.includes(fileType)) { // 如果格式是圖片
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result; // 存 src
            let imgTag = `<img src="${fileURL}" class="img-fluid h-100" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
            $(target).prev().html(imgTag);
            setHoverEvent($(target).parent()); // 綁定 hover 事件
        }
        if (ifLogo) {
            fileReader.readAsDataURL(file_logo);
        } else {
            fileReader.readAsDataURL(file_index);
        }
    } else {
        swal("上傳的格式不支援", "請確定上傳的檔案格式為 .jpg 或 .png", "warning");
    }
}

// 當 hover 商家圖的預覽圖的時候，改變透明度，出現編輯icon
function setHoverEvent(e) {
    $(e).mouseenter(({ target }) => {
        let editIcon = `<i class="bi bi-pencil-square"></i>`;
        $(target).append(editIcon); // 加入編輯 icon
        $(target).find('img').css('opacity', '0.3'); // 半透明
    })

    $(e).mouseleave(({ target }) => {
        $(target).find('.bi-pencil-square').remove(); // 拿掉編輯 icon
        $(target).find('img').css('opacity', '1'); // 不透明
    })

}

// 當資料庫有店家圖片時，載入店家圖片
function setInitialImg({ shop_logo_img, shop_index_img }) {
    if (shop_logo_img) {
        let imgTag = `<img src="${shop_logo_img}" class="img-fluid h-100" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
        $(".img_upload").eq(1).children('div').html(imgTag);
        setHoverEvent($(".img_upload").eq(1));

        if (shop_logo_img) { //如果資料庫有logo，則呈現在左側menu
            // $('.avatar img').attr('src', shop_logo_img); // 左側換頭像
        }
    }

    if (shop_index_img) {
        let imgTag = `<img src="${shop_index_img}" class="img-fluid h-100" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
        $(".img_upload").eq(0).children('div').html(imgTag);
        setHoverEvent($(".img_upload").eq(0));
    }
}

// 檔案上傳區的按鈕事件-新增
$(".upload-area-btn button:even").on('click', function ({ target }) {
    // 更新資料庫的資料
    var areaId = $(target).parent().siblings('.img_upload').prop("id");

    if (areaId == 'index_img') {
        shopImgUpdate(0, file_index.name);
    } else if (areaId == 'logo_img') {
        shopImgUpdate(1, file_logo.name);
    }

});

// 檔案上傳區的按鈕事件-刪除
$(".upload-area-btn button:odd").on('click', function ({ target }) {

    let fileInputElem = `
        <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
        <p>尚未選擇檔案</p>
    `;
    // 刪除圖片預覽區的圖片
    $(target).parent().siblings('.img_upload').children('div').html(fileInputElem);

    // 刪除資料庫的資料
    var areaId = $(target).parent().siblings('.img_upload').prop("id");
    shopImgDel(areaId);
});


// 刪除檔案上傳區圖片
function shopImgDel(target) {

    let data = {};
    data["target"] = `shop_${target}`;

    $.ajax({
        url: "/putClient/shopImgDel",
        type: "put",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: async function (data) {
            if ($.cookie('potential')) {
                await setPotentialData(data);
            } else {
                await swal('儲存成功', '', 'success');
                await (function () {
                    window.location = "/backstage/clientinfo";
                }());
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log("更新錯誤");
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    })
}

// 更新檔案上傳區圖片
function shopImgUpdate(target, fileName) {
    // 建立一個 FormData 物件
    const formData = new FormData();

    // 加入檔案到表單中
    if (target == 0) {
        formData.append('file', $('#file_index')[0].files[0]);
        formData.append('json', JSON.stringify({
            "fName": 'banner',
            "column": 'shop_index_img'
        }));

    } else if (target == 1) {
        formData.append('file', $('#file_logo')[0].files[0]);
        formData.append('json', JSON.stringify({
            "fName": 'logo',
            "column": 'shop_logo_img'
        }));
    }

    $.ajax({
        url: "/putClient/shopImgUpdate",
        method: "POST",
        data: formData,
        processData: false, // 不處理表單數據
        contentType: false, // 不設置內容類型
        success: async function (response) {
            // console.log(response);
            if ($.cookie('potential')) {
                await setPotentialData(data);
            } else {
                await swal('儲存成功', '', 'success');
                await (function () {
                    window.location = "/backstage/clientinfo";
                }());
            }
        },
        error: async function (err) {
            // 發生錯誤時執行的動作
            await swal('儲存失敗', '', 'warning');
            await (function () {
                window.location = "/backstage/clientinfo";
            }());
            console.log(err); // 在console中印出錯誤訊息
        }
    })
}









