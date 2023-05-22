const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const api = express.Router();
const upload = multer();

// 處理店家資訊的更新
api.put('/info', function (req, res) {

    // 連線資料庫
    const conn = require('../config.js');

    // 接前端傳來的資料
    const data = req.body;

    // 取得session中的shop_id
    let shopId = req.session.shopId;

    // 測試用假的
    // shopId = 94;

    // update 的 sql 語法
    let sql = `
        UPDATE shop
        SET shop_address = ?,
            shop_phone = ?,
            shop_email = ?,
            shop_parking = ?,
            shop_child = ?,
            shop_pet = ?,
            shop_credit_card = ?,
            shop_linepay = ?,
            shop_jkopay = ?,
            class_id = ?
        WHERE shop_id = ${shopId};`;

    conn.query(sql,
        [data['shop_address'],
        data['shop_phone'],
        data['shop_email'],
        + data['shop_parking'],
        + data['shop_child'],
        + data['shop_pet'],
        + data['shop_credit_card'],
        + data['shop_linepay'],
        + data['shop_jkopay'],
        data['class_id']
        ],
        function (err, results, fields) {
            console.log(err);
            console.log(results);
        });
    res.send("結束");

})

// 處理營業時間區塊的更新
api.put('/time', function (req, res) {

    // 連線資料庫
    const conn = require('../config.js');

    // 取得前端傳來的資料
    const data = req.body;

    // 取得session中的shop_id
    let shopId = req.session.shopId;

    // 測試用假的
    // shopId = 94;

    // update 的 sql 語法
    let sql = `
        UPDATE shop
        SET shop_start_1 = ?,
            shop_end_1 = ?,
            shop_start_2 = ?,
            shop_end_2 = ?,
            shop_break = ?
        WHERE shop_id = ${shopId};`;

    // 執行 sql
    conn.query(sql, [
        data['shop_start_1'],
        data['shop_end_1'],
        data['shop_start_2'],
        data['shop_end_2'],
        data['shop_break']
    ],
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
        });

    res.end();

});

// 處理檔案上傳區的更新 (假刪除) (存到資料庫)
api.put('/shopImgDel', function (req, res) {

    // 連線資料庫
    const conn = require('../config.js');

    // 接前端傳來的資料
    const data = req.body;

    // 取得session中的shop_id
    let shopId = req.session.shopId;

    // 測試用假的
    // shopId = 94;

    // update 的 sql 語法
    let sql = `
        UPDATE shop
        SET ?? = NULL
        WHERE shop_id = ?;`;

    // 執行 sql
    conn.query(sql,
        [data.target, shopId],
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
        })
    res.end();

})

// 處理檔案上傳區的更新 (存到本地端資料夾)
api.post('/shopImgUpdate', upload.single('file'), (req, res, next) => {

    const file = req.file; // 取得傳來的檔案
    const json = JSON.parse(req.body.json); // 取得傳來的 JSON 格式的資料

    const shopId = req.session.shopId;
    const ext = path.extname(file.originalname); // 取得副檔名
    const newName = `${json.fName}-${shopId.toString().padStart(2, "0")}${ext}`;
    const newPath = path.join(__dirname, '..', '..', 'public', 'upload', `shop_id_${shopId}`, 'info_img', newName);

    // 確認有沒有這個路徑存在，沒有的話就建立
    fs.mkdirSync(path.join(__dirname, '..', '..', 'public', 'upload', `shop_id_${shopId}`, 'info_img'), { recursive: true });

    // 儲存檔案
    fs.writeFile(newPath, file.buffer, (err) => {
        if (err) throw err;
        console.log('File has been saved successfully!');
        // res.send({ path: newPath }); // 返回新路徑
    });

    // 存 next 區塊要用的data
    req.column = json.column;
    req.imgPath = path.join('..', 'upload', `shop_id_${shopId}`, 'info_img', newName);
    // console.log(req.column);
    // console.log(req.imgPath);
    next();
});

// 處理檔案上傳區的更新 (存到資料庫)
api.post('/shopImgUpdate', (req, res) => {
    // 連線資料庫
    const conn = require('../config.js');

    // 取得session中的shop_id
    let shopId = req.session.shopId;

    // update 的 sql 語法
    let sql = `
    UPDATE shop
    SET ?? = ?
    WHERE shop_id = ?;`;

    // 執行 sql
    conn.query(sql,
        [req.column, req.imgPath, shopId],
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
        })

    res.end();
})

// 處理臨時公休日的更新
api.put('/dayoff', function (req, res) {

    // 連線資料庫
    const conn = require('../config.js');

    // 取得session中的shop_id
    let shopId = req.session.shopId;

    // 測試用假的
    // shopId = 94;

    // 抓今天日期
    let date = new Date();
    let data = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    // update 的 sql 語法
    let sql = `
        UPDATE dayoff
        SET dayoff_recently = ?
        WHERE shop_id = ${shopId};`;

    // 執行 sql
    conn.query(sql, data,
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
        });

    res.end();

});

// 處理臨時公休日的更新
api.put('/dayoffCancel', function (req, res) {

    // 連線資料庫
    const conn = require('../config.js');

    // 取得session中的shop_id
    let shopId = req.session.shopId;

    // 測試用假的
    // shopId = 94;

    // update 的 sql 語法
    let sql = `
        UPDATE dayoff
        SET dayoff_recently = NULL
        WHERE shop_id = ?;`;

    // 執行 sql
    conn.query(sql, shopId,
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
        });

    res.end();

});

module.exports = api;