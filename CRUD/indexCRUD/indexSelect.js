const express= require('express');
const api =  express.Router();
const conn = require('../config')

let sql_user = 'SELECT * FROM `user` WHERE user_id = 0;';

api.get('/headshot', function(req, res){
    if(req.session.uid !=undefined ){
        sql_user = `SELECT * FROM  user WHERE user_id = ${req.session.uid};`;
      }
    

    conn.query(`${sql_user}`,function(err, result, fields){
        if(err){
            res.send('錯誤', err);
        }else{
            res.json({
                headshot : result
            })
        }
    })
})





module.exports = api;