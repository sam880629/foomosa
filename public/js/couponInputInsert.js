// // 獲取 #couponCode 輸入框的值
// var couponInput = document.getElementById('couponCode');
// var coupon_code = document.getElementById('codeButton').getAttribute("data-user-coupon");
// console.log(coupon_code);

// // 綁定 #couponCode 輸入框的 keypress 事件
// couponInput.addEventListener('keypress', function (event) {
//     // 如果按下的是Enter鍵
//     if (event.key === "Enter") {
//         // 獲取輸入的coupon code
//         var couponInputCode = couponInput.value;
//         console.log(couponInputCode);

//         // 表 Coupon 當中的 coupon_code
//         var coupon_code = coupon_code.value;
//         console.log(coupon_code);
        
//         // 獲取user_id
//         var user_id = $('#user_id').val();
//         console.log(user_id);

//         // 發送POST請求，將coupon code傳到後端
//         $.ajax({
//             type: 'POST',
//             url: '/membership/insert/coupon_insert',
//             data: {
//                 coupon_code: couponInputCode,
//                 user_id: user_id,
//             },
//             success: function (response) {
//                 // 如果後端回傳success訊息，代表coupon新增成功
//                 if (response.status === 'success') {
//                     alert('優惠券新增成功!!');
//                     window.location.reload(); // 重新載入頁面以顯示更新後的優惠券列表
//                 } else {
//                     // 如果後端回傳error訊息，代表coupon新增失敗
//                     alert('優惠券新增失敗');
//                 }
//             },
//             error: function (error) {
//                 console.error('新增失敗', error);
//             }
//         });
//     }
// });


// 獲取使用者輸入的值 #couponCode 
var couponInput = document.getElementById('couponCode');
// 獲取按鈕 #codeButton 輸入框的值
let couponList = $("#codeButton").attr("data-user-coupon");
// var couponList = document.getElementById('codeButton').getAttribute("data-user-coupon");
var coupons = [];
// console.log(couponList);

// 綁定 #couponCode 輸入框的 keypress 事件
if (couponList != undefined){
    coupons = JSON.parse(couponList);
}
couponInput.addEventListener('keypress', function (event) {
    // 如果按下的是Enter鍵則會觸發
    if (event.key === "Enter") {
        // 獲取輸入的coupon code
        var couponInputCode = couponInput.value;
        // console.log("我是使用者輸入的: "+couponInputCode);

        // 判斷是否已經輸入過該優惠券
        var couponExists = false;
        for (var i = 0; i < coupons.length; i++) {
            var coupon_code = coupons[i].coupon_code;
            if (couponInputCode === coupon_code) {
                couponExists = true;
                break;
            }
        }

        // 如果優惠券已存在，顯示提示訊息
        if (couponExists) {
            alert('此優惠券您已經輸入或使用過。');
        } else {
            // 獲取user_id
            var user_id = $('#user_id').val();
            // console.log(user_id);

            // 發送POST請求，將coupon code傳到後端
            $.ajax({
                type: 'POST',
                url: '/membership/insert/coupon_insert',
                data: {
                    coupon_code: couponInputCode,
                    user_id: user_id,
                },
                success: function (response) {
                    // 如果後端回傳success訊息，代表coupon新增成功
                    if (response.status === 'success') {
                        alert('優惠券新增成功!!');
                        window.location.reload(); // 重新載入頁面以顯示更新後的優惠券列表
                    } else {
                        // 如果後端回傳error訊息，代表coupon新增失敗
                        alert('請輸入有效的優惠碼。');
                    }
                },
                error: function (error) {
                    console.error('新增失敗', error);
                }
            });
        }
    }
});