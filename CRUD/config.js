//引用 mysql 套件
const mysql = require('mysql');

const conn = mysql.createConnection({ //變數 conn 執行 sql 指令
    host: 'localhost', //預設是localhost
    port: 8889,    //資料庫port
    user: 'root', //root 權限很高，未來請注意  
    password: 'root',
    database: 'foomosa',
    multipleStatements: true, // 啟用多個sql語句
});

conn.connect((err, db) => { //看到 callback 準備一個function
    if(err){ 
        console.log('資料庫連線錯誤', err.sqlMessage);
        //若連線錯誤會將訊息傳到第一個參數
    }else{
        console.log('資料庫連線成功');
        // console.log('cat');//cat
    }
});

module.exports = conn; //他要被 insert.js 吃掉，匯出