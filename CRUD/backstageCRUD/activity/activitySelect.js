var express = require('express');
var app = express();

var cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const conn = require('../../config');

app.use(cors());

var corsOptions = {
    origin: ['http://127.0.0.1:5501'],//在port號不同的http://localhost:3000設定http://localhost:5500可以拿資料
    //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));


//所有活動
app.get('/', function (req, res) {
    //let shopId = req.session.shopId||14
    let shopId =14;

    //時間戳記修改可以搜尋DATE_FORMAT加工，DATE_FORMAT()後面加上名稱就會變成欄位的新別名
    var sql = `SELECT shop_id=${shopId},active_id,active_title,active_picture,DATE_FORMAT(active_editdate,'%Y/%m/%d %H:%i')active_editdate,DATE_FORMAT(active_startdate,'%Y/%m/%d')active_startdate,DATE_FORMAT(active_enddate,'%Y/%m/%d')active_enddate , active_content, active_ifDel FROM active WHERE shop_id=${shopId};SELECT shop_logo_img,shop_name FROM shop WHERE shop_id = ${shopId};`
    conn.query(sql, function (err, results, fields) {
        if (err) {
            res.send('activity select出錯囉~', err);
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

module.exports = app;