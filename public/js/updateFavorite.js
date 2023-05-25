// -- 獲取店家指定 id
document.addEventListener('DOMContentLoaded', function () { //-- DOMContentLoaded 不須等待外部資源讀取完成即可執行 function
    var FavoritesButton = document.querySelector('#favoritesButton');
    var submitfavoritesButton = document.querySelector('#submitfavoritesButton');

    //-- 為 commentButton 添加一個 show.bs.modal 事件監聽器。這個事件在 Bootstrap Modal（對話框）顯示之前觸發。
    FavoritesButton.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        var getShop_id = event.relatedTarget;
        // 從 id 為 data-shop-id 的觸發按鈕屬性中獲取 shopId
        var shopId = getShop_id.getAttribute('data-shop-id');
        // 從彈出視窗中取得 data-comment-favorite 的值
        var commentFavorite = FavoritesButton.getAttribute('data-comment-favorite');
        // 再從 shopId 獲得的店家 id 帶入至 #submitfavoritesButton 按鈕當中
        submitfavoritesButton.setAttribute('data-shop-id', shopId);
        // 將 commentFavorite 設定至 #submitfavoritesButton 按鈕當中
        submitfavoritesButton.setAttribute('data-comment-favorite', commentFavorite);
    });
});

//--我的最愛 update $.ajax 請求
updateFavorite = (button) => {
    const shop_id = button.getAttribute("data-shop-id");
    const comment_favorite = button.getAttribute("data-comment-favorite") == 1 ? 0 : 0;
    // console.log("美食口袋更新成功!");
    // console.log("我是店家ID: " + shop_id);
    // console.log("收藏值: " + comment_favorite);

    var data = {
        shop_id: shop_id,
        comment_favorite: comment_favorite
    };
    console.log(data);
    $.ajax({
        url: '/membership/update/comment_Favorite/' + shop_id,
        type: 'PUT',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (result) {
            // console.log(result);
            alert('更新口袋名單成功！');
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
        },
        error: function (err) {
            console.log(err);
            alert('更新口袋名單失敗！');
        }
    });
}

//--星星評論 update $.ajax 請求
document.querySelectorAll('.comment-star-input').forEach(function(input) {
    input.addEventListener('change', function() {
        let id = $(this).attr('id');
        let shop_id = $("#shop_id-" + id).val();
        let user_id = $("#user_id-" + id).val();
        let comment_star = $(this).val();
        
        $.ajax({
          url: '/membership/update/commentStar',  // 你的路由
          method: 'POST',
          data: {
            shop_id: shop_id,
            user_id: user_id,
            comment_star: comment_star
          },
          success: function(response) {
            setTimeout(function() {
                alert("星星評論更新成功!");
                // console.log(response);
              }, 700);
          },
          error: function(error) {
            console.error(error);
            // 在这里处理错误。例如，你可能想在页面上显示一个消息，告诉用户更新失败。
          }
        });
    });
});

