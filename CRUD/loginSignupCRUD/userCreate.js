const express = require('express');
const app = express();

app.post('/', function (req, res) {
    // 測試有沒有抓到
    const userName = req.body.userName;
    const gender = req.body.gender;
    const userEmail = req.body.userEmail;
    const userBirth = req.body.userBirth;
    const userPW = req.body.userPW;

    // 連線資料庫
    const conn = require('../config.js');

    // console.log(req.body);
    let sql = `INSERT INTO user(user_pw, user_name, user_gender, user_birth, user_email) 
    VALUES ( ?, ?, ?, ?, ?);`;

    conn.query(sql,
        [userPW, userName, gender, userBirth, userEmail],
        function (err, results, fields) {
            if (!err) {
                console.log("資料插入成功");
                console.log(results);
                res.send("資料插入成功");

            } else {
                if (err.errno === 1062) {
                    res.cookie('emailDup', true, {
                        maxAge: 5 * 1000,
                        httpOnly: false
                    })
                    res.redirect("/login");
                } else {
                    console.log(err);
                    res.send("資料插入失敗");
                }
            }
        })
})

module.exports = app;