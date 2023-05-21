$(document).ready(() => {
    // 當調整視窗大小的時候，調整 card 區域圖片的寬度
    let clientWidth = document.body.clientWidth;
    let imgsize = clientWidth * 0.45 - (clientWidth - $(".signupCardArea").width()) / 2;
    $('.login-img-area').width(imgsize);

    $(window).resize(function () {
        let clientWidth = document.body.clientWidth;
        let imgsize = clientWidth * 0.45 - (clientWidth - $(".signupCardArea").width()) / 2;

        $('.login-img-area').width(imgsize);
    })

    // 會員資料驗證
    // 抓cookie
    switch ($.cookie('loginErr')) {
        case '0':
            swal("此電子郵件尚未註冊!", "請檢查電子郵件", "error");
            break;
        case '1':
            $('#userAccount').val($.cookie('email'));
            $('#userPW').css("border-color", 'red');
            swal("密碼錯誤!", "請再試一次，或按一下「忘記密碼」以重設密碼", "error");
            break;
        case '2':
            swal("您尚未註冊成為合作夥伴!", "歡迎註冊加入 Foomosa", "error");
            break;
        case '3':
            $('#userPW').css("border-color", 'red');
            swal("密碼錯誤!", "請再試一次，或按一下「忘記密碼」以重設密碼", "error");
            break;
        case '4':
            swal("您的 email 已用其他方式註冊!", "請直接登入", "error");
            break;
    }

    // demo 時，點一下密碼框會自動帶入 'mosamosa'
    $('#pills-client input[name = "clientPw"]').on('focus', (e) => {
        $(e.target).val("mosamosa");
    })

    // demo 時，點一下帳號框會自動帶入 '88888888'
    $('#pills-client input[name = "clientAccount"]').on('focus', (e) => {
        // $(e.target).val("88888888");
        $(e.target).val("87291941"); // 添好運
    })

    // demo 時，點一下密碼框會自動帶入 '1111'
    $('#pills-user input[name = "userPW"]').on('focus', (e) => {
        $(e.target).val("1111");
    })

    // demo 時，點一下帳號框會自動帶入 '88888888'
    $('#pills-user input[name = "userAccount"]').on('focus', (e) => {
        // $(e.target).val("88888888");
        $(e.target).val("aniki@gmail.com"); // 藤井風
    })

})



// tab-content
$(document).ready(() => {
    const triggerTabList = [].slice.call(document.querySelectorAll('#myTab a'));
    triggerTabList.forEach((triggerEl) => {
        const tabTrigger = new mdb.Tab(triggerEl);

        triggerEl.addEventListener('click', (event) => {
            event.preventDefault();
            tabTrigger.show();
        });
    });
})

// 處理 google 登入取得的資訊
function onSignIn(response) {
    var credential = response.credential;
    var profile = JSON.parse(decodeURIComponent(escape(window.atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))));

    // 將抓到的 google profile 傳到 server
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/googleId",
        data: {
            pId: profile.sub,
            pName: profile.name,
            pAvatar: profile.picture,
            pEmail: profile.email,
        },
        success: function (result) {
            location.href = result;
        }
    })
}


// 處理 fb 登入取得的資訊
// 確認現在此時此刻的 FB 登入狀態
function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        fbAPI();
    } else {
    }
}

// 設置 fb 的初始化資料
window.fbAsyncInit = function () {
    FB.init({
        appId: '6182196765194717',
        cookie: true,                     // Enable cookies to allow the server to access the session.
        xfbml: true,                     // Parse social plugins on this webpage.
        version: 'v16.0'           // Use this Graph API version for this call.
    });
};

// 設置 fb 的初始化
function fbAPI() {
    FB.api('/me', { fields: 'email,name,id,picture.type(large)' }, function (response) {
        // console.log(response.email);
        // console.log(response.name);
        // console.log(response.id);
        // console.log(response.picture.data.url);
        fbLoginToServer(response.email, response.name, response.id, response.picture.data.url);
    });
}


// fb 按鈕點進去的事件
$("#fbLogin").on('click', function () {
    FB.login(function (response) {
        console.log(response);
        statusChangeCallback(response); // Called after the JS SDK has been initialized.
    }, { scope: 'public_profile,email,user_photos' }); // Returns the login status.
})

// 將抓到的 Fb profile 傳到 server
function fbLoginToServer(email, name, id, url) {
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/fbId",
        data: {
            pId: id,
            pName: name,
            pAvatar: url,
            pEmail: email,
        },
        success: function (result) {
            location.href = result;
        }
    })
}

