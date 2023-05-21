const express = require('express');// 引入 Express 模組，並建立路由
const api = express.Router();

const dbConn = require('../config');// 引入資料庫連線設定檔

// 設定路由，設定 /:season_id 參數，透過這個參數查詢指定的資料
api.get('/:season_id', (req, res) => {
    // 設定 SQL 查詢語句，查詢 season 資料表中，season_id 等於使用者輸入的 season_id
    const sql = 
    "SELECT s.season_topic, s.season_content, s.season_background_img_1, s.season_background_img_2, s.season_background_img_3, sh.shop_id, sh.shop_name, sh.shop_logo_img FROM season AS s INNER JOIN season_shop_list AS sl ON s.season_id = sl.season_id INNER JOIN shop AS sh ON sl.shop_id = sh.shop_id WHERE s.season_id = ?;";
    dbConn.query(sql, //dbConn 啟動 sql //送出 sql 指令  
        [req.params.season_id], //id 是從 URL 中獲得的參數
        function (err, results) {// 回呼函式
            if (err) {
                console.error("SQL 查詢錯誤:", err); // 如果SQL有錯誤會出現在終端機
                res.status(500).json({ error: 'select 發生錯誤', details: err });// 若出現錯誤，回傳錯誤訊息

            } else {
                res.send(results); // 將整個查詢結果作為 JSON 數據返回
                // console.log('查詢結果:', results);//顯示查詢結果
            }
        });

})
module.exports = api; //匯出