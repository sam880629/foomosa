// 定義創建按鈕的函數
function createButton(text, id, onClick) {
    // 使用document.createElement創建一個新的<button>元素
    var button = document.createElement("button");
    button.className = "expanded-button";
    button.innerHTML = text;
    button.id = id;
    button.style.display = "inline-block";
    button.style.margin = "3px";
    button.style.color = "rgb(233, 151, 0)";
    // 將按鈕的點擊事件處理器設置為傳入的onClick函數
    button.onclick = onClick;
    return button;
}

// 定義一個函數來切換顯示或隱藏擴展按鈕
toggleButtons=() => {
    var expandedButtons = document.querySelector(".expandedButtons");
    expandedButtons.innerHTML = "";
    if (expandedButtons.style.display === "none" || expandedButtons.style.display === "") {
        // 首頁按鈕
        var leftButton = createButton("<i class='bi bi-house-door-fill'></i>", "leftButton", function () {
            window.location.href = "/index";
        });
        // 登出按鈕
        var rightButton = createButton("<i class='bi bi-box-arrow-right'></i>", "rightButton", function () {
            $.ajax({
                url: '/membership/logout',
                type: 'GET',
                success: function (result) {
                    window.location.href = "/index";
                }
            });
        });
        // 在擴展按鈕區域中添加新創建的首頁和登出按鈕
        expandedButtons.appendChild(leftButton);
        expandedButtons.appendChild(rightButton);
        expandedButtons.style.display = "inline-block";
    } else {
        expandedButtons.style.display = "none";
    }
}
