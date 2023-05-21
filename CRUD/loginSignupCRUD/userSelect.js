const express = require('express');
const app = express();

app.post('/', function (req, res) {
    const inputAcc = req.body.userAccount;
    const inputPw = req.body.userPW;
    let url; // 存原網頁網址

    if (req.session.url) {
        url = req.session.url // 如果 session 有存前網頁，就導回原網頁
    } else {
        url = '/index'; // 導回首頁
    }

    // 連線資料庫
    const conn = require('../config.js');

    // // 判斷資料庫有沒有符合的 email
    // // -> 有: session 紀錄已登入的會員 id
    // // -> 無: alert
    let sql = "select * from user WHERE user_email = ?;";
    conn.query(sql,
        [inputAcc],
        function (err, results, fields) {
            if (err) {
                res.send('<h1>不好意思系統出錯了，請稍後重試或連繫客服</h1>');
            } else {
                // 判斷資料庫裡有沒有符合的帳號
                if (results.length == 0) {
                    // 如果資料庫沒有這個 email 
                    // => 回到 登入頁，提示無此帳號
                    res.cookie('loginErr', '0', {
                        maxAge: 5 * 1000,
                        httpOnly: false
                    })
                    res.redirect('/login');
                } else {
                    const dbPw = results[0]['user_pw'];
                    // 判斷此帳號的密碼與 user 輸入的是否相同
                    if (dbPw === inputPw) {
                        // 如果一樣，設定session，儲存登入者的 id 
                        req.session.uid = results[0]['user_id'];

                        res.redirect(url);
                    } else {
                        // 如果密碼錯誤的話，會將使用者的 email 存進 cookie ，然後設成帳號輸入框預設的 value
                        res.cookie('email', inputAcc, {
                            maxAge: 10 * 1000,
                            httpOnly: false
                        })
                        res.cookie('loginErr', 1, {
                            maxAge: 10 * 1000,
                            httpOnly: false
                        })
                        res.redirect('/login');
                    }
                }
            }
        })
})

module.exports = app;