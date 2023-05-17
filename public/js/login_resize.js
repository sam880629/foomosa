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

// 處理登入取得的資訊
function onSignIn(response) {
    var credential = response.credential;
    var profile = JSON.parse(decodeURIComponent(escape(window.atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))));

    // 將抓到的 google profile 傳到 server
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/googleId",
        data: {
            pId:profile.sub,
            pName: profile.name,
            pAvatar: profile.picture,
            pEmail: profile.email,
        },
        success: function () {
            location.href = "http://localhost:3000/index";
        }

    })
}

