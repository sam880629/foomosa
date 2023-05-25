//-- 獲取店家指定 id
//-- DOMContentLoaded 不須等待外部資源讀取完成即可執行 function
document.addEventListener('DOMContentLoaded', function () {
    var commentButton = document.querySelector('#CommentButton');
    var submitCommentButton = document.querySelector('#submitCommentButton');

    //-- 為 commentButton 添加一個 show.bs.modal 事件監聽器。這個事件在 Bootstrap Modal（對話框）顯示之前觸發。
    commentButton.addEventListener('show.bs.modal', function (event) {
        // 從 Button 中獲取 data- 值
        var getButtonValue = event.relatedTarget;
        // 從 data-shop-id 屬性中獲取 shopId
        var shopId = getButtonValue.getAttribute('data-shop-id');
        // console.log("我是ID: " + shopId);
        // 將 shopId 獲得的店家 id 帶入至 #submitCommentButton 按鈕當中
        submitCommentButton.setAttribute('data-shop-id', shopId);

        // 從 data-user-comment-text 屬性中獲取 comment-text
        var userCommentText = getButtonValue.getAttribute("data-user-comment-text");
        // console.log(userCommentText);
        document.querySelector("#message-text").innerHTML = userCommentText;
    });
});

//-- 我的評論 update $.ajax 請求
updateCommentText = (button) => {
    // console.log("我的評論寫入成功!");
    const shopId = button.getAttribute('data-shop-id');
    var commentText = document.querySelector('#message-text').value;

    var data = {
        comment_text: commentText,
        shop_id: shopId
    };
    $.ajax({
        url: '/membership/update/comment_text/' + shopId,
        type: 'PUT',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (result) {
            // console.log(result);
            alert('評論更改成功！');
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
        },
        error: function (err) {
            alert('評論更改失敗！');
            console.log(err);
        }
    });
}