$(document).ready(() => {

    resize(); // 當調整視窗大小的時候，調整 card 區域圖片的寬度

    // 抓 cookie 有沒有剛剛註冊失敗的紀錄
    switch ($.cookie('signupErr')) {
        case '0':
            swal("信箱驗證信已送出", "請完成信箱驗證", "success");
            break;
        case '1':
            $('#userAccount').val($.cookie('email'));
            $('#userPW').css("border-color", 'red');
            swal("您已經申請過!", "請完成信箱驗證", "error");
            break;
    }

    // 資料驗證
    // 抓cookie
    if ($.cookie('emailDup')) {
        swal("此電子郵件已註冊!", "請直接登入", "warning");
    }

    // 判斷密碼跟確認密碼是不是相同
    $("#userPwConfirm").on('focusout', () => {
        let pw1 = $('#userPW').val();
        let pw2 = $('#userPwConfirm').val();

        if (pw1 && pw2 != pw1) {
            $('#userPwConfirm').css("border-color", "red");
            // 您輸入的兩個密碼並不相符，請再試一次。
            swal("", "您輸入的兩個密碼並不相符", "warning");
        }
    })


    // ----------------------- 這邊是開發中的區域 --------------------------
    // 進行 google account 初始化
    function startSignIn() {
        google.accounts.id.initialize({
            client_id: "1043228888977-p1mm0ld5p7ncpinsa9avguqj6h8p3l3u.apps.googleusercontent.com",
            callback: onSignIn,
        });
        google.accounts.id.prompt();
    }

    // 處理登入取得的資訊
    function onSignIn(response) {
        var credential = response.credential;
        var profile = JSON.parse(decodeURIComponent(escape(window.atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))));

        // console.log("會員暱稱: " + profile.name);
        // console.log("會員頭像: " + profile.picture);
        // console.log("會員email: " + profile.email);

        // 將抓到的 google profile 傳到 server
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/googleId",
            data: {
                pName: profile.name,
                pAvatar: profile.picture,
                pEmail: profile.email,
            },
            success: function () {
                location.href = "http://localhost:3000/";
            }

        })
    }

    // 點擊登入
    $("#GOOGLE_login").click(function () {
        // 進行登入程序
        startSignIn();
    });
})

// 啟動 toggle
$(document).ready(() => {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });
})

// 當調整視窗大小的時候，調整 card 區域圖片的寬度
function resize() {
    let clientWidth = document.body.clientWidth;
    let imgsize = clientWidth * 0.375 - (clientWidth - $(".signupCardArea").width()) / 2;
    $('.signup-img-area').width(imgsize);

    $(window).resize(function () {
        let clientWidth = document.body.clientWidth;
        let imgsize = clientWidth * 0.375 - (clientWidth - $(".signupCardArea").width()) / 2;

        $('.signup-img-area').width(imgsize);
    })
}