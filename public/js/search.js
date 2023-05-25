$(function () {
    // ----------------------------------------------
    let shopDatas = [];   //符合條件的店家資料
    let someDatas = [];
    let selectShop = [];  //提示相關店家
    //有被選取到的篩選器
    let classBox = [];    //類別
    let areaId = '';      //地區
    let filterBox = [];   //其他
    let shopComment=[];   //店家說明
    let userFavorite = [];

    // 取得cookies上的資料//來幫助判斷當前頁面和觸發後端是否搜尋全部的店家或是部分店家
    let cookies = document.cookie.split("; "); // 將所有Cookie字符串分割成Cookie數組
    let shopName_cookie;//搜尋的名稱
    let page_cookie;//當前頁面
    let wordToMatch = '';//input上的關鍵字
    let classId_cookie;//類別Id cookie
    //溫度推薦
    let temp_Taichung;//台中溫度
    let recommend_text;//推薦的文字

    findCookie() // 保存所需Cookie的值
    fetchWeather();//API取得台中現在溫度
    hasClassId(classId_cookie);//是否有class cookie存在
    renderHeadshot(); //更新頭貼

    // 當畫面滑至一定高度時cookie判斷現在是在all頁面還是shop_name
    // all頁面就執行append新增頁面
    // shop_name不執行


    /*加載畫面初始化*/
    let counter = 0; /*計數器*/
    let pageStart = 0; /*開始值*/
    let pageSize = 8; /*每次顯示幾筆資料*/
    let isEnd = false;/*结束判定*/
   

    // JSON動畫
    const animationContainer = document.getElementById('animation-container');
    const animationPath = animationContainer.getAttribute('data-animation-path');
    const anim = lottie.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationPath
    });
    // 調整動畫容器的寬度和高度
    animationContainer.style.width = '400px';
    animationContainer.style.height = '400px';

     // 前往登入畫面
     $('#login_btn').on('click', function(){
        window.location.href = '/login';
    })
    
    // 登出
    $('#logout_btn').on('click', function(){
      
        $.get('/logout').then(location.reload());
    })

    // 滾動滾輪達到是否顯示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $(".go_top").css({ "display": "inline-block", "cursor": "pointer" });
        }
        else {
            $(".go_top").css("display", "none");
        }
    });

    // 回到頂部
    $(".go_top").click(function () {
        $("html,body").scrollTop(0);
    });

    let bar = 0; //計算導覽列是否開啟
    let barcontent = ".headerdiv .headercontent"; //導覽列的div
    let d_block = "headercontent_smB"; //display:block
    let d_none = "headercontent_smN";   //display:none
    $(".headerbar").click(function () {        
        if (bar == 0) {
            bar++;
            $(barcontent).addClass(d_block);
            $(barcontent).removeClass(d_none);
        } else {
            bar = 0;
            $(barcontent).removeClass(d_block);
            $(barcontent).addClass(d_none);
        }
    });

    /*畫面滾動到一定加載顯示更多*/
    $(window).scroll(function(){
		if(isEnd == true){
			return;
		}
        // 從頁面上方已經捲/滑了多少距離+視窗可視範圍的高度 >= 整個頁面的高度，包括還沒看到的內容
		if ( window.scrollY + window.innerHeight >= document.body.offsetHeight ){
			
            showLoading()
            // 延遲
            function showLoading() {
                $('.loader').addClass('show');
                setTimeout(function () {
                  $('.loader').removeClass('show');
                  setTimeout(function () {
                    counter ++;//增加頁面
                    pageStart = counter * pageSize;//頁面 * 資料數量 = 開始值
                    getData(pageStart, pageSize)
                  }, 100);
              
                }, 600);  //1秒之後消失
              
              }
			// getData(pageStart, pageSize);
		}
	});
   

    
    // ----------------------------------------------


      // 搜尋//按鍵keyup時顯示符合關鍵字的店家
      $('.header_content input').on('keyup', 
      debounce(function(){
          let wordToMatch = $('#storSearch_text').val();//取得關鍵字
          //比對找到符合關鍵字的店家
          selectShop = shopDatas.filter(shopdata => {
              const regex = new RegExp(wordToMatch, 'gi');
              return shopdata.shop_name && shopdata.shop_name.match(regex);
          })
          matchData(selectShop, wordToMatch);//執行渲染至頁面FC
        }, 500)
  )

    //按下搜尋按鈕搜尋
    $('#storSearch_btn').on('click', function () {
        wordToMatch = $('#storSearch_text').val();
        document.cookie = `shop_Name=${wordToMatch} ; path=/`
        let url = 'http://localhost:3000/search/';
        url = (wordToMatch == '') ? url + 'all' : url + `name/${wordToMatch}`;
        window.location.assign(url);
    })

    //將關鍵字加到input text中
    $('.suggestions').on('click', '#suggestions_btn', function () {
        $('#storSearch_text').val($(this).text());
        $('.suggestions').html('');//關閉

    })

    // ------
    // 篩選器
    // ------

    // 地區篩選器
    $('#area_Item p').on('click', function () {
        let Taichung_item = ($(this).next('input[type=radio]'));//當前點擊的input
        // 單選框radio 是否新增/移除Class
        if (Taichung_item.prop('checked')) {
            (Taichung_item.prop('checked', false));
            $(this).removeClass('radio_Checked')
            areaId = '';
        } else {
            (Taichung_item.prop('checked', true));
            $('#area_Item p').not(this).removeClass('radio_Checked');//除了當前的p，其他皆刪除Class
            $(this).addClass('radio_Checked');

            areaId = $(this).next('input').data('area');//點選到的地區id
        }
        postfilter(classBox.join(','), areaId, filterBox.join(','));//post篩選值
    })



    // 類別篩選器
    $('#classify_Item p').on('click', function () {
        let classify_item = $(this).next('input[type=checkbox]');
        let classId = $(this).next('input').data('class');//點選到的地區id

        // 複選框checkbox 是否新增/移除Class
        if (classify_item.prop('checked')) {
            classify_item.prop('checked', false)
            $(this).removeClass('checkbox_Checked');

            // classBox.splice(classBox.indexOf(classId_cookie), 1);//陣列中移除cookie資料
            classBox.splice(classBox.indexOf(classId), 1);//陣列中移除資料

        } else {
            classify_item.prop('checked', true)
            $(this).addClass('checkbox_Checked')
            classBox.push(classId);//陣列中新增資料
        }
        postfilter(classBox.join(','), areaId, filterBox.join(','));//post篩選值

    })


  

    //其他篩選器
    $('.checkbox-input').on('click', function () {
        let checked = $(this).prop('checked');
        let filterID = $(this).next('span').find('span').data('set');
        if (checked) {
            filterBox.push(filterID);
        } else {
            filterBox.splice(filterBox.indexOf(filterID), 1);
        }
        postfilter(classBox.join(','), areaId, filterBox.join(','));//post篩選值
    })


    // 點擊其他地方就關閉選單
    $(document).on('click', (e) => {
        //其他篩選器表單關閉
        if (!$(e.target).closest('.filter').length && $('.checkbox-group').hasClass('watchBox')) {
            $('.checkbox-group').removeClass('watchBox');
        }
        //搜尋關鍵字表單關閉
        if (!$(e.target).closest('storSearch_text').length) {
            $('.suggestions').html('');//關閉
        }
    })

    // 開關更多選項頁面
    $('.filter .bi-sliders').on('click', () => {
        $('.checkbox-group').toggleClass('watchBox');
    });

    //重製按鈕
    $('.resetbox-tile').on('click', () => {
        $('fieldset input[type=checkbox]').prop('checked', false)
        change_Btn();
        filterBox = [];
        postfilter(classBox.join(','), areaId, filterBox.join(','));//post篩選值
    })




    // 三段樣式跳轉
    $('.box-tile').on('click', change_Btn);
    function change_Btn() {
        let box_index = ($(this).data('number') === undefined) ? 3 : $(this).data('number');
        switch (box_index) {
            case 0:
                $(this).data('number', 1);
                $(this).css({ 'background-color': '#2260ff' }).find('p').addClass('bi bi-arrow-up').css({ 'color': 'white' });
                break
            case 1:
                $(this).data('number', 2);
                $(this).find('p').removeClass('bi bi-arrow-up').addClass('bi bi-arrow-down');
                break
            case 2:
                $(this).data('number', 0);
                $(this).css({ 'background-color': '' }).find('p').removeClass('bi bi-arrow-down').css({ 'color': '' });
                break
            //reset重製
            case 3:
                $(".box-tile p").removeClass().css({ "color": '' });
                $(".box-tile ").css({ "background-color": '' }).data('number', 0);
                break
        }
    }

    // ---------------------------------------------------------

    // 保存所需Cookie的值
    function findCookie() {
        
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].split("="); // 將每個Cookie字符串分割成名稱和值
            if (cookie[0] === 'page') {
                page_cookie = cookie[1];
            }
            if (cookie[0] === "shop_Name") { // 如果名稱為"shop_Name"
                shopName_cookie = cookie[1]; // 將值賦給shopName_cookie變量
            }
            if (cookie[0] === "classId") { // 如果名稱為"classId"
                classId_cookie = cookie[1]; // 將值賦給classId_cookie變量
            }
        }
    }

    // 點選類別頁面傳送cookie 取得cookie值 判斷該cookie是否有值，
    // 有的話將數字加入到classBOX中並新增class，執行post
    // 沒有的話就不執行任何動作
    function hasClassId(classId_cookie) {
        if (classId_cookie != '') {
            classBox.push(classId_cookie)
            postfilter(classBox.join(','));
            let nowclassId = $(`#classify_Item input[data-class="${classId_cookie}"]`)[0];//當前cookie選擇的類別
            $(nowclassId).prop('checked', true).prev('p').addClass('checkbox_Checked');
        }
    }
    // get 店家資訊//全部店家的資料
    function getAll() {
        let url = 'http://localhost:3000/find/all';
        $.get(url)
            .then(function (datas) {
                shopDatas = datas.shop;
                
            });
    }

    // post將選取到的資料傳送給後端SQL搜尋
    function postfilter(classId, areaId, filterId) {
        let url = 'http://localhost:3000/find/some';
        $.post(url, {
            data: {
                //頁面選取到的選取器各個id資料傳到後端做篩選
                class_id: classId,
                area_id: areaId,
                filter_id: filterId
            }
        }).then(function (datas) {
            //將資料更新至頁面中
            selectShop = datas;
            replaceData(selectShop)//更新頁面
        })
    }

    //部分的資訊//主要作用觸發頁面是在部分搜尋頁面
    function getSome() {
        let url = `http://localhost:3000/find/shop/${shopName_cookie}`;
        $.get(url).then(function (datas) {
            someDatas = datas.shop;
            userFavorite = datas.comment;
        })
    }
    
    // <img src="${data.shop_preview_img}" class="card-img-top">
    //更新商家card
    function replaceData(shopDatas) {
        userFavorite = (userFavorite==undefined)?[]:userFavorite;
        $('#store_box').html("");// 清空card
        $.each(shopDatas, (index, data) => {
            $("#store_box").append(` 
<div class="card col-12  col-md-3   mb-5"style="width: 18rem;">
<a href='/restaurant/${data.shop_id}'>
<i class=" ${(userFavorite.includes(data.shop_id))? 'bi bi-suit-heart-fill' : 'bi bi-suit-heart'} stor_heart"></i>
 <img src="../${data.shop_preview_img}" class="card-img-top">
<div class="card-body">
    <p class="card-text">${data.shop_name}</p>
    <p class="rating pt-2 "><i class="bi bi-star-fill pe-2 "></i>${random_number()}/5<span>(${random_sum()})</span></p>
</div>
</a>
</div>
        `
        )
        })
    }

    //關鍵字搜尋跳出最多3筆店家
    function matchData(selectShop, wordToMatch) {
        if (wordToMatch == '') {
            $('.suggestions').html('');
        } else {
            $('.suggestions').html('');
            $.each(selectShop, (index, data) => {
                //最多指顯示3筆資料
                if (index > 3) {
                    return false
                }
                $('.suggestions').append(`
                <li id='suggestions_btn'>${data.shop_name}</li>
            `)
            })
        }
    }
    // 載入更多
    function getData(offset, size) {
        // 只要篩選器有被選取和不在all頁面就不執行載入更多
        if( filterBox.length > 0 || areaId > 0 || classBox.length > 0 || page_cookie !='all'){
            isEnd = true;//没有更多了
            return;
        }else{
            
           let url = 'http://localhost:3000/find/all';//取得店家資料
        $.get(url, function (reponse) {
            let data = reponse.shop;        //店家資料
            let sum = reponse.shop.length;  //店家資料數量
            userFavorite = reponse.comment;
            let result = '';

            //資料數如果顯示不夠時，就取剩下的資料    
            if (sum - offset < size) {
                size = sum - offset;
            }
           
            // 將資料新增到class中
            for (let i = offset; i < (offset + size); i++) {
                result +=
                 ` <div class="card col-12   col-md-3   mb-5" style="width: 18rem; ">
                 <a href='/restaurant/${data[i].shop_id}'>
                    <i class=" ${(userFavorite.includes(data[i].shop_id))? 'bi bi-suit-heart-fill' : 'bi bi-suit-heart'} stor_heart"></i>
                    <img src="../${data[i].shop_preview_img}" class="card-img-top ">
                    <div class="card-body">
                        <h6 class="card-text pt-3">
                             ${data[i].shop_name}
                        </h6>
                        <p class="rating pt-2 "><i class="bi bi-star-fill pe-2 "></i>${random_number()}/5<span>(${random_sum()})</span></p>
                    </div>
                    </a>
                </div>`;
            }
            $('#store_box').append(result);
            /*******************************************/

            //到底部不再新畫面    
            if ( (offset + size) >= sum){
                isEnd = true;//没有更多了
                
            }
        }
        )};
    }

    //台中API
    //取得台中API並渲染推薦文字到搜尋列上
    async function fetchWeather() {
        try {
            let url = "https://api.openweathermap.org/data/2.5/weather?q=taichung&appid=bb4fcb7c0acd6868581252da5057cfe4&units=metric";
            await fetch(url)
                .then((response) => response.json())
                .then((data) => renderWeather(data));
        } catch {
            temp_Taichung = 23;
            console.log(err)
        }
    }

    //根據氣溫在搜尋列上推薦文字
    function renderWeather(weather) {
        temp_Taichung = weather.main.temp;
        if (temp_Taichung >= 26) {
            recommend_text = ['喝杯冰冰涼涼的飲料吧!','滋味冰涼的西瓜汁，解渴又消暑的最佳選擇','品味夏日冰爽綠豆冰沙','清爽解暑的冰綠茶']
        } else if (temp_Taichung <= 20) {
            recommend_text = ['吃點火鍋暖活暖身子吧!','這種天氣該吃火鍋了吧','麻辣鴛鴦火鍋，暖身又暖心','和牛火鍋，豐富的肉汁和口感']
        } else {
            recommend_text =['今天我想來點披薩!','跟歐巴一起吃韓式炸雞','來杯奶香濃郁，Q彈有嚼勁的珍奶！','揪團來碗香噴噴的炸豬排飯'] 
        }
        let i = Math.floor(Math.random()*3);
        $('#storSearch_text').prop('placeholder', `${recommend_text[i]}`);
    }

     // 更新會員相片
     function renderHeadshot(){
        $.get('/index/headshot', function(data){
            
            try{
                let my_img =(data.headshot.length==0)? '/pic/mosa2.jpg':data.headshot[0].user_avatar
                $('#headshot').attr('src',my_img)
            }catch(err){
                console.log(err);
            }
        })
    }

    //去抖動
    function debounce(func, delay){
        // timeout 初始值
        let timeout = null;
        return function(){
          let context = this;  // 指向 myDebounce 這個 input
          let args = arguments;  // KeyboardEvent
          clearTimeout(timeout)
      
          timeout = setTimeout(function(){
            func.apply(context, args)
          }, delay)
        }
      }
     
    

    // 當前是在哪個頁面
    if (page_cookie == 'all') {
        getAll();
        $('#store_box').html('');
        /*首次加载*/
        getData(pageStart, pageSize);
       
    } else {
        getAll();
        getSome()
    };
    //重製cookie裡的classID //移除classBox的cookie資料
    document.cookie = `classId= ; path=/search`
    // classBox.splice(0, 1);
    

    function random_number(){
        var rate = Math.random();
        var z = (rate * 3 + 3.8).toFixed(1); //亂數從4起跳
        var result = (z < 5) ? z : 5;
        return  result 
    }
    function random_sum(){
        var comment = Math.random();
        var c = Math.floor(comment * 60 + 40);
        var comment = (c < 100) ? c : "100+";
        return comment
    }
})





