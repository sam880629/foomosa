/* ***************************
撰寫日期 : 2023.4.17
作者 : Aly Lin
目的 : 註冊頁面路由
*****************************/


const express = require('express');
const api = express.Router();

// 店家
// http://localhost:3000/signup/client
api.get('/client', function (req, res) {
    if (req.session.uid) {
        res.send("您已經登入了，歡迎使用foomosa");
        // console.log('uid為' + req.session.uid);
    } else {
        res.sendFile(process.cwd() + '/pages/signup_shop.html');
    }
})

// 一般會員
// http://localhost:3000/signup/user
api.get('/user', function (req, res) {
    res.sendFile(process.cwd() + '/pages/signup_user.html');
})

module.exports = api;