const express = require('express');
const api = express.Router();

/* ************************************** 
********    家寧的區域開始     ***********
************************************** */

api.get('/clientinfo', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/clientInfo.html');
    } else {
        res.send(`
        <p id="redirectMsg">請登入，3秒後自動跳轉至登入頁...</p>
        <script>
            var counter = 3;
            var intervalId = setInterval(function(){
                counter--;
                document.getElementById('redirectMsg').textContent = '請登入，' + counter + '秒後自動跳轉至登入頁...';
                if(counter === 0) {
                    clearInterval(intervalId);
                    window.location.href = "http://localhost:3000/login";
                }
            }, 1000);
        </script>
    `);
    }

})

api.get('/businessAnalytics/all', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/businessAnalyticsAll.html');
    } else {
        res.send(`
        <p id="redirectMsg">請登入，3秒後自動跳轉至登入頁...</p>
        <script>
            var counter = 3;
            var intervalId = setInterval(function(){
                counter--;
                document.getElementById('redirectMsg').textContent = '請登入，' + counter + '秒後自動跳轉至登入頁...';
                if(counter === 0) {
                    clearInterval(intervalId);
                    window.location.href = "http://localhost:3000/login";
                }
            }, 1000);
        </script>
    `);
    }
})

// 登入
api.get('/logout', function (req, res) {
    // 刪除登入的 session
    delete req.session.shopId;
    delete req.session.shopLogo;
    res.end();
})

/* ************************************** 
********    家寧的區域結束     ***********
************************************** */






/* ************************************** 
********    雅婷的區域開始     ***********
************************************** */
api.get('/businessAnalytics/self', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/businessAnalytics.html');
        //res.sendFile(__dirname + '/public/css/backstage_share_frame.css');
    } else {
        res.send(`
        <p id="redirectMsg">請登入，3秒後自動跳轉至登入頁...</p>
        <script>
            var counter = 3;
            var intervalId = setInterval(function(){
                counter--;
                document.getElementById('redirectMsg').textContent = '請登入，' + counter + '秒後自動跳轉至登入頁...';
                if(counter === 0) {
                    clearInterval(intervalId);
                    window.location.href = "http://localhost:3000/login";
                }
            }, 1000);
        </script>
    `);
    }
})
api.get('/activity', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/activity.html');
    } else {
        res.send(`
        <p id="redirectMsg">請登入，3秒後自動跳轉至登入頁...</p>
        <script>
            var counter = 3;
            var intervalId = setInterval(function(){
                counter--;
                document.getElementById('redirectMsg').textContent = '請登入，' + counter + '秒後自動跳轉至登入頁...';
                if(counter === 0) {
                    clearInterval(intervalId);
                    window.location.href = "http://localhost:3000/login";
                }
            }, 1000);
        </script>
    `);
    }
})
api.get('/menu', function (req, res) {
    // // 判斷現在是不是已登入 測試時先拿掉
    if (req.session.shopId) {
        res.sendFile(process.cwd() + '/pages/menu.html');
    } else {
        res.send(`
        <p id="redirectMsg">請登入，3秒後自動跳轉至登入頁...</p>
        <script>
            var counter = 3;
            var intervalId = setInterval(function(){
                counter--;
                document.getElementById('redirectMsg').textContent = '請登入，' + counter + '秒後自動跳轉至登入頁...';
                if(counter === 0) {
                    clearInterval(intervalId);
                    window.location.href = "http://localhost:3000/login";
                }
            }, 1000);
        </script>
    `);
    }
})




/* ************************************** 
********    雅婷的區域結束     ***********
************************************** */


module.exports = api;