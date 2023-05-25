const express = require('express');
const api = express.Router(); //express 有 Router 方法

const dbConn = require('../config');//檔案都在CRUD之下

api.put('/point', express.json(), (req, res) => {
   
    //insert 成功後， 才會增加積分
    console.log('積分更新:', req.body); //查看 req.body 的內容
    const user_id = req.session.uid; // 前端登錄的 user_id
    const { shop_id, rate, comment } = req.body; 
    //更新積分，評論都要+10分
    const sql = `

    `;
    //使用者的輸入值
    dbConn.query(sql, //dbConn 啟動 sql //送出 sql 指令         
        [user_id, shop_id, rate, comment], //抓變數下來，用[]
        function (err, results, fields) {
            if (err) {
                console.error(err);
                res.status(500).send("SQL 錯誤:", err);
                return;
            }
            console.log("會員編號", results.insertId);
            res.status(200).send('獲得積分10分');
            // res.status(200).json({ message: '獲得積分10分' });
        });
})

module.exports = api; //匯出