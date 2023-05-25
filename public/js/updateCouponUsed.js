//-- 獲得指定的 shop_id
document.addEventListener('DOMContentLoaded', function () {
    var couponModal = document.getElementById('coupanButton');
    var selectedShopIdInput = document.querySelector('#selectedShopId');
    var selectedUserCouponId = document.querySelector('#selectedUserCouponId');

    couponModal.addEventListener('show.bs.modal', function (event) {
        // 觸發 Modal 當中的 Button 事件 
        var button = event.relatedTarget;

        // 取得 shop_id
        var selectedShopId = button.getAttribute('data-shop-id');
        // console.log("我是店家ID: " + selectedShopId);

        // 取得 coupon-id
        var userCouponId = button.getAttribute('data-user-coupon-id');
        // console.log("我是user-coupon-id: " + userCouponId);

        // 取得 user 列表
        var userCoupon = JSON.parse(button.getAttribute('data-user-coupon'));
        // console.log(userCoupon);

        // Button 選取到的 shop ID 放入置 id 為 selectedShop 的 Input
        selectedShopIdInput.value = selectedShopId;

        // Button 選取到的 user_Coupon_id 放入置 id 為 selectedUserCouponId 的 Input
        selectedUserCouponId.value = userCouponId;

        // 更新優惠券名稱 couponNameList 資訊
        var couponNameList = document.getElementById('couponNameList');
        couponNameList.innerHTML = '優惠券名稱 :　';

        // 更新優惠到期日 couponExpireList 資訊
        var couponExpireList = document.getElementById('couponExpireList');
        couponExpireList.innerHTML = '優惠到期日 :　';

        // 更新優惠到期日 couponExpireList 資訊
        var couponTextList = document.getElementById('coupontextList');
        couponTextList.innerHTML = '優惠券說明 :　';

        // 根據所選取 shop_id ，來顯示指定的優惠券名稱

        var renderedCouponIds = [];
        userCoupon.forEach((item) => {
            // console.log(item);
            if (item.shop_id == selectedShopId && item.user_coupon_id == userCouponId) {
                var couponName = document.createElement('span');
                couponName.textContent = item.coupon_name;
                couponNameList.appendChild(couponName);

                var couponExpire = document.createElement('span');
                couponExpire.textContent = item.coupon_expire;
                couponExpireList.appendChild(couponExpire);

                var couponText = document.createElement('span');
                couponText.textContent = item.coupon_text;
                couponTextList.appendChild(couponText);

                renderedCouponIds.push(item.coupon_id);
            }
        });
    });
});


//--優惠券 update $.ajax 請求

function updateCouponUsed() {
    // 獲取當前選擇的 shop_id
    var selectedShopIdInput = document.querySelector('#selectedShopId');
    var shop_id = selectedShopIdInput.value;
    console.log("我是shop_id: " + shop_id);

    // 獲取相對應的 user_coupon_id
    var selectedUserCouponId = document.getElementById('selectedUserCouponId');
    var user_coupon_id = selectedUserCouponId.value;
    console.log("我是 user_coupon_id: " + user_coupon_id);
    // var user_coupon_id_array = user_coupon_id.split(','); // 如果user_coupon_id是一個由逗號分隔的字符串


    // 創建 $.ajax 請求
    $.ajax({
        type: 'PUT',
        url: '/membership/update/coupon_used/',
        contentType: 'application/json',
        data: JSON.stringify({
            shop_id: shop_id,
            user_coupon_id: user_coupon_id
        }),
        success: function (response) {
            alert('優惠券已成功使用');
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
        },
        error: function (error) {
            console.error('更新失敗', error);
        }
    });
}