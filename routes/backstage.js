const express = require('express');
const api = express.Router();

/* ************************************** 
********    家寧的區域開始     ***********
************************************** */

api.get('/clientinfo', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    if (req.session.shopId) {
    res.sendFile(process.cwd() + '/pages/clientInfo.html');
    } else {
        res.send("請登入");
    }

})

api.get('/businessAnalytics/all', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    // // if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/businessAnalyticsAll.html');
        // res.sendFile(process.cwd() + '/pages/backstage_default.html');
        // } else {
        //     res.send("請登入");
        // }
})

/* ************************************** 
********    家寧的區域結束     ***********
************************************** */






/* ************************************** 
********    雅婷的區域開始     ***********
************************************** */
api.get('/businessAnalytics/self', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    // if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/businessAnalytics.html');
        //res.sendFile(__dirname + '/public/css/backstage_share_frame.css');
        // } else {
        //     res.send("請登入");
        // }
})
api.get('/activity', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    // if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/activity.html');
        // } else {
        //     res.send("請登入");
        // }
})
api.get('/menu', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    // if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/menu.html');
        // } else {
        //     res.send("請登入");
        // }
})




/* ************************************** 
********    雅婷的區域結束     ***********
************************************** */


module.exports = api;