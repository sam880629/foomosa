// 左側欄位-使用者介面: 游標追蹤效果
document.querySelector(".left_Column_Container").addEventListener("mousemove", e => { //-- 當滑鼠移動時，會對每一個 class 名稱為 "card" 的元素執行以下動作：
    const cards = document.getElementsByClassName("user_Information");
    for (const card of cards) { //-- 使用 for...of 迴圈來遍歷 "cards" 常數中的每個元素，並將當前元素指定給常數 "card"
        const rect = card.getBoundingClientRect(); //-- 回傳一個 DOMRect 物件，其中包含了 x/y/width/height/top/right/bottom/left 等屬性。
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
});

// 左側欄位-兌換紀錄介面: 游標追蹤效果
document.querySelector(".left_Column_Container").addEventListener("mousemove", e => {
    const cards = document.getElementsByClassName("points_Exchange");
    for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
});

// 左側欄位-優惠券介面: 游標追蹤效果
document.querySelector(".left_Column_Container").addEventListener("mousemove", e => {
    const cards = document.getElementsByClassName("my_Coupon");
    for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
});

// 中間欄位-美食口袋介面: 游標追蹤效果
document.querySelector(".middle_Column").addEventListener("mousemove", e => {
    const cards = document.getElementsByClassName("middle_Column_Container");
    for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
});

// 右側欄位-我的評論介面: 游標追蹤效果
document.querySelector(".right_Column").addEventListener("mousemove", e => {
    const cards = document.getElementsByClassName("right_Column_Container");
    for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
});