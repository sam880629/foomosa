/* ***************************
撰寫日期 : 2023.4.17
作者 : Aly Lin
目的 : 登入頁面路由
*****************************/

// ------------- 設定登入的路由 --------------------
const express = require('express');
const api = express.Router();

api.get('/', function (req, res) {
    if (req.session.uid) {
        res.send("您已經登入了，歡迎使用foomosa");
        // console.log('uid為' + req.session.uid);
    } else {
        res.sendFile(process.cwd() + '/pages/login.html');
    }
})

module.exports = api;