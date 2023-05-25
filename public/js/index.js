    
    let slideIndex = 1;//預設類別第一頁
    let shopDatas = []; //符合條件的店家資料
    let selectShop = []; //提示相關店家


    getAll()// get 店家資訊//全部店家的資料
    showSlides(slideIndex);//顯示第一頁面
    fetchWeather() //渲染溫度推薦餐點文字
    renderHeadshot()// 更新會員相片
     
    // 前往登錄畫面，並存取當前網址url
    $('#login_btn').on('click', function(){
        window.location.assign('/login');
    })
  
    
    // 登出
    $('#logout_btn').on('click', function(){
        $.get('/logout').then(location.reload());
    })


    $('.my_Slides .foodcard ').on('click', function(){
        let classId = $(this).find('.card-text').data('class');
        document.cookie = `classId=${classId}; path=/search`
        let url = 'http://localhost:3000/search/all';
        window.location.assign(url);
    })
    


      // 搜尋//按鍵keyup時顯示符合關鍵字的店家
      $('#storSearch_text').on('keyup', 
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

    // 影片用
    $('#storSearch_text').on('click', function(){
        $(this).val('NENE CHICKEN');
    })

     //將關鍵字加到input text中
     $('.suggestions').on('click', '#suggestions_btn', function () {
        $('#storSearch_text').val($(this).text());
        $('.suggestions').html('');//關閉

    })

     //按下搜尋按鈕搜尋
     $('#storSearch_btn').on('click', function () {
        wordToMatch = $('#storSearch_text').val();
        document.cookie = `shop_Name=${wordToMatch}; path=/`
        let url = 'http://localhost:3000/search/';
        url = ( wordToMatch =='')? url+'all' : url+ `name/${wordToMatch}`;
        window.location.assign(url);
    })


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




    // get 店家資訊//全部店家的資料
    function getAll() {
        let url = 'http://localhost:3000/find/all';
        $.get(url)
            .then(function (datas) {
                shopDatas = datas.shop;
            });
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

    //跳轉至指定頁面
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    //類別輪播圖
    function showSlides(n) {
        let slides = $(".my_Slides");//類別
        //當前選取的按鈕透明顯示
        if (n == 1) {
            $(`.category_icon i:nth-child(1)`).css('opacity', '0.6');
            $(`.category_icon i:nth-child(2)`).css('opacity', '');
        } else if (n == 2) {
            $(`.category_icon i:nth-child(2)`).css('opacity', '0.6');
            $(`.category_icon i:nth-child(1)`).css('opacity', '');
        }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[n - 1].style.display = "block";
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
        // temp_Taichung = weather.main.temp;
          temp_Taichung = 30;
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
     


  
