const express = require('express');//使用express模組
const app = express();
const axios = require('axios');

const nowTime = new Date()//現在時間




console.log('現在時間', nowTime);
// 現在時間推薦
let timeText = '';
if (nowTime.getHours() >= 5 && nowTime.getHours() < 11) {
  timeText = '今天早餐';
} else if (nowTime.getHours() >= 11 && nowTime.getHours() < 14) {
  timeText = '今天午餐';
} else if (nowTime.getHours() >= 14 && nowTime.getHours() < 17) {
  timeText = '今天下午茶';
} else if (nowTime.getHours() >= 17 && nowTime.getHours() < 21) {
  timeText = '今天晚餐';
} else {
  timeText = '今天宵夜';
}



app.get('/index', async function (req, res) {
  req.session.url = req.originalUrl;
  
  let user_id ;
  if (req.session.uid=='') {
    console.log('未登入')
    user_id = 'null';
    return;
  }else{
    user_id = req.session.uid  // 前端登錄的 user_id
  }
  
  try {
    let url = 'http://localhost:3000/find/all';//所有店家
    let shop = await axios.get(url);
    res.render('index', {
      shop: shop.data.shop,
      shopLocation: shop.data.location,
      shopClass: shop.data.class,
      timeText: timeText,
      user: req.session.uid,//session  user id
      shopId: req.session.shopId, // session shop id
      headshot: (shop.data.headshot.length>0)? shop.data.headshot[0].user_avatar:'/pic/mosa2.jpg'  
    })
  }
  catch (err) {
    console.log(err)
    res.send(err);
  }
})

// 登出刪除user_session
app.get('/logout', function(req, res){
      delete req.session.uid;
      delete req.session.shopId;
      res.send('已登出')
})


module.exports = app;