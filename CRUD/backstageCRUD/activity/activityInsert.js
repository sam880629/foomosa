var express = require('express');
var app = express();
const router = express.Router();
var cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//要設定Router
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
        cb(null, path.join('./public/upload/shop_id_14/event_img'));
    },
    filename: function (req, file, cb) {
        const decodedFileName = decodeURI(file.originalname);
        cb(null, decodedFileName);
    }
});
const upload = multer({ storage: imgstorage });

// 建立路由處理圖片上傳//這裡要再改路徑，'/upload_image'
router.post('/upload_image', upload.single('picture'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('圖片上傳失敗');
    }
    res.json({ pictureName2: req.file.filename });
    console.log({ pictureName3: req.file.filename })
});

// 建立路由處理其他資料
router.post('/insertData', (req, res) => {
    //let shopId = req.session.shopId||14
    let shopId =14;
    const { title, startdate, enddate, memo, pictureName } = req.body;
    let picturePath;
    if (pictureName) {
        picturePath = "/upload/shop_id_14/event_img/" + pictureName;
    }else{
        picturePath = null;
    }
    
    conn.query(
        'insert into active (shop_id,active_title,active_picture,active_startdate,active_enddate,active_content) values (?,?,?,?,?,?)',
        [shopId,title, picturePath , startdate, enddate, memo],
        function (err, results, fields) {
            if (err) {
                res.send('1.新增失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串
                console.log('2.新增失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串

            } else {
                res.send('新增活動成功')
                console.log('新增活動成功')
            }
        });
});
module.exports = router;
