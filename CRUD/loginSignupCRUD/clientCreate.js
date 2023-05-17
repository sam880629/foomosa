const express = require('express');
const app = express();

app.post('/', function (req, res) {

    // 連線資料庫
    const conn = require('../config.js');

    // 測試有沒有抓到
    const shopName = req.body.shopName;
    const shopTaxId = req.body.shopTaxId;
    const shopPhone = req.body.shopPhone;
    const shopEmail = req.body.shopEmail;
    const locationId = req.body.locationId;
    const shopAddress = req.body.shopAddress;
    const shopPw = req.body.shopPw;

    // 存進 potential_shop table
    let sql = `INSERT INTO potential_shop(p_shop_name, p_shop_tax_id, location_id, p_shop_address, p_shop_phone, p_shop_email, p_shop_pw) 
    VALUES ( ?, ?, ?, ?, ?, ?, ?);`;

    // 這邊以下都要改
    conn.query(sql,
        [shopName, shopTaxId, locationId, shopAddress, shopPhone, shopEmail, shopPw],
        function (err, results, fields) {
            if (!err) {
                console.log("資料插入成功");
                console.log(results);

                // 要alert請查收驗證信
                res.cookie('signupErr', '0', {
                    maxAge: 10 * 1000,
                    httpOnly: false
                })
                res.redirect('/signup/client');
            } else {
                if (err.errno === 1062) {
                    // 要 alert 統編重複
                    res.cookie('signupErr', 1, {
                        maxAge: 5 * 1000,
                        httpOnly: false
                    })
                    res.redirect("/signup/client");
                } else {
                    console.log(err);
                    res.send("資料插入失敗");
                }
            }
        })
})

module.exports = app;