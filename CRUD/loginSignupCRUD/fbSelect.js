const express = require('express');
const api = express.Router();

api.post('/', express.urlencoded(), function (req, res) {
    // 連線資料庫
    const conn = require('../config.js');


    console.log("data");
    console.log(req.body.pId);

    const sqlSelect = "select * from user WHERE user_fb_id = ?;";
    conn.query(sqlSelect, // 先搜尋看看資料庫有沒有這個 fb_id
        [req.body.pId],
        function (err, results, fields) {
            if (!err) {
                if (results.length > 0) {
                    req.session.uid = results[0].user_id; // 有的話，將 user_id 存進 session
                    res.redirect('/index'); // 導回主頁
                } else {
                    let redirectUrl = createAccount(req.body.pAvatar);
                    res.redirect(redirectUrl);
                }
            } else {
                // console.log(err);
                res.redirect('/'); // 404
            }
        })
})

function createAccount({ pId, pName, pAvatar, pEmail }) {
    const conn = require('../config.js'); // 連線資料庫
    // console.log(pName);
    const sqlInsert = "INSERT INTO user(user_name, user_email, user_avatar, user_fb_id) VALUES (?, ?, ?, ?);";
    conn.query(sqlInsert,  // 沒有的話，就建一筆新的 user
        [pName, pEmail, pAvatar, pId],
        function (err, results, fields) {
            if (!err) {
                req.session.uid = results.insertId;
                return '/index';
            } else {
                console.log(err);
                return '/';
            }
        })
}

module.exports = api;