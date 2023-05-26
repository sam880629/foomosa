//討論insert的路由
const express = require('express');
const api = express.Router(); //express 有 Router 方法

//他吃 config.js 的資料庫連線，用require
const dbConn = require('../config');//檔案都在CRUD之下

//星星與評論
api.post('/rate', express.json(), (req, res) => {
    if (!req.session.uid) {
        res.status(401).send("請先登錄");
        return;
    }
    // console.log('更新的星星與評論:', req.body); //查看 req.body 的內容
    const user_id = req.session.uid; // 前端登錄的 user_id
    // const user_id = 1; //測試用的用戶ID
    const { shop_id, rate, comment } = req.body; //解析 POST 請求的資料，解構賦值
    const sql = "INSERT INTO comment (user_id, shop_id, comment_star, comment_text) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE comment_star = VALUES(comment_star), comment_text = VALUES(comment_text), created_at = now();";//使用者的輸入值
    dbConn.query(sql, //dbConn 啟動 sql //送出 sql 指令         
        [user_id, shop_id, rate, comment], //抓變數下來，用[]
        function (err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send("SQL 錯誤:", err);
                return;
            }
            console.log("會員編號", results.insertId);
            res.status(200).json({ message: '評論成功' });
        });
})

//愛心收藏
api.post('/toggleHeart', express.json(), (req, res) => { //用 POST 方法設定 /toggleHeart 路由
    if (!req.session.uid) {
        res.status(401).send("請先登錄");
        return;
    }
    // console.log('更新的收藏:', req.body); // 在 server 查看 req.body 的內容
    const user_id = req.session.uid; // 前端登錄的 user_id
    // const user_id = 1; //測試用的用戶ID
    const { shop_id, comment_favorite } = req.body;// 從 req.body 中解構出 shop_id 和 comment_favorite 兩個變數
    const sql = "INSERT INTO comment (user_id, shop_id, comment_favorite) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE comment_favorite = VALUES(comment_favorite);";
    //將用戶對店家的收藏狀態插入 comment 資料表中，如果資料已存在則更新該資料
    dbConn.query(sql, [user_id, shop_id, comment_favorite], function (err, results, fields) {//使用 dbConn.query 方法，接收三個參數，第一個參數是 SQL ，第二個參數是參數化的值，第三個參數是回調函數
        if (err) { //如果有錯誤，則輸出錯誤訊息，並回傳 500 錯誤狀態碼
            console.error("SQL 錯誤:", err);
            res.status(500).send('無法更新收藏狀態');
            return;
        }
        // console.log("會員編號", results.insertId);// 在 server console 顯示會員編號
        res.status(200).json({ message: '收藏狀態更新成功' });// 回傳成功訊息，並回傳 200 成功狀態碼
    });
});
module.exports = api; //匯出