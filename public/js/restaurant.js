$(document).ready(function () {
    $('#logout_btn').on('click', function () {
        $.get('/logout').then(location.reload());
    })
})
function delay(slow) { //我等一下要使用 promise
    return new Promise(resolve => setTimeout(resolve, slow));
}

//按下搜尋按鈕搜尋
$(document).ready(function () {
    $('#shopSearch_btn').on('click', function () {
        wordToMatch = $('#shopSearch_text').val();
        document.cookie = `shop_Name=${wordToMatch}`;
        alert('OK');
        let url = 'http://localhost:3000/search/';
        url = (wordToMatch == '') ? url + 'all' : url + `name/${wordToMatch}`;
        window.location.assign(url);
    })
})

// information 
// 加入我的最愛
$(document).ready(function () {
    var flag = true;
    $('#heart').on('click', async function () {

        const shop_id = $('#like').data('shop-id'); // 獲取 shop_id

        $('#like').removeClass('bi bi-suit-heart').addClass('bi bi-suit-heart-fill');

        if (flag) {
            $('#like').removeClass('bi bi-suit-heart').addClass('bi bi-suit-heart-fill');
            await delay(100); //慢 0.1秒 出現 alert
            alert('收藏成功!');

        } else {
            $('#like').removeClass('bi bi-suit-heart-fill').addClass('bi bi-suit-heart');
            // await delay(100);
            console.log('取消收藏');
        }
        flag = !flag;

        console.log('發送收藏請求:', { shop_id, comment_favorite: !flag ? 1 : 0 });

        // 發送 AJAX 請求
        $.ajax({
            type: 'POST', // 設定 HTTP 請求方法為 POST
            url: '/restaurant/insert/toggleHeart',// 設定伺服器端的 URL
            data: JSON.stringify({ shop_id, comment_favorite: !flag ? 1 : 0 }), // 將 shop_id 和 comment_favorite 以 JSON 格式傳遞給伺服器端 ，為 POST 發送
            contentType: 'application/json', // 設定傳遞資料的內容類型為 JSON
            success: function (response) {// 請求成功時執行。response 是伺服器端回傳的資料
                console.log('操作成功:', response.message);//response.message是後端API返回的json物件的一個屬性
            },

            error: function (jqXHR, textStatus, errorThrown) {  //請求失敗時執行
                console.error('錯誤訊息：', textStatus, errorThrown);
                // jqXHR: 是 jQuery XMLHttpRequest 物件，用於封裝 HTTP 請求資訊和處理回應
                // textStatus: 是描述請求結果的文字，例如 "timeout"、"error"、"abort" 等
                // errorThrown: 是可捕獲的異常物件，例如 HTTP 狀態碼或伺服器端的錯誤訊息
            }
        });
    });

})

// 星星評論
let selectedRate = null;
$(function () {
    $('.star input[type=radio]').on('change', function () {
        selectedRate = $('input[name=rate]:checked').val();
        console.log(selectedRate);// 查看星星數
    });

})

// 提交表單
$(function () {
    $("#submit-comment-form").submit(async function (e) {
        e.preventDefault(); // 阻止表單的默認提交行為

        // 獲取表單數據
        const shop_id = $('input[name="shop_id"]').val();
        const rate = selectedRate;
        const comment = $('textarea[name="comment"]').val();
        console.log(comment); // 查看評論內容

        //發送 AJAX 請求
        $.ajax({
            type: "POST",
            url: "/restaurant/insert/rate",
            data: JSON.stringify({ shop_id, rate, comment }),
            contentType: 'application/json',
            success: async function (response) {
                alert(`${response.message}`); // 顯示後端返回的消息
                await delay(100);
                window.location.reload(); // 重新加載頁面
            },
            error: function (jqXHR) {
                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    alert(jqXHR.responseJSON.message);
                } else {
                    alert("提交評論時出錯");
                }
                console.error('錯誤訊息：', textStatus, errorThrown);
            }
        });
    });
})

// Foodcard 
// 價格比較
$(document).ready(function () {
    $('.foodcard').hover(function () {
        // 動態生成 popover 內容
        var menuPrice = $(this).data('menu-price');
        var ubereat = $(this).data('menu-uber');
        var foodpanda = $(this).data('menu-panda');

        //判斷店家是否有提供兩間服務，沒有整列回傳空字串
        var uberPriceRow = ubereat ? `<div class="mt-3"><img src="/pic/UberPrice.png"><span class="ps-3 h6">${ubereat}元</span></div>` : '';
        var pandaPriceRow = foodpanda ? `<div class="mt-3"><img src="/pic/PandaPrice.png"><span class="ps-3 h6">${foodpanda}元</span></div>` : '';

        var popoverContent = `<div><span class="h6">本店價&nbsp&nbsp&nbsp&nbsp&nbsp<span class="ps-4">${menuPrice}元</span></span>${uberPriceRow}${pandaPriceRow}</div>`;

        // 顯示 popover
        $(this).popover({
            placement: 'bottom',
            trigger: 'hover',
            html: true,
            content: popoverContent
        }).popover('show');

    });

});


//評分 //評論Comment
$(function () {
    var rate = Math.random();
    var z = (rate * 3 + 2.5).toFixed(1); //亂數從3起跳
    var result = (z < 5) ? z : 5;
    $('.rate').text(result.toString());

    var comment = Math.random();
    var c = Math.floor(comment * 60 + 40);
    var comment = (c < 100) ? c : "100+";
    $('.rating span:last-child').text(`(${comment})`);
});

