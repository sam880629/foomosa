var tooltip;
// 啟動tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    tooltip = new bootstrap.Tooltip($('[data-toggle="tooltip"]'));
});

// tooltip.show();

// 點選頭像
$('.avatar').on('click', function () {
    if ($('.statusLight').hasClass('dayoff')) { // 已經是臨時工休日的話
        swalOpen();
    } else {
        swalClose();
    }
})

// 頭貼的 hover 效果
$(".status-info").on({
    mouseenter: function () {
        $('.avatar').children().css('-webkit-filter', 'drop-shadow(0px 0px 8px rgba(254, 191, 112, 0.71))');
        $('.avatar img').css('opacity', '0.85');

        tooltip.show();
    },
    mouseleave: function () {
        $('.avatar').children().css('-webkit-filter', 'none');
        $('.avatar img').css('opacity', '1');
        tooltip.hide();
    }
});

// 彈提示框顯示是否要臨時公休
function swalClose() {
    swal("是否確認將今天設為臨時店休日?", {
        closeOnClickOutside: false, // 按外面也不能關閉視窗
        closeOnEsc: false, // 按 esc 也不能關閉視窗
        buttons: {
            cancel: "取消",
            confirm: {
                text: "確認",
                className: "openBtn",
                value: true
            }
        }
    }).then((result1) => {
        if (result1) {
            swal('確認後，您店家頁面的營業狀態將對外顯示為"店休中"', {
                buttons: {
                    cancel: "取消",
                    confirm: {
                        text: "確認",
                        className: "openBtn",
                        value: true
                    }
                }
            }).then((result2) => {
                console.log(result2); // true
                changeDayoff();
            })
        }
    })

}

// 彈提示框顯示是否要取消臨時公休
function swalOpen() {
    swal("是否要恢復成營業中?", {
        closeOnClickOutside: false, // 按外面也不能關閉視窗
        closeOnEsc: false, // 按 esc 也不能關閉視窗
        buttons: {
            cancel: "取消",
            confirm: {
                text: "確認",
                className: "openBtn",
                value: true
            }
        }
    }).then((result) => {
        if (result) {
            changeDayoffCancel();
        }
    })
}

// 將臨時店休的日期存進資料庫
function changeDayoff() {
    $.ajax({
        url: "/putClient/dayoff",
        type: "put",
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
}

// 將資料庫的臨時店休日取消
function changeDayoffCancel() {
    $.ajax({
        url: "/putClient/dayoffCancel",
        type: "put",
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
}

// 判斷現在時間，決定 avatar 的營業點點要顯示什麼顏色
$.ajax({
    url: "/getClient/getDayoff",
    methed: "GET",
    datatype: "json",
    success: function (data) {

        let now = new Date(); // 系統現在時間
        let result = 0; // 判斷現在是否是營業時間

        let dayoff = new Date(data.dayoff_recently);
        let breakArray = data.shop_break.split(","); // 存公休日陣列
        if (dayoff.getFullYear() == now.getFullYear() && dayoff.getMonth() == now.getMonth() && dayoff.getDate() == now.getDate()) {
            result = 2; // 橘色
        } else if (breakArray.includes(now.getDay().toString())) {
            result = 0; // 灰色
        } else {
            let start1 = new Date();
            start1.setHours(data.shop_start_1.split(':')[0], data.shop_start_1.split(':')[1], 0);

            let end1 = new Date();
            end1.setHours(data.shop_end_1.split(':')[0], data.shop_end_1.split(':')[1], 0);

            if (now >= start1 && now <= end1) { // 判斷現在時間有沒有在營業時間 1 內
                result = 1; // 綠色
            }

            if (data.shop_start_2 && data.shop_end_2) { // 如果有營業時間2，判斷現在時間有沒有在營業時間2內
                let start2 = new Date();
                let end2 = new Date();
                start2.setHours(data.shop_start_2.split(':')[0], data.shop_start_2.split(':')[1], 0);
                end2.setHours(data.shop_end_2.split(':')[0], data.shop_end_2.split(':')[1], 0);

                if (now >= start2 && now <= end2) {
                    result = 1; // 綠色
                }
            }
        }
        setStatusLight(result);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // 發生錯誤時執行的動作
        console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
    }
})


// 改 .StatusLight 背景色
function setStatusLight(result) {
    switch (result) {
        case 0:
            $('.statusLight').css('background-color', '#B7B7B7');
            break;
        case 1:
            $('.statusLight').css('background-color', '#558C03');
            break;
        case 2:
            $('.statusLight').css('background-color', '#F28F16');
            $('.statusLight').addClass('dayoff');
            break;

    }
}

// 點選我的頁面button時，前往店家頁面
$('.btnContainer>button').eq(0).on('click', () => {
    $.ajax({
        url: "/getClient/getSessionId",
        methed: "GET",
        datatype: "json",
        success: function (data) {
            window.location.href = '/restaurant/' + data.shopId;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    })
})

$(".btnContainer>button").eq(1).on('click', ()=>{
    $.ajax({
        url: "/backstage/logout",
        method: "GET",
        success: function () {
            window.location.href = '/index';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    })
})