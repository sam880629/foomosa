const express = require('express');
const app = express();

app.post('/', express.urlencoded(), function (req, res) {
    // 連線資料庫
    const conn = require('../config.js');

    const sqlSelect = "select * from user WHERE user_google_id = ?;";
    conn.query(sqlSelect, // 先搜尋看看資料庫有沒有這個 google_id
        [req.body.pId],
        async function (err, results, fields) {
            if (!err) {
                if (results.length > 0) {
                    req.session.uid = results[0].user_id;
                    // res.redirect('/');
                    let url = (req.session.url) ? req.session.url : '/index';
                    res.send(url);

                } else {
                    let createId = await createGoogleAccount(req.body);
                    if (createId > 0) {
                        req.session.uid = createId;
                        let url = (req.session.url) ? req.session.url : '/index';
                        res.send(url);
                    } else {
                        res.send('/');
                    }
                }
            } else {
                if (err.errno === 1062) {
                    res.cookie('loginErr', 4, {
                        maxAge: 5 * 1000,
                        httpOnly: false
                    })
                    res.redirect("/login");
                } else {
                    console.log(err);
                    res.send('/');
                }
            }
        })
})

function createGoogleAccount({ pId, pName, pAvatar, pEmail }) {
    const conn = require('../config.js'); // 連線資料庫

    const sqlInsert = "INSERT INTO user(user_name, user_email, user_avatar, user_google_id) VALUES (?, ?, ?, ?);";

    // 等待執行結果
    return new Promise((resolve, reject) => {
        conn.query(sqlInsert, [pName, pEmail, pAvatar, pId], function (err, results, fields) {
            if (!err) {
                resolve(results.insertId);
            } else {
                console.log(err);
                reject(err);
            }
        });
    });
}

module.exports = app;