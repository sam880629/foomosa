const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const csv = require('csv-parser');
// const fs = require('fs');
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//連接mySQL
const conn = require('../../config');

// //-----------設定非同源可以連接的白名單--因為port不同所以要做設定 
var cors = require('cors');
app.use(cors());

var corsOptions = {
    origin: ['http://127.0.0.1:5501'],//在port號不同的http://localhost:3000設定http://localhost:5500可以拿資料
    //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

//delete
router.put('/single', express.urlencoded(), function (req, res) {
    //let shopId = req.session.shopId||14
    let shopId =14;
    var sql = "DELETE FROM menu WHERE menu_id = ? AND shop_id = ?;"
    conn.query(sql,
        [req.body.menu_id,shopId],//這一段是body?
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
router.put('/TRUNCATE', express.urlencoded(), function (req, res) {
    //let shopId = req.session.shopId||14
    let shopId =14;
    var sql = `DELETE FROM menu WHERE shop_id = ${shopId};`
    conn.query(sql,
        //[req.body.menu_id],//這一段是body?
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


module.exports = router;
