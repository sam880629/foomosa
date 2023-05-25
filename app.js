var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const session = require('express-session');

// 中介
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); // true 可以解析較複雜的數據
// session設定
app.use(session({
    secret: 'dede cat', // 安全方式，會依照裡面的字串去做加密邏輯
    resave: true, // 是否要每次進入網頁時重新設置 seesion cookie
    saveUninitialized: true,
    cookie: {   // 設置 Cookie 選項
        path: '/',
        httpOnly: false,
        secure: false,  //沒有使用 HTTPS 為 false。
        maxAge: 1800 * 1000 //  cookie 過期時間 -> 半小時
    }
}))

// -------------【 routes 開始 】-------------------
// 首頁
const index = require('./routes/index')
app.use('/',index);

// 搜尋頁面
const search = require('./routes/search');
app.use('/search',search);

// 餐廳頁面
const restaurantPage = require('./routes/restaurant.js');
app.use('/restaurant', restaurantPage);

// 季節頁面
const seasonPage = require('./routes/season.js');
app.use('/season', seasonPage);

// 登入頁面 http://localhost:3000/login
const login = require('./routes/login.js');
app.use('/login', login);

// 註冊頁面 (店家) http://localhost:3000/signup/client
// 註冊頁面 (user) http://localhost:3000/signup/user
const signup = require('./routes/signup.js');
app.use('/signup', signup);

// 店家後臺
const backstage = require('./routes/backstage.js');
app.use('/backstage', backstage);


// -------------【 routes 結束 】-------------------


// -------------【  CRUD  開始 】--------------------
// 首頁
const index_select = require('./CRUD/indexCRUD/indexSelect');
app.use('/index', index_select);
// 導入搜尋頁面路由 //商家資料
const sel_all = require('./CRUD/searchCRUD/searchSelect');
app.use('/find', sel_all); 

// 導入餐廳路由
const restaurantInsert = require('./CRUD/restaurantCRUD/restaurantInsert.js');
app.use('/restaurant/insert', restaurantInsert);

const restaurantSelect = require('./CRUD/restaurantCRUD/restaurantSelect.js');
app.use('/restaurant/select', restaurantSelect);

const restaurantUpdate = require('./CRUD/restaurantCRUD/restaurantUpdate.js');
app.use('/restaurant/update', restaurantUpdate);

// 導入季節路由
const seasonSelect = require('./CRUD/seasonCRUD/seasonSelect.js');
app.use('/season/select', seasonSelect);

//會員登入資料驗證 
const userLoginSelect = require('./CRUD/loginSignupCRUD/userSelect.js');
app.use('/loginUser', userLoginSelect);

// 店家登入資料驗證 
const clientLoginSelect = require('./CRUD/loginSignupCRUD/clientSelect.js');
app.use('/loginClient', clientLoginSelect);

// 後台店家資訊頁抓店家資料
const clientSelect = require('./CRUD/backstageCRUD/clientInfoSelect.js')
app.use('/getClient', clientSelect);

// 後台店家資訊頁更新
const clientUpdate = require('./CRUD/backstageCRUD/clientInfoUpdate.js')
app.use('/putClient', clientUpdate);

// 店家註冊 create
const clientCreate = require('./CRUD/loginSignupCRUD/clientCreate.js');
app.use('/clientCreate', clientCreate);

// google 登入
const googleCreate = require('./CRUD/loginSignupCRUD/googleCreate.js');
app.use('/googleId', googleCreate);

// fb 登入
const fbSelect = require('./CRUD/loginSignupCRUD/fbSelect.js');
app.use('/fbId', fbSelect);

//會員註冊 create
const userCreate = require('./CRUD/loginSignupCRUD/userCreate.js');
app.use('/userCreate', userCreate);

//後台店家菜單頁
const menuSelect = require('./CRUD/backstageCRUD/menu/menuSelect.js')
app.use('/menuSelect', menuSelect);

const menuCsvInsert = require('./CRUD/backstageCRUD/menu/menu_csvinsert.js')
app.use('/menu_csvinsert', menuCsvInsert);

const menuImgInsert = require('./CRUD/backstageCRUD/menu/menu_imginsert.js')
app.use('/menu_imginsert', menuImgInsert);

const menuUpdate = require('./CRUD/backstageCRUD/menu/menuUpdate.js')
app.use('/menuUpdate', menuUpdate);

const menuDelete = require('./CRUD/backstageCRUD/menu/menuDelete.js')
app.use('/menuDelete', menuDelete);

//後台店家活動頁
const activitySelect = require('./CRUD/backstageCRUD/activity/activitySelect.js')
app.use('/activitySelect', activitySelect);

const activityInsert = require('./CRUD/backstageCRUD/activity/activityInsert.js')
app.use('/activityInsert', activityInsert);//這裡的路徑要改'upload/upload_image

const activityUpdate = require('./CRUD/backstageCRUD/activity/activityUpdate.js')
app.use('/activityUpdate', activityUpdate);

const activityDelete = require('./CRUD/backstageCRUD/activity/activityDelete.js')
app.use('/activityDelete', activityDelete);

//後台店家分析
const businessAnalyticsSelf = require('./CRUD/backstageCRUD/businessAnalyticsSelf/commentSelect.js')
app.use('/businessAnalyticsSelf', businessAnalyticsSelf);

//會員專區
var membershipinsert = require("./CRUD/membershipCRUD/insert"); //-- 接收 insert.js 輸出的 api
app.use("/membership/insert", membershipinsert); //-- url 路徑 / 變數， EX: localhost:3000/insert

var membershipupdate = require("./CRUD/membershipCRUD/update"); //-- 接收 update.js 輸出的 api
app.use("/membership/update", membershipupdate); //-- url 路徑 / 變數， EX: localhost:3000/update

var membershipselect = require("./CRUD/membershipCRUD/select"); //-- 接收 select.js 輸出的 api
app.use("/membership", membershipselect); //-- url 路徑 / 變數， EX: localhost:3000/select

// -------------【  CRUD  結束 】--------------------


// 404
app.get('*', function (req, res) {
    res.render('404');
})

// 伺服器
app.listen(3000, function () {
    console.log('大專伺服器啟動了');
    console.log('【Ctrl + C】可關閉伺服器');
})
