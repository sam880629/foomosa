const express = require('express');
const multer = require('multer');
const router = express.Router();
const fileUpload = require('express-fileupload');
//const csv = require('csv-parser');
const fs = require('fs');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
// 設置文件上傳中介軟體
app.use(fileUpload());
app.use(express.json());
const conn = require('../../config');

// //-----------設定非同源可以連接的白名單--因為port不同所以要做設定 
var cors = require('cors');
app.use(cors());

var corsOptions = {
    origin: ['http://127.0.0.1:5501'],//在port號不同的http://localhost:3000設定http://localhost:5500可以拿資料
    //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));


//所有餐點
//let shopId = req.session.shopId||14
let shopId = 14;
router.get('/orderByDESC', function (req, res) {

    var sql = `SELECT shop_id,menu_id,menu_name,menu_price,menu_uber,menu_panda,menu_picture,DATE_FORMAT(created_at,'%Y/%m/%d %H:%i')created_at,menu_type FROM menu WHERE shop_id = ${shopId} ORDER BY menu.created_at DESC;SELECT shop_logo_img,shop_name FROM shop WHERE shop_id = ${shopId};`
    conn.query(sql, function (err, results, fields) {
        if (err) {
            res.send('menu select出錯囉~', err);
        } else {
            //整頓資料可以在這邊處理 
            // res.render('index.ejs', 
            // {pokemon: results});
            // console.log('pokemon資料庫連線成功')
            res.json(results)
        }
    })
    //res.send('a.測試用字串I am select');
})
//所有餐點
router.get('/default', function (req, res) {
    //let shopId = req.session.shopId||14
    // let shopId =14;
    var sql = `SELECT shop_id,menu_id,menu_name,menu_price,menu_uber,menu_panda,menu_picture,DATE_FORMAT(created_at,'%Y/%m/%d %H:%i')created_at,menu_type FROM menu WHERE shop_id = ${shopId};SELECT shop_logo_img,shop_name FROM shop WHERE shop_id = ${shopId};`
    conn.query(sql, function (err, results, fields) {
        if (err) {
            res.send('menu select出錯囉~', err);
        } else {
            //整頓資料可以在這邊處理 
            // res.render('index.ejs', 
            // {pokemon: results});
            // console.log('pokemon資料庫連線成功')
            res.json(results)
        }
    })
    //res.send('a.測試用字串I am select');
})
//所有餐點
router.get('/orderByASC', function (req, res) {
    // //let shopId = req.session.shopId||14
    // let shopId =14;
    var sql = `SELECT shop_id,menu_id,menu_name,menu_price,menu_uber,menu_panda,menu_picture,DATE_FORMAT(created_at,'%Y/%m/%d %H:%i')created_at,menu_type  FROM menu WHERE shop_id = ${shopId} ORDER BY menu.created_at ASC;SELECT shop_logo_img,shop_name FROM shop WHERE shop_id = ${shopId};`
    conn.query(sql, function (err, results, fields) {
        if (err) {
            res.send('menu select出錯囉~', err);
        } else {
            //整頓資料可以在這邊處理 
            // res.render('index.ejs', 
            // {pokemon: results});
            // console.log('pokemon資料庫連線成功')
            res.json(results)
        }
    })
    //res.send('a.測試用字串I am select');
})


module.exports = router;
