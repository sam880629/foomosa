var express = require("express");
var router = express.Router(); //-- 呼叫路由方法

var config = require("../config"); //-- 接收 config.js

router.get("/", function (req, res) {
    //-- 指定要查詢的使用者id
    // var user_id = req.params.user_id; //-- 由網址路由中取得 user_id
    // var user_id = 1;
    var user_id = req.session.uid; //-- 由 session 取得 user_id
    console.log("我是user_id: " + user_id);

    const sql1 = `SELECT u.user_name, u.user_avatar, s.shop_name, s.shop_logo_img, s.shop_preview_img, c.comment_text, user_point, c.shop_id, c.comment_favorite, DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i') created_at
                FROM user u
                JOIN comment c ON u.user_id = c.user_id
                JOIN shop s ON c.shop_id = s.shop_id
                WHERE u.user_id = ${user_id}`;

    const sql2 = `SELECT u.user_id, u.user_name, u.user_point, c.coupon_id, c.coupon_used_date, c.user_coupon_id, cl.shop_id, cl.coupon_text, cl.coupon_name, cl.coupon_code, DATE_FORMAT(cl.coupon_expire, '%Y-%m-%d') coupon_expire, s.shop_name
                FROM user u
                LEFT JOIN coupon c ON u.user_id = c.user_id
                LEFT JOIN coupon_list cl ON c.coupon_id = cl.coupon_id
                LEFT JOIN shop s ON cl.shop_id = s.shop_id
                WHERE u.user_id = ${user_id}`;

    const sql3 = `SELECT * FROM history_text WHERE user_id = ${user_id} ORDER BY created_at DESC LIMIT 10`;
    
    //--查詢 user 表
    const sql4 = `SELECT * FROM user WHERE user_id = ${user_id}`;

    const sql5 = `SELECT u.user_name, u.user_avatar, s.shop_name, s.shop_logo_img, s.shop_preview_img, c.comment_text, user_point, c.shop_id, c.comment_favorite, DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i') created_at FROM user u JOIN comment c ON u.user_id = c.user_id JOIN shop s ON c.shop_id = s.shop_id WHERE u.user_id = 1 ORDER BY created_at DESC`;
    config.query(`${sql1}; ${sql2}; ${sql3}; ${sql4}; ${sql5};`,
        (err, results, fields) => { //-- 結果儲存在 results 中
            // console.log(results);
            if (err) {
                res.send("select 發生錯誤", err);
            } else {
                res.render('membership', { user: results, user_id: user_id}); //-- res.render() 方法來呼叫 EJS 模板引擎，丟物件進去

            }
            // console.log(results);
            // console.log(results[0]);
            console.log(results[4][1].created_at);
            // console.log(results[0][0].user_point);
            // console.log(results[0][1].shop_preview_img);
            // console.log(results[0][0].shop_logo_img);
            // console.log(results[0][0].user_avatar);
            // console.log(results[1]);
            // console.log(results[1][1].user_coupon_id);
            // console.log(results[2]);
            // console.log(results[2][1].history_text);
            // console.log(results[1][0].coupon_text);
            // console.log(results[0][0]);
            // console.log(results[0][0].comment_text);
            // console.log(results[1][0]);
            // console.log(results[1][0].user_id);
            // console.log(results[1][0].coupon_used_date);
            // console.log(results[1][4].coupon_code);
            // console.log(results[0][0].shop_name);
        })
})

module.exports = router;