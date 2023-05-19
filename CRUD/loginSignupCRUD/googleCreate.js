const express = require('express');
const app = express();

app.post('/', express.urlencoded(), function (req, res) {
    // 連線資料庫
    const conn = require('../config.js');

    const sqlSelect = "select * from user WHERE user_google_id = ?;";
    conn.query(sqlSelect, // 先搜尋看看資料庫有沒有這個 google_id
        [req.body.pId],
        function (err, results, fields) {
            if (!err) {
                if (results.length > 0) {
                    req.session.uid = results[0].user_id;
                    res.redirect('/index');
                } else {
                    const sqlInsert = "INSERT INTO user(user_name, user_email, user_avatar, user_google_id) VALUES (?, ?, ?, ?);";
                    conn.query(sqlInsert,  // 沒有的話，就建一筆新的 user
                        [req.body.pName, req.body.pEmail, req.body.pAvatar, req.body.pId],
                        function (err, results, fields) {
                            if (!err) {
                                req.session.uid = results.insertId;
                                res.redirect('/index');
                            } else {
                                console.log(err);
                                res.redirect('/');
                            }
                        })
                }
            } else {
                console.log(err);
                res.redirect('/');
            }
        })
})

module.exports = app;