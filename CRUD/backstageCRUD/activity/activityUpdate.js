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
const imgstorage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('./public/upload/shop_id_14/event_img/'));
    },
    filename: function (req, file, cb) {
      const decodedFileName = decodeURI(file.originalname);
      cb(null, decodedFileName);
    }
  });
  const upload2 = multer({ storage: imgstorage2 });


//update

app.put('/', upload2.single('file'), (req, res) => {
  //let shopId = req.session.shopId||14
  let shopId =14;
  const { title, startdate, enddate, memo, id } = req.body;
  let pictureName = '';
  
  if (req.file) {
    pictureName = "/upload/shop_id_14/event_img/" +req.file.filename;
  console.log(pictureName)
  console.log(id)
    if (fs.existsSync(pictureName)) {
      fs.unlinkSync( pictureName);
      }
    }
  
  conn.query(
    'update active set active_title = ?, active_picture = ?, active_startdate = ?, active_enddate = ?, active_content = ? ,active_editdate=now() where active_id = ?AND shop_id = ?;',
    [title, pictureName, startdate, enddate, memo, id,shopId],
    function (err, results, fields) {
      
        if (err) {
            res.send('1.更新失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串
            console.log('2.更新失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串

        } else {
            res.send('更新成功')
            console.log('2.更新成功')
        }
    })


})
module.exports = app;