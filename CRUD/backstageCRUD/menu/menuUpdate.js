var express = require('express');
var app = express();
const fs = require('fs');
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


// 建立圖片上傳處理器
const imgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('./public/upload/shop_id_14/menu_img/'));
  },
  filename: function (req, file, cb) {
    const decodedFileName = decodeURI(file.originalname);
    const timestamp = Date.now().toString().slice(0, 10);
    cb(null, `${timestamp}-${decodedFileName}`);
  }
});

const upload = multer({ storage: imgstorage });

app.put('/', upload.single('file'), (req, res) => {
  //let shopId = req.session.shopId||14
  let shopId =14;
  const { menu_name, menu_price, menu_uber, menu_panda, menu_type, menu_id } = req.body;
  let pictureName = '';

  if (req.file) {
    pictureName = "/upload/shop_id_14/menu_img/" + `${req.file.filename}`;
  }

  let sql = 'update menu set menu_name = ?, menu_price = ?, menu_type = ?';
  let queryParams = [menu_name, menu_price, menu_type, menu_id,shopId];

  if (pictureName !== null && pictureName !== "") {
    sql += ', menu_picture = ?';
    queryParams.splice(queryParams.length - 2, 0, pictureName);
  } 
  
  if (menu_uber !== null && menu_uber !== "") {
    sql += ', menu_uber = ?';
    queryParams.splice(queryParams.length - 2, 0, menu_uber);
  } else {
    sql += ', menu_uber = null';
  }

  if (menu_panda !== null && menu_panda !== "") {
    sql += ', menu_panda = ?';
    queryParams.splice(queryParams.length - 2, 0, menu_panda);
  } else {
    sql += ', menu_panda = null';
  }

  sql += ',created_at=now() where menu_id = ? AND shop_id = ?';
console.log(sql)
console.log(queryParams)
  conn.query(sql, queryParams, function (err, results, fields) {
    if (err) {
      res.send('1.更新失敗' + JSON.stringify(err));
      console.log('2.更新失敗' + JSON.stringify(err));
    } else {
      res.send('更新成功');
      console.log('2.更新成功');
    }
  });
});




module.exports = app;
