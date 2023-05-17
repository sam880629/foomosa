const express = require('express');
app = express();

app.get('/indexImg', function (req, res) {

    // 連線資料庫
    const conn = require('../config.js');

    // 取得session中的shop_id
    let shopId = req.session.shopId;

    // 測試用先寫死
    // shopId = 94;

    // 從資料庫透過shop_id取得資料
    let sql = `UPDATE shop SET shop_index_img = NULL WHERE shop_id = ?;`;
    conn.query(sql, shopId, function (err, results, fields) {
        res.json(results);
    })
    //     if(shopId){
    //         // console.log("抓到shopId" + shopId); 
    //         let sql = "select * from shop WHERE shop_id = ?;";
    //         conn.query(sql, shopId, function (err, results, fields) {
    //             // console.log(results);
    //             res.json(results);
    //         })
    //     } else if (pShopId){
    //         let sql_p = "select * from potential_shop WHERE p_shop_id = ?;";
    //         conn.query(sql_p, pShopId, function (err, results, fields) {
    //             // console.log(results);
    //             res.cookie('potential', true, {
    //                 maxAge: 30 * 60 * 1000,
    //                 httpOnly: false
    //             })
    //             res.json(results);
    //         })
    //     } else {
    //         res.send('網站錯誤');
    //     }
})
module.exports = app;