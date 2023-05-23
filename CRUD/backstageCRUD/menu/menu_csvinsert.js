const express = require('express');
const multer = require('multer');

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


//insert
app.post('/', (req, res) => {
    //let shopId = req.session.shopId||14
    let shopId =14;
    // 將CSV資料儲存到MySQL資料庫
    const jsonData = JSON.parse(req.body.menu);
    //console.log(jsonData)
    const sql = 'INSERT INTO menu (shop_id,menu_id,menu_name,menu_price,menu_uber,menu_panda,menu_picture,menu_type) values (?,?,?,?,?,?,?,?)';
    let successCount = 0;
    for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        //console.log(item);

        // 過濾空白欄位
        for (const key in item) {
            if (!item[key]) {
                item[key] = null;
            }
        }
        let picturePath = "/upload/shop_id_14/menu_img/" +item["餐點圖片名稱"]
        //console.log(picturePath);
        conn.query(sql, [shopId, item["no."], item["餐點名稱"], item["餐點價格"], item["ubereats價格"], item["熊貓價格"], picturePath, item["餐點類別"]], function (error, results) {
            if (error) {
                console.error('Error inserting data into MySQL: ', error);
                // 回傳錯誤訊息，並停止程式執行
                res.status(500).send('Internal server error');
                return;
            }
            //console.log('Data inserted into MySQL successfully');
            successCount++;
            if (successCount === jsonData.length) {
                // 所有資料都成功插入，回傳成功訊息
                res.send(`${successCount} records inserted into MySQL successfully`);
                // console.log(`${successCount} records inserted into MySQL successfully`);
            }
        });
    }
});


module.exports = app;
