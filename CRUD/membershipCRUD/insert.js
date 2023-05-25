var express = require("express");
var router = express.Router(); //-- 呼叫路由方法
var config = require("../config"); //-- 接收 config.js

// Coupon Code Input 路由
router.post('/coupon_insert', function(req, res) {
  // 從請求中獲取coupon code
  const couponCode = req.body.coupon_code;

  // 在 coupon_list 表中尋找 coupon code 是否存在
  config.query(`SELECT * FROM coupon_list WHERE coupon_code = "${couponCode}"`, 
    [couponCode], 
    function (error, results) {
      if (error) {
        console.error('查詢coupon_list失敗', error);
        res.send({ status: 'error' });
      } else if (results.length === 0) {
        // 如果 coupon code 不存在於 coupon_list 表中，回傳 error 訊息
        res.send({ status: 'error' });
      } else {
        // 如果 coupon code 存在於 coupon_list 表中，新增一筆 coupon 紀錄到 coupon 表中
        const user_id = req.body.user_id;
        const coupon_id = results[0].coupon_id;
        console.log(user_id);
        console.log(coupon_id);
        config.query('INSERT INTO coupon (user_id, coupon_id, coupon_used_date) VALUES (?, ?, null)', 
          [user_id, coupon_id], 
          function (error, results) {
            if (error) {
              console.error('新增coupon失敗', error);
              res.send({ status: 'error' });
            } else {
              // 新增成功，回傳success訊息
              res.send({ status: 'success' });
            }
          });
      }
  });
});

//-- 轉盤歷史資訊寫入
router.post("/insertHistoryText", function (req, res) {
  const user_id = req.body.user_id;
  const history_text = req.body.history_text;

  const sql = `INSERT INTO history_text (user_id, history_text) VALUES (?, ?)`;
  config.query(sql, [user_id, history_text], function (err, result) {
    if (err) {
      res.status(500).send("Error inserting history: " + err);
      console.error('插入 history_text 失敗', err);
    } else {
      res.status(200).send("History inserted successfully");
      console.error('插入 history_text 成功!!');
    }
  });
});


module.exports = router; //-- 匯出給 app.js