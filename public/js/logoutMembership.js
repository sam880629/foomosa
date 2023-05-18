function createButton(text, id, onClick) {
    // 創建一個新的按鈕元素
    var button = document.createElement("button");
    button.className = "expanded-button";
    button.innerHTML = text;
    button.id = id;
    button.style.display = "inline-block";
    button.style.margin = "3px";
    button.style.color = "rgb(233, 151, 0)";
    // 傳入onClick函式
    button.onclick = onClick;
    return button;
}

// 切換顯示、隱藏按鈕
toggleButtons = () => {
    var expandedButtons = document.querySelector(".expandedButtons");
    expandedButtons.innerHTML = "";
    if (expandedButtons.style.display === "none" || expandedButtons.style.display === "") {
        // 首頁按鈕
        var leftButton = createButton("<i class='bi bi-house-door-fill'></i>", "leftButton", function () {
            window.location.href = "/index";
        });
        // 登出按鈕
        var rightButton = createButton("<i class='bi bi-box-arrow-right'></i>", "rightButton", function () {
            // 登出請求
            $.ajax({
                url: "/membership/update/logout",
                type: "POST",
                success: function(response) {
                    if (response.status === 200) {
                        alert(" 會員已成功登出!!");
                        window.location.href = "/index";
                    } else {
                        console.log("登出失敗");
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
        // 在空的 span.expandedButtons 中添加新增加的首頁和登出按鈕
        expandedButtons.appendChild(leftButton);
        expandedButtons.appendChild(rightButton);
        expandedButtons.style.display = "inline-block";
    } else {
        expandedButtons.style.display = "none";
    }
}
