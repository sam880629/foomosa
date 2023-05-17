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


// 建立圖片上傳處理器
const imgstorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, './public/upload/shop_id_14/activity_img'));
    },
    filename: function (req, file, cb) {
      const decodedFileName = decodeURI(file.originalname);
      cb(null, decodedFileName);
    }
  });
  const upload = multer({ storage: imgstorage });


//delete
app.put('/', express.urlencoded(), function (req, res) {
    //let shopId = req.session.shopId||14
    let shopId =14;
    var sql = "update active set active_ifDel=0,active_editdate=now() where active_id=?AND shop_id = ?;"
    conn.query(sql,
        [req.body.id,shopId],//這一段是body?
        //從URL輸入的值會被params抓給sql//值+[]避免多項值發散
        //***req.session.account//在帳號登入後，所有動作都有帳號使用者的名字

        function (err, results, fields) {
            if (err) {
                res.send('1.刪除失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串
                console.log('2.更新失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串

            } else {
                res.send('已刪除')
                console.log('2.更新成功')
            }
            //console.log(err);//null沒有失敗
            //console.log(results);
            // console.log(results.insertId);
            // console.log(results.affectedRows);
        })
    // console.log('我是3000的updata1');
    // res.send('我是3000的updata2');
})
//update

// app.put('/', upload.single('file'), (req, res) => {
//   const { title, startdate, enddate, memo, id } = req.body;
//   let pictureName = '';
  
//   if (req.file) {
//     pictureName = req.file.filename;
//   }
  
//   conn.query(
//     'update activity_test set title = ?, picture = ?, startdate = ?, enddate = ?, memo = ? where id = ?',
//     [title, pictureName, startdate, enddate, memo, id],
//     function (err, results, fields) {
//         if (err) {
//             res.send('1.更新失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串
//             console.log('2.更新失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串

//         } else {
//             res.send('更新成功')
//             console.log('2.更新成功')
//         }
//     })


// // app.put('/myActivityEdit', express.urlencoded(), function (req, res) {
// //     var sql = "update activity_test set title=?,startdate=?,enddate=?,memo=?,editdate=now() where id=?;"
// //     conn.query(sql,
// //         [req.body.title, req.body.startdate, req.body.enddate, req.body.memo, req.body.id],//這一段是body?
// //         //從URL輸入的值會被params抓給sql//值+[]避免多項值發散
// //         //***req.session.account//在帳號登入後，所有動作都有帳號使用者的名字

// //         function (err, results, fields) {
// //             if (err) {
// //                 res.send('1.更新失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串
// //                 console.log('2.更新失敗' + JSON.stringify(err))//JSON.stringify把東西包裝成字串

// //             } else {
// //                 res.send('更新成功')
// //                 console.log('2.更新成功')
// //             }
// //             //console.log(err);//null沒有失敗
// //             //console.log(results);
// //             // console.log(results.insertId);
// //             // console.log(results.affectedRows);
// //         })
//     // console.log('我是3000的updata1');
//     // res.send('我是3000的updata2');
// })
module.exports = app;