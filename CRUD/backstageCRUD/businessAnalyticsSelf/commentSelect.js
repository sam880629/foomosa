var express = require('express');
var app = express();
const router = express.Router();
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

  
//所有評論
router.get('/commentSelect', function (req, res) {
    
    var sql = "SELECT user_id,shop_id,comment_star,comment_text,DATE_FORMAT(created_at,'%Y/%m/%d %H:%i')created_at,comment_favorite FROM comment;"
    conn.query(sql, function (err, results, fields) {
        if (err) {
            res.send('comment select出錯囉~', err);
        } else {
           
            res.json(results)
        }
    })
    //res.send('a.測試用字串I am select');
})
router.get('/activeCouponSelect', function (req, res) {
    //let shopId = req.session.shopId||14
    let shopId =14;
    var sql = `SELECT a.active_title,DATE_FORMAT(a.active_startdate,'%Y/%m/%d ') as active_startdate,DATE_FORMAT(a.active_enddate,'%Y/%m/%d ') as active_enddate,active_content , b.coupon_name,b.menu_type,b.coupon_code,b.coupon_text FROM active a LEFT join coupon_list b on b.coupon_expire BETWEEN a.active_startdate and a.active_enddate WHERE a.shop_id = ${shopId};SELECT shop_logo_img,shop_name FROM shop WHERE shop_id = ${shopId};`
    conn.query(sql, function (err, results, fields) {
        if (err) {
            res.send('activeCouponSelect出錯囉~', err);
            //res.status(200).json({ data: 'Your JSON data' });

        } else {
           
            res.json(results)
        }
    })
    //res.send('a.測試用字串I am select');
})
router.post('/replicaInsert', upload2.single('file[]'), (req, res) => {
    const shop_id = 14;
    const {
      title,
      startdate,
      enddate,
      memo,
      coupon_name,
      coupon_text,
      coupon_code,
      menu_type,
      
    } = req.body;
  
    const imagePath = req.file ? "/upload/shop_id_14/event_img/"+ req.file.filename : '';
  
    const insertActiveQuery = `
      INSERT INTO active (shop_id, active_title, active_picture, active_startdate, active_enddate, active_content)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertActiveValues = [shop_id, title, imagePath, startdate, enddate, memo];
  
    const insertCouponListQuery = `
      INSERT INTO coupon_List (menu_type, shop_id, coupon_name,coupon_expire, coupon_code, coupon_text)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertCouponListValues = [menu_type, shop_id,coupon_name, enddate, coupon_code, coupon_text];
  
    conn.query(insertActiveQuery, insertActiveValues, function (err, result) {
      if (err) {
        console.error('Error inserting into active:', err);
        res.status(500).send('Error inserting into active');
        return;
      }
  
      conn.query(insertCouponListQuery, insertCouponListValues, function (err, result) {
        if (err) {
          console.error('Error inserting into coupon_List:', err);
          res.status(500).send('Error inserting into coupon_List');
          return;
        }
  
        res.status(200).send('Data inserted successfully');
      });
    });
  });

  const sql="SELECT coupon_list.menu_type, coupon.coupon_used_date,coupon.coupon_id FROM coupon JOIN coupon_list ON coupon.coupon_id = coupon_list.coupon_id ORDER BY coupon_list.menu_type, coupon.coupon_used_date ASC;";
  const sql2 ="SELECT * FROM `touch` WHERE DATE_FORMAT(touch_time, '%m') ORDER BY `menu_type`,`touch`.`touch_time` ASC;";
  
  
  router.get('/linechart', function (req, res) {
    conn.query(`${sql}${sql2}`, function (err, result, fields) {
      if (err) {
        res.send('錯誤', err);
      } else {
        res.json({
          cu_chart : result[0],
          touch : result[1]
        });
      }
    })
  })


  
module.exports = router;