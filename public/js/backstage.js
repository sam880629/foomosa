$('.avatar').on('click', function () {
    // console.log("安安安");
    swalOpen();
})

function swalOpen() {
    swal("是否確認將今天設為臨時店休日?", {
        // buttons: ["準備中!", true],
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
        if (result1) { //如果按開店的話，會將
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

function changeDayoff() {
    $.ajax({
        url: "/putClient/dayoff",
        type: "put",
        // contentType: "application/json",
        // data: JSON.stringify(data),
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