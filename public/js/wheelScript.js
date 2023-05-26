// 追蹤是否已經進行過積分兌換
var hasExchangedPoints = false;

// 監聽"積分兌換"按鈕的點擊事件
document.getElementById('pointUsedButton').addEventListener('click', function () {
  var user_id = document.getElementById('user_id').value;

  // 發送 Ajax 請求到伺服器以更新用戶積分
  var userPoint = document.querySelector("#user_point").innerHTML;
  // console.log(userPoint);
  if ( userPoint>9 ){
    $.ajax({
      url: '/membership/update/updateUserPoints',
      type: 'POST',
      data: {
        user_id: user_id,
        pointsToDeduct: 10
      },
      success: function (data) {
        var newPoints = data.newPoints;
        // console.log("我是newPoints: " + newPoints);
        // 從後端接收newPoints
        // if (newPoints < 0) {
        //   // 如果新的積分數量小於0，顯示錯誤訊息並返回
        //   alert('積分不足，無法兌換！');
        //   return;
        // }
  
        // 更新前端顯示的積分
        alert("兌換積分完成!!");
        $('.user_Points').html('我的積分點數 : ' + newPoints + '點');
  
        // 在積分成功更新後，設定已經進行過積分兌換
        hasExchangedPoints = true;
  
      },
      error: function (err) {
        // 處理伺服器端錯誤
        alert('發生錯誤，請稍後再試！');
        console.log(err);
      }
    });
  } else {
    alert('積分不足，無法兌換！');
    return;
  }
});


//-- 以下為轉盤樣式
const wheel = document.getElementById("wheel-canvas");
const spinBtn = document.getElementById("wheel-spin-btn");
const finalValue = document.getElementById("final-value");

// 最小和最大角度值陣列
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "NENE" },
  { minDegree: 31, maxDegree: 90, value: "NENE" },
  { minDegree: 91, maxDegree: 150, value: "NENE" },
  { minDegree: 151, maxDegree: 210, value: "NENE" },
  { minDegree: 211, maxDegree: 270, value: null },
  { minDegree: 271, maxDegree: 330, value: "NENE" },
  { minDegree: 331, maxDegree: 360, value: "NENE" },
];
// const rotationValues = [
//   { minDegree: 0, maxDegree: 30, value: "不能蔬" },
//   { minDegree: 31, maxDegree: 90, value: "喫起來" },
//   { minDegree: 91, maxDegree: 150, value: "添好運" },
//   { minDegree: 151, maxDegree: 210, value: "五銅號" },
//   { minDegree: 211, maxDegree: 270, value: null },
//   { minDegree: 271, maxDegree: 330, value: "NENE" },
//   { minDegree: 331, maxDegree: 360, value: "不能蔬" },
// ];

// 每塊的尺寸大小
const data = [16, 16, 16, 16, 16, 16];

// 每塊的背景顏色
var pieColors = [
  "#ffffff",
  "#FFDCB9",
  "#ffffff",
  "#FFDCB9",
  "#ffffff",
  "#FFDCB9",
];

// 創建圓餅圖
let myChart = new Chart(wheel, { //-- //-- new Chart() 是 Chart.js 函式庫提供的一個方法
  // 插件可以用來自定義數值標籤的外觀和位置
  plugins: [ChartDataLabels],
  // 圖表類型餅圖
  type: "pie",
  data: {
    // 標籤（要在圖表上顯示的值）
    // labels: ["喫起來", "不能蔬", "NENE", "null", "五銅號", "添好運"], //-- 對照
    labels: ["中獎!", "中獎!", "中獎!", "可惜", "中獎!", "中獎!"], //-- 對照
    // 資料集 | 圓餅圖的設置
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    // 響應圖餅圖
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      // 隱藏工具提示和圖例
      tooltip: false,
      legend: {
        display: false,
      },
      // 在圓餅圖中顯示標籤
      datalabels: {
        color: "black",
        //-- 獲取當前處理對應的標籤文字
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        anchor: 'end',
        align: 'start',
        // offset: 15,
        offset: 7,
        font: { size: 12 },
      },
    },
  },
});

//-- 以下為轉盤的啟動邏輯
// 變數累加
let count = 0;
// 100 次動畫旋轉和最後一次旋轉結果 100 + 1
let resultValue = 101;

// 定義延遲 function，才能轉盤轉完後獲取 value 值
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// 監聽轉盤按鈕的點擊事件，點擊開始轉動
spinBtn.addEventListener("click", async () => {
  if (!hasExchangedPoints) {
    // 如果沒有進行過積分兌換，顯示錯誤訊息並返回
    alert('請先進行積分兌換!!');
    return;
  }
  spinBtn.disabled = true;

  // 隨機產生角度的值來停止轉動
  let randomDegree = Math.floor(Math.random() * (325 - 0 + 1) + 0);
  // let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  // 旋轉動畫的間隔
  while (true) {
    // 設定圓餅圖的旋轉
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    // 如果旋轉大於360 將其重置為 0
    if (myChart.options.rotation >= 360) { //-- 如果超過360度時
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0; //-- 重製歸零
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      //-- 傳入的隨機角度值 randomDegree 轉換成轉盤上對應的獎品值
      valueGenerator(randomDegree);
      spinBtn.disabled = false;
      count = 0;
      resultValue = 101;
      break;
    }
    await delay(10);
  }
});

//-- 獲取幸運轉盤抽中的 value
var wheelInsertCode;
//-- 抽獎結果紀錄
var history_text;
//-- 獲取 user_id
var user_id = document.getElementById("user_id").value;
// console.log(user_id );

const valueGenerator = async (angleValue) => {
  for (var i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      if (i.value == "添好運") {
        finalValue.innerHTML = `<p>恭喜獲得添好運優惠券!!</p>`;
        history_text = "恭喜獲得添好運優惠券!!";
        spinBtn.disabled = false;
        wheelInsertCode = await new Promise(resolve => setTimeout(() => resolve(i.value), 100));
        // console.log(wheelInsertCode);

        //-- 中獎結果是添好運的歷史訊息的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/insertHistoryText',
          data: {
            user_id: user_id,
            history_text: history_text
          },
          success: function (response) {
            // 請求成功
            // console.log('插入 history_text 成功!!');
            alert(history_text);
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
          },
          error: function (error) {
            // 清求失敗
            console.error('插入 history_text 失敗', error);
          }
        });
        //-- 中獎結果是添好運的 Coupon Code 的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/coupon_insert',
          data: {
            coupon_code: wheelInsertCode,
            user_id: user_id,
          },
          success: function (response) {
            // 如果後端回傳success訊息，代表coupon新增成功
            if (response.status === 'success') {
              alert('優惠券新增成功!!');
              window.location.reload(); // 重新載入頁面以顯示更新後的優惠券列表
            } else {
              // 如果後端回傳error訊息，代表coupon新增失敗
              alert('優惠券新增失敗');
            }
          },
          error: function (error) {
            console.error('新增失敗', error);
          }
        });
        break;

      //-- NENE 中獎
      } else if (i.value == "NENE") {
        finalValue.innerHTML = `<p>恭喜獲得NENE CHICKEN優惠券!!</p>`;
        history_text = "恭喜獲得NENE優惠券!!";
        spinBtn.disabled = false;
        wheelInsertCode = await new Promise(resolve => setTimeout(() => resolve(i.value), 100));
        // console.log(wheelInsertCode);

        //-- 中獎結果是 NENE CHICKEN 的歷史訊息的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/insertHistoryText',
          data: {
            user_id: user_id,
            history_text: history_text
          },
          success: function (response) {
            // 請求成功
            console.log('插入 history_text 成功!!');
            alert(history_text);
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
          },
          error: function (error) {
            // 清求失敗
            console.error('插入 history_text 失敗', error);
          }
        });

        //-- 中獎結果是 NENE CHICKEN 的 Coupon Code 的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/coupon_insert',
          data: {
            coupon_code: wheelInsertCode,
            user_id: user_id,
          },
          success: function (response) {
            // 如果後端回傳success訊息，代表coupon新增成功
            if (response.status === 'success') {
              alert('優惠券新增成功!!');
              window.location.reload(); // 重新載入頁面以顯示更新後的優惠券列表
            } else {
              // 如果後端回傳error訊息，代表coupon新增失敗
              alert('優惠券新增失敗');
            }
          },
          error: function (error) {
            console.error('新增失敗', error);
          }
        });
        break;

      //-- 寒山居蔬食 中獎
      } else if (i.value == "不能蔬") {
        finalValue.innerHTML = `<p>恭喜獲得寒山居蔬食優惠券!!</p>`;
        history_text = "恭喜獲得寒山居蔬食優惠券!!";
        spinBtn.disabled = false;
        wheelInsertCode = await new Promise(resolve => setTimeout(() => resolve(i.value), 100));
        // console.log(wheelInsertCode);

        //-- 中獎結果是 寒山居蔬食 的歷史訊息的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/insertHistoryText',
          data: {
            user_id: user_id,
            history_text: history_text
          },
          success: function (response) {
            // 請求成功
            console.log('插入 history_text 成功!!');
            alert(history_text);
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
          },
          error: function (error) {
            // 清求失敗
            console.error('插入 history_text 失敗', error);
          }
        });

        //-- 中獎結果是 寒山居蔬食 的 Coupon Code 的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/coupon_insert',
          data: {
            coupon_code: wheelInsertCode,
            user_id: user_id,
          },
          success: function (response) {
            // 如果後端回傳success訊息，代表coupon新增成功
            if (response.status === 'success') {
              alert('優惠券新增成功!!');
              window.location.reload(); // 重新載入頁面以顯示更新後的優惠券列表
            } else {
              // 如果後端回傳error訊息，代表coupon新增失敗
              alert('優惠券新增失敗');
            }
          },
          error: function (error) {
            console.error('新增失敗', error);
          }
        });
        break;

      //-- 喫茶小舖 中獎
      } else if (i.value == "喫起來") {
        finalValue.innerHTML = `<p>恭喜獲得喫茶小舖優惠券!!</p>`;
        history_text = "恭喜獲得喫茶小舖優惠券!!";
        spinBtn.disabled = false;
        wheelInsertCode = await new Promise(resolve => setTimeout(() => resolve(i.value), 100));
        // console.log(wheelInsertCode);

        //-- 中獎結果是 喫茶小舖 的歷史訊息的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/insertHistoryText',
          data: {
            user_id: user_id,
            history_text: history_text
          },
          success: function (response) {
            // 請求成功
            console.log('插入 history_text 成功!!');
            alert(history_text);
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
          },
          error: function (error) {
            // 清求失敗
            console.error('插入 history_text 失敗', error);
          }
        });

        //-- 中獎結果是 喫茶小舖 的 Coupon Code 的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/coupon_insert',
          data: {
            coupon_code: wheelInsertCode,
            user_id: user_id,
          },
          success: function (response) {
            // 如果後端回傳success訊息，代表coupon新增成功
            if (response.status === 'success') {
              alert('優惠券新增成功!!');
              window.location.reload(); // 重新載入頁面以顯示更新後的優惠券列表
            } else {
              // 如果後端回傳error訊息，代表coupon新增失敗
              alert('優惠券新增失敗');
            }
          },
          error: function (error) {
            console.error('新增失敗', error);
          }
        });
        break;

      //-- 五銅號WooTEA 中獎
      } else if (i.value == "五銅號") {
        finalValue.innerHTML = `<p>恭喜獲得五銅號WooTEA優惠券!!</p>`;
        history_text = "恭喜獲得五銅號WooTEA優惠券!!";
        spinBtn.disabled = false;
        wheelInsertCode = await new Promise(resolve => setTimeout(() => resolve(i.value), 100));
        // console.log(wheelInsertCode);

        //-- 中獎結果是 五銅號WooTEA 的歷史訊息的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/insertHistoryText',
          data: {
            user_id: user_id,
            history_text: history_text
          },
          success: function (response) {
            // 請求成功
            console.log('插入 history_text 成功!!');
            alert(history_text);
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
          },
          error: function (error) {
            // 清求失敗
            console.error('插入 history_text 失敗', error);
          }
        });

        //-- 中獎結果是 五銅號WooTEA 的 Coupon Code 的 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/coupon_insert',
          data: {
            coupon_code: wheelInsertCode,
            user_id: user_id,
          },
          success: function (response) {
            // 如果後端回傳success訊息，代表coupon新增成功
            if (response.status === 'success') {
              alert('優惠券新增成功!!');
              window.location.reload(); // 重新載入頁面以顯示更新後的優惠券列表
            } else {
              // 如果後端回傳error訊息，代表coupon新增失敗
              alert('優惠券新增失敗');
            }
          },
          error: function (error) {
            console.error('新增失敗', error);
          }
        });
        break;

      } else {
        finalValue.innerHTML = `<p>差一點!! 再接再厲!!</p>`;
        history_text = "很可惜!! 再接再厲!!";
        spinBtn.disabled = false;
        wheelInsertCode = await new Promise(resolve => setTimeout(() => resolve(i.value), 100));
        // console.log(wheelInsertCode);

        //-- 沒有中獎結果的歷史訊息 insert $.ajax 請求
        $.ajax({
          type: 'POST',
          url: '/membership/insert/insertHistoryText',
          data: {
            user_id: user_id,
            history_text: history_text
          },
          success: function (response) {
            // 請求成功
            console.log('插入 history_text 成功!!');
            alert(history_text);
            window.location.reload(); // 重新載入頁面以顯示更新後的評論
          },
          error: function (error) {
            // 清求失敗
            console.error('插入 history_text 失敗', error);
          }
        });
        break;
      }
    }
  }
  return wheelInsertCode;
};