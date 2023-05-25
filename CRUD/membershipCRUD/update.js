var express = require("express");
var router = express.Router(); //-- 呼叫路由方法

var config = require("../config"); //-- 接收 config.js

//-- 評論星星路由
router.post("/commentStar", function (req, res) {
  var userId = req.body.user_id;
  var shopId = req.body.shop_id;
  var comment_star = req.body.comment_star;

  // 確定是否有接收符合的資料
  if (!userId || !shopId || !comment_star) {
    // console.log("收到無效資料");
    return res.status(400).send("收到無效資料");
  }

  var sql = `UPDATE comment SET comment_star = ? WHERE user_id = ? AND shop_id = ?`;

  config.query(sql, [comment_star, userId, shopId], function (err, result) {
    if (err) {
      // console.log("Update failed:", err);
      return res.status(500).send("Update 失敗!");
    } else {
      // console.log("Update successful");
      return res.status(200).send("Update 成功!");
    }
  });
});


//-- 登出按鈕路由
router.post("/logout", function (req, res) {

  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.json({ status: 200 });
      console.log("登出路由執行成功!");
    }
  });
});

//-- 美食口袋路由
router.put("/comment_Favorite/:id", function (req, res) {
  // console.log("獲取:", req.body);
  // var id = req.params.id;
  var comment_favorite = req.body.comment_favorite;
  var shop_id = req.body.shop_id;
  // var sql = `UPDATE comment SET comment_favorite = '${comment_favorite}' WHERE shop_id = ${shop_id}`;
  var sql = `UPDATE comment SET comment_favorite = ? WHERE shop_id = ?`;


  config.query(sql,
    [comment_favorite, shop_id], //-- 獲取 url 輸入的參數，位置不影響，只引用變數名稱
    function (err, results, fields) {
      if (err) {
        console.log("更新資料錯誤：", err);
        res.status(500).send("更新資料錯誤");
        // res.send("更新資料錯誤");
      } else {
        // console.log("更新資料成功");
        res.status(200).send("更新資料成功");
        // res.render("membership");
        // res.send("更新資料成功");
      }
      // console.log(results); //-- 查詢結果
    })
})

//-- 我的評論路由
router.put("/comment_text/:id", function (req, res) {
  // var id = req.params.id;
  var comment_text = req.body.comment_text;
  var shop_id = req.body.shop_id;
  // var sql = `UPDATE comment SET comment_text = '${comment_text}' WHERE shop_id = ${shop_id}`;
  // var sql = `UPDATE comment SET comment_text = ? WHERE shop_id = ?`;
  var sql = `UPDATE comment SET comment_text = ?,created_at = now() WHERE shop_id = ?`;

  config.query(sql,
    // [req.params.comment_text, req.params.id], //-- 獲取 url 輸入的參數，位置不影響，只引用變數名稱
    [comment_text, shop_id],
    function (err, results, fields) {
      if (err) {
        console.log("更新資料錯誤：", err);
        res.send("更新資料錯誤");
      } else {
        // console.log("更新資料成功");
        res.send("更新資料成功");
      }
      // console.log(results); //-- 查詢結果
    })
})

//-- 優惠券 used 路由
router.put('/coupon_used/', function (req, res) {
  var shop_id = req.body.shop_id;
  var user_coupon_id = req.body.user_coupon_id;

  // 將 coupon_used_date 改為 現在時間
  var sql = `UPDATE coupon_list cl 
              INNER JOIN coupon c ON c.coupon_id = cl.coupon_id
              SET c.coupon_used_date = now()
              WHERE cl.shop_id = ${shop_id}
              AND c.user_coupon_id IN (${user_coupon_id});`;

  config.query(sql,
    [shop_id, user_coupon_id],
    function (error, results, fields) {
      if (error) {
        console.error("更新失敗", error);
        res.status(500).send("更新資料錯誤" + error.message);
      } else {
        // console.log("更新資料成功");
        res.status(200).send("更新資料成功");
      }
    });
});


// 更新兌換積分路由
router.post('/updateUserPoints/', function (req, res) {
  var user_id = req.body.user_id;
  var pointsToDeduct = req.body.pointsToDeduct;

  var sql = `UPDATE user SET user_point = user_point - ? WHERE user_id = ?`;

  config.query(sql, [pointsToDeduct, user_id], function (err, results, fields) {
    if (err) {
      console.error("更新失敗", err);
      res.status(500).send("更新資料錯誤" + err.message);
    } else {
      // console.log("更新資料成功");
      // 再次查詢使用者資訊以獲取新的積分
      var sql = `SELECT * FROM user WHERE user_id = ?`;
      config.query(sql, [user_id], function (err, results, fields) {
        if (err) {
          console.error("查詢失敗", err);
          res.status(500).send("查詢資料錯誤" + err.message);
        } else {
          // console.log("查詢資料成功");
          // 從查詢結果中取得新的積分數量並回傳給前端
          var newPoints = results[0].user_point;
          // console.log("我是newPoints: " + newPoints);
          res.status(200).send({ newPoints: newPoints });
          // res.status(200).send("更新資料成功");
        }
      });
    }
  });
});


//-- 更新使用者名字路由
router.put('/updateUserName/', function (req, res) {
  var user_id = req.body.user_id;
  var user_name = req.body.user_name;

  var sql = `UPDATE user SET user_name = ? WHERE user_id = ?`;

  config.query(sql, [user_name, user_id], function (err, results, fields) {
    if (err) {
      console.error("更新失敗", err);
      res.status(500).send("更新資料錯誤" + err.message);
    } else {
      // console.log("更新資料成功");
      res.status(200).send("更新資料成功");
    }
  });
});


module.exports = router; //-- 匯出給 app.js