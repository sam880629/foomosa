const express = require('express');
const api = express.Router(); //express 有 Router 方法

const dbConn = require('../config');//檔案都在CRUD之下

api.put('/point', express.json(), (req, res) => {

    const user_id = req.session.uid; // 前端登錄的 user_id
    const sql = `
    UPDATE user SET user_point = user_point + 10 WHERE user_id = ?
    `;
    //使用者的輸入值
    dbConn.query(sql, //dbConn 啟動 sql //送出 sql 指令         
        [user_id], //抓變數下來，用[]
        function (err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send("SQL 錯誤:", err);
                return;
            }
            console.log("積分更新成功");
            res.status(200).send('獲得積分10分');
        });
})

module.exports = api; //匯出