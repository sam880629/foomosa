const express = require('express');
const app = express();

app.post('/', function (req, res) {
    const inputAcc = req.body.clientAccount;
    const inputPw = req.body.clientPw;
    // console.log(inputAcc, inputPw); // 測試有沒有抓到

    // 連線資料庫
    const conn = require('../config.js');

    // // 判斷資料庫有沒有符合的 統一編號
    // // -> 有: session 紀錄已登入的店家 id
    // // -> 無: 查找 potential_shop table
    let sql = "select * from shop WHERE shop_tax_id = ?;";
    conn.query(sql,
        [inputAcc],
        function (err, results, fields) {
            if (err) {
                res.send('<h1>不好意思系統出錯了，請稍後重試或連繫客服</h1>');
            } else {
                // 判斷資料庫裡有沒有符合的帳號
                if (results.length == 0) {
                    checkPotentialTable();

                    // // 如果資料庫沒有這個 統一編號
                    // // => 回到 登入頁，提示無此帳號
                    // res.cookie('loginErr', '2', {
                    //     maxAge: 5 * 1000,
                    //     httpOnly: false
                    // })
                    // res.redirect('/login');
                } else {
                    const dbPw = results[0]['shop_pw'];
                    // 判斷此帳號的密碼與 user 輸入的是否相同
                    if (dbPw === inputPw) {
                        // 如果一樣，設定session，儲存登入店家的 id 與登入頭像 
                        req.session.shopId = results[0]['shop_id'];
                        req.session.shopLogo =results[0]['shop_logo_img'];

                        // 密碼正確，成功登入，跳轉至後台
                        res.redirect('/backstage/clientinfo');
                    } else {
                        // 如果密碼錯誤的話，會將使用者的 email 存進 cookie ，然後設成帳號輸入框預設的 value 
                        res.cookie('loginErr', '3', {
                            maxAge: 10 * 1000,
                            httpOnly: false
                        })
                        res.redirect('/login');
                    }
                }
            }
        })

    function checkPotentialTable() {
        // console.log("安安");
        
        let sql2 = "select * from potential_shop WHERE p_shop_tax_id = ?;";
        conn.query(sql2,
            [inputAcc],
            function (err, results, fields) {
                if (err) {
                    res.send('<h1>不好意思系統出錯了，請稍後重試或連繫客服</h1>');
                } else {
                    // 判斷資料庫裡有沒有符合的帳號
                    if (results.length == 0) {
                        // 如果資料庫沒有這個 統一編號
                        // => 回到 登入頁，提示無此帳號
                        res.cookie('loginErr', '2', {
                            maxAge: 5 * 1000,
                            httpOnly: false
                        })
                        res.redirect('/login');
                    } else {
                        const dbPw = results[0]['p_shop_pw'];
                        // 判斷此帳號的密碼與 user 輸入的是否相同
                        if (dbPw === inputPw) {
                            // 如果一樣，設定session，儲存登入店家的 id 
                            req.session.pShopId = results[0]['p_shop_id'];
    
                            // 密碼正確，成功登入，跳轉至後台
                            res.redirect('/backstage/clientinfo');
                        } else {
                            // 如果密碼錯誤的話，會將使用者的 email 存進 cookie ，然後設成帳號輸入框預設的 value 
                            res.cookie('loginErr', '3', {
                                maxAge: 10 * 1000,
                                httpOnly: false
                            })
                            res.redirect('/login');
                        }
                    }
                }
            })
    }


})

module.exports = app;