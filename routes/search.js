const express = require('express');//使用express模組
const app = express();
const axios = require('axios');



// ----search/
//        ├──/all
//        ├──/name/:shop_name
// 全部搜尋
app.get('/all', async function (req, res) {
  
   try {
      req.session.url = req.originalUrl;//存取當前網址
    
      res.cookie('page', 'all');
      let url = 'http://localhost:3000/find/all';//所有店家
      let shop = await axios.get(url);
      
      res.render('search',
         {
            shop: shop.data.shop,
            shopLocation: shop.data.location,
            shopClass: shop.data.class,
            shopComment : shop.data.comment,
            JSONurl : '/json/think.json',
            user: req.session.uid,//session  user id
            shopId: req.session.shopId, // session shop id
            headshot: (shop.data.headshot.length>0)? shop.data.headshot[0].user_avatar:'https://github.com/mdo.png'  
         });
        
   } catch (err) {
      console.log(err)
   }

})

//關鍵字搜尋
app.get('/name/:shop_name', async function (req, res) {
   try {
      req.session.url = req.originalUrl;//存取當前網址
    
      res.cookie('page', 'name');
      let url = `http://localhost:3000/find/shop/${req.params.shop_name}`;
      let shop = await axios.get(url);
      res.render('search',
         {
            shop: shop.data.shop,
            shopLocation: shop.data.location,
            shopClass: shop.data.class,
            shopComment : shop.data.comment,
            JSONurl : '/json/54605-food-toss.json',
            user: req.session.uid,//session  user id
            shopId: req.session.shopId, // session shop id
            headshot: (shop.data.headshot.length>0)? `../${shop.data.headshot[0].user_avatar}` : 'https://github.com/mdo.png'  
         })
   } catch (err) {
      console.log(err);
   }

})


module.exports = app;