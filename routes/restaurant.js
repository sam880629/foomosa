var express = require('express');
var app = express();
const axios = require('axios'); // 引入 axios

//判斷營業時間
function isOpen(shop, currentTime, dayOff) { // 從 currentTime 得到現在的 hr 和 min

    // 判斷是否有設定臨時店休，且是否與當前日期相同
    if(dayOff && dayOff.toDateString() === currentTime.toDateString()){ //檢查與今天日期是否相同
        return false; //如果 dayOff 為 null ，代表店家關閉
    }

    const currentHours = currentTime.getHours(); //現在的 hr
    const currentMinutes = currentTime.getMinutes();//現在的 min

    //1. shop.shop_start_1 是字串，格式為 "HH:mm"。
    //2. .split(':') 將字串以 冒號 分隔，返回一組由 時、 分 組成的數。Ex: "09:00" => ["09", "00"]。
    //3. [0] 取 09 (時)；[1] 取 00 (分)。
    //4. > 比較現在時間是否在開始時間之後。
    //5. === 如果現在時間的 hr 與開始時間相等，則檢查現在時間的 min 是否大於等於開始時間的 min 。
    //6. < 比較現在時間是否在結束時間之前，如果 hr 一樣則檢查 min。

    const morningShift = 
    (currentHours > parseInt(shop.shop_start_1.split(':')[0]) || (currentHours === parseInt(shop.shop_start_1.split(':')[0]) && currentMinutes >= parseInt(shop.shop_start_1.split(':')[1]))) &&
    (currentHours < parseInt(shop.shop_end_1.split(':')[0]) || (currentHours === parseInt(shop.shop_end_1.split(':')[0]) && currentMinutes <= parseInt(shop.shop_end_1.split(':')[1])));
    
    // 如果 shop_start_2 和 shop_end_2 為 null，只需要返回上午時段
    if (shop.shop_start_2 === null || shop.shop_end_2 === null) {
        
        return morningShift;
    }

    // 判斷現在時間是否在下午時段的開放範圍內
    const afternoonShift = 
    (currentHours > parseInt(shop.shop_start_2.split(':')[0]) || (currentHours === parseInt(shop.shop_start_2.split(':')[0]) && currentMinutes >= parseInt(shop.shop_start_2.split(':')[1]))) &&
    (currentHours < parseInt(shop.shop_end_2.split(':')[0]) || (currentHours === parseInt(shop.shop_end_2.split(':')[0]) && currentMinutes <= parseInt(shop.shop_end_2.split(':')[1])));

    return morningShift || afternoonShift; //返回 true 的結果
}

// 路由
app.get('/:id', async function (req, res) { // 修改路由以接收 id 參數
    try {
        // 發送 GET 請求至 restaurantSelect.js，並等待回應
        const response = await axios.get(`http://localhost:3000/restaurant/select/${req.params.id}?uid=${req.session.uid}`);
        // 使用從 restaurantSelect.js 獲得的數據渲染頁面
        const currentTime = new Date(); // 獲得現在時間
        const utcDate = new Date(response.data[6][0].dayoff_recently);//獲得dayoff的今日日期
        const offset = currentTime.getTimezoneOffset(); 
        const dayOff = new Date(utcDate.getTime() - offset*60*1000); //轉換時區

        const openStatus = isOpen(response.data[0][0], currentTime, dayOff ) ? '營業中' : '店休中';
        const statusColor = openStatus === '營業中' ? '#F89E02' : '#B7B7B7';
        req.session.url = req.originalUrl;//存取當前網址
        // console.log('我要看Current URL:', req.session.url);
        // console.log( '我要看uid');
        // console.log( req.session.uid);
        // console.log( '我要看shopId');
        // console.log( req.session.shopId);
        // console.log( '我要看shopLogo');
        // console.log( req.session.shopLogo);
        // console.log( '我要看dayoff');
        // console.log(dayOff);
        res.render('restaurant', {
            // shops: response.data, // 將整個結果集傳遞給 EJS 模板
            shop: response.data[0][0],
            shopClass: response.data[1][0],
            menu: response.data[2],
            active:response.data[3][0],
            userAvatar:response.data[4][0],
            comment:response.data[5][0]|| { comment_favorite: 0},//if response.data[5][0] 是 undefined 或 null，則 comment_favorite: 0 
            openStatus,
            statusColor,
            user: req.session.uid,//session  user id
            shopId: req.session.shopId, // session shop id
            shopLogo:req.session.shopLogo
        });
    } catch (error) { // 如果 try 語句中的代碼出現錯誤，則執行 catch 語句
        console.error(error); // 輸出錯誤信息至控制台
        res.send('無法獲取餐廳資訊'); // 向用戶發送錯誤信息
    }
});

module.exports = app;