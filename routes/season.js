var express = require('express');
var app = express();
const axios = require('axios'); // 引入 axios

// 路由
app.get('/:season_id', async function (req, res) { // 修改路由以接收 id 參數
    try {
        // 發送 GET 請求至 seasonSelect.js，並等待回應
        const response = await axios.get(`http://localhost:3000/season/select/${req.params.season_id}`);
        // 使用從 seasonSelect.js 獲得的數據渲染頁面
        // console.log('查詢成功!', JSON.stringify(response.data));
        res.render('season', {
            //seasons: response.data, // 將整個結果集傳遞給 EJS 模板
            season: response.data[0],
            shops: response.data,
            currentId: Number(req.params.season_id) //// 將目前的 season_id 轉換為數值類型
        });
    } catch (error) { // 如果 try 語句中的代碼出現錯誤，則執行 catch 語句
        console.error(error); // 輸出錯誤信息至控制台
        res.send('無法獲取活動資訊'); // 向用戶發送錯誤信息
    }
});

module.exports = app;
