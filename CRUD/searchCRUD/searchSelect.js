const express = require('express');
const api = express.Router();
const conn = require('../config.js')//資料庫資料

// ----find/
//        ├──/all
//        ├──/shop/:shop_name
//        ├──/some

let searAll = '';//是否搜尋全部
// 搜尋店家、區域、類別、說明
const sql_location = 'SELECT * FROM `location` ORDER BY `location`.`location_id` ASC ;';
const sql_class = 'SELECT * FROM `class` ORDER BY `class_id` ASC;';
// 先確定是否有登入，有取得user_ID後搜尋符合的資料，沒有則不搜尋
let sql_comment = 'SELECT * FROM `comment` WHERE 1=1 AND comment_favorite = 1 AND user_id = 0;';
let sql_user = 'SELECT * FROM `user` WHERE user_id = 0;';




// 全部搜尋
api.get('/all', function (req, res) {
  searAll = '1';// 如果是ALL則搜尋全部
  
  if(req.session.uid !=undefined ){
    sql_user = `SELECT * FROM  user WHERE user_id = ${req.session.uid};`;
    sql_comment = `SELECT * FROM comment WHERE 1=1 AND comment_favorite = 1 AND user_id =${req.session.uid};`;
  }

  const sql_shop = ' SELECT * FROM `shop`;';//ORDER BY RAND()
  conn.query(`${sql_shop}${sql_location}${sql_class}${sql_comment}${sql_user}`,function (err, result, fields) {
    if (err) {
      res.send('錯誤', err);
    } else {
      // 有被蒐藏的店家
      let userFavorite=[];
      for (const data of result[3]) {
            userFavorite.push( data.shop_id );
        }
      res.json({
        shop: result[0],
        location: result[1],
        class: result[2],
        comment : userFavorite,
        headshot : result[4]
      });
    }
  })
})


// -----------------------
// 關鍵字搜尋
api.get('/shop/:shop_Name', function (req, res) {
 
  res.cookie('shopname', 'some');
  searAll = `%${req.params.shop_Name}%`;// 如果是名稱則做模糊搜尋
  const sql = `SELECT * FROM shop WHERE shop_name LIKE  ? ;`;
  if(req.session.uid!=undefined){
    sql_user = `SELECT * FROM  user WHERE user_id = ${req.session.uid};`;
    sql_comment = `SELECT * FROM comment WHERE 1=1 AND comment_favorite = 1 AND user_id =${req.session.uid};`;
  }
  conn.query(`${sql}${sql_location}${sql_class}${sql_comment}${sql_user}`, [`%${req.params.shop_Name}%`],function (err, result, fields) {
    if (err) {
      res.send('錯誤', err);
    } else {
      // 有被蒐藏的店家
      let userFavorite=[];
      for (const data of result[3]) {
            userFavorite.push( data.shop_id );
        }

      res.json({
        shop: result[0],
        location: result[1],
        class: result[2],
        comment : userFavorite,
        headshot : result[4]
      }
      );
    }
  });
});


// 篩選器搜尋
api.post('/some', express.urlencoded(), function (req, res) {
  //更多篩選器對應到的資料
  const filterArr = [
    { id: 1, column: 'shop_parking', value: 1 },
    { id: 2, column: 'shop_child', value: 1 },
    { id: 3, column: 'shop_pet', value: 1 },
    { id: 4, column: 'shop_credit_card', value: 1 },
    { id: 5, column: 'shop_linepay', value: 1 },
    { id: 6, column: 'shop_jkopay', value: 1 }
  ];
  
  let sql = (searAll==1)? `SELECT * FROM shop WHERE 1`:`SELECT * FROM shop WHERE shop_name LIKE '${searAll}'`;//搜尋全部還是部份
  // 只要任一條件有選取
    //類別
    if (req.body.data.class_id) {
      sql += ` AND class_id IN (${req.body.data.class_id})`;
    }
    //地區
    if (req.body.data.area_id) {
      sql += ` AND location_id IN (${req.body.data.area_id})`;
    }
    //更多
    for (let i = 0; i < filterArr.length; i++) {
      const filter = filterArr[i];
      if (new RegExp(filter.id).test(req.body.data.filter_id)) {
        sql += ` AND ${filter.column} = ${filter.value}`;
      }
    }
  
  // sql += ` ORDER BY RAND(); `;

  // console.log(sql);
  conn.query(sql,function (err, result, fields) {
    if (err) {
      res.send('錯誤', err)
    } else {
      res.json(result);
    }
  })
})

module.exports = api;