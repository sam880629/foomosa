let populationDataObj = {}; // 這是個全域變數，放載入頁面時抓到的資料
let behaviorDataObj = {}; // 這是個全域變數，放載入頁面時抓到的資料
let endDateNow = new Date();
let startDateNow = new Date();
let target = 0; // 這是個全域變數，0 => 頁面瀏覽量，2 => 平均停留時間
let behaviorChart; // 這是個全域變數，放chartjs渲染的結果
let populationChart; // 這是個全域變數，放chartjs渲染的結果

$(document).ready(() => {
    setInitialDateRange();
    getBehaviorCsvData();
    getClientData();
    getPopulationCsvData();
})

function getClientData() {
    // 抓資料庫的資料
    $.ajax({
        url: "/getClient",
        methed: "GET",
        datatype: "json",
        success: async function (data) {
            // 換成資料庫抓到的logo圖像路徑(如果有的話)
            if (data[0].shop_logo_img) {
                $('.avatar img').prop('src', '../' + data[0].shop_logo_img);
            }

            // 將左側 menu 的文字改成店名
            $('#welcomeText').text(`Welcome! ${data[0].shop_name.split(" ")[0]}`);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    })
}

// trigger Tab
$(document).ready(() => {
    const triggerTabList = [].slice.call(document.querySelectorAll('#myTab a'));
    triggerTabList.forEach((triggerEl) => {
        const tabTrigger = new mdb.Tab(triggerEl);

        triggerEl.addEventListener('click', (event) => {
            event.preventDefault();
            tabTrigger.show();
        });
    });
})

function getSessionId() {
    // 抓資料庫的資料
    $.ajax({
        url: "/getClient/getSessionId",
        methed: "GET",
        datatype: "json",
        success: function (data) {
            loginId = data.shopId;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log("讀取失敗")
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    });
}

// 從本地端取得行為分析的 csv 檔案
function getBehaviorCsvData() {
    // 抓資料庫的資料
    $.ajax({
        url: "../../files/behavior-overview.csv",
        dataType: "text",
        success: function (data) {
            behaviorDataObj = processDataToJson(data); // 將讀取到 csv 轉成物件
            setDashboard(startDateNow, endDateNow);
            showBehaviorChart(startDateNow, endDateNow); // 呈現 default chart
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log("讀取失敗")
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    });
}

// 將 CSV 轉換為物件格式
function processDataToJson(csv) {
    let row = csv.split('\n');
    let result = {};

    for (let i = 3; i < row.length; i++) {
        let dataArr = [];
        let currentline = row[i].replace(/\r/g, "").split(",");
        for (let j = 1; j < row[i].length && currentline[j]; j++) {
            dataArr.push(currentline[j]);
        }
        let header = currentline[0].split('/').join('-'); // 2023/1/1 => 2023-1-1
        result[header] = dataArr;
    }
    return result;
}

// 在載入頁面的時候，先渲染 Dashboard
function setDashboard(startDate, endDate) {

    let viewSum = 0;
    let staySum = 0;

    // 算 startDate 跟 endDate 之間的天數
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // 算這個日期區間的資料總和
    for (let i = 0; i < daysDiff; i++) {
        const day = new Date(startDate.getTime());
        day.setDate(startDate.getDate() + i);
        let dayStr = formatDate(day);
        viewSum += parseInt(behaviorDataObj[dayStr][0]); // 算區間的瀏覽數總和
        staySum += parseInt(behaviorDataObj[dayStr][2]); // 算區間的停留時間總和
    }

    $('#dashboard_click').text((viewSum / 1000).toFixed(2)); // 渲染到#dashboard_click
    $('#dashboard_stay').text((staySum / daysDiff).toFixed(2)); // 渲染到#dashboard_click
}

// 渲染點擊數的資料到網頁上
function showBehaviorChart(startDate, endDate, filter = false) {

    const ctx = $('#behaviorChart'); // 將 chart 渲染到 #behaviorChart
    // 如果已經有圖表的話，先清空
    if (behaviorChart) {
        behaviorChart.destroy();
    }

    // 算 startDate 跟 endDate 之間的天數
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const DATA_COUNT = daysDiff + 1; // 7
    const labels = []; // chart x軸的label
    const shopDatapoints = []; // 存本店的數據
    const avgDatapoints = []; // 存平均的數據
    let maxY; // Y軸的label最大值

    //解構物件，取得需要的資料存到 datapoints 中
    for (let i = 0; i < DATA_COUNT; i++) {
        let day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        let dayStr = formatDate(day);
        labels.push(dayStr); // 將格式化好的日期加到 labels 標籤

        if (filter) {
            // 因為篩選器有改變，所以讓平均資料稍微變動一點
            let range = Math.random() * 1 + 0.5;
            avgDatapoints.push(behaviorDataObj[dayStr][target + 1] * range);
        } else {
            // console.log(dayStr);
            avgDatapoints.push(behaviorDataObj[dayStr][target + 1]);
        }
        // avgDatapoints.push(behaviorDataObj[dayStr][target + 1]);
        shopDatapoints.push(behaviorDataObj[dayStr][target]);

    }

    // 找最大值來判定Y軸label
    const combinedArr = shopDatapoints.concat(avgDatapoints);
    const maxVal = Math.max(...combinedArr);

    // // 算總數，渲染到#dashboard_click
    let sum = 0;
    shopDatapoints.forEach((value, index) => {
        sum += parseInt(value);
    })

    // 決定X軸的日期區間
    let stepSize = 1;
    if (DATA_COUNT > 60) {
        stepSize = 10;
    } else if (DATA_COUNT > 20) {
        stepSize = 6;
    }

    let titleText;     // // options.plugins.title.text 標題文字
    let scalesY;    // // options.scales.y y軸文字

    switch (target) {
        case 0:
            titleText = '頁面瀏覽量';
            scalesY = '頁面瀏覽量';
            maxY = Math.ceil(maxVal / 100) * 100 + 200; // 以百為單位找ceil
            $('#dashboard_click').text((sum / 1000).toFixed(2)); // 渲染到#dashboard_click
            break;
        case 2:
            titleText = '頁面平均停留時間';
            scalesY = '頁面平均停留時間(分鐘)';
            $('#dashboard_stay').text((sum / DATA_COUNT).toFixed(2)); // 渲染到#dashboard_click
            maxY = maxVal + 2;
            break;
    }

    // // chart 的 data
    const data = {
        labels: labels,
        datasets: [
            {
                label: '所有店家平均數',
                data: avgDatapoints,
                borderColor: '#5B5B5B',
                backgroundColor: '#5B5B5B',
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                borderDash: [4, 4], // 改虛線
                borderWidth: 2
            }, {
                label: '您的店家',
                data: shopDatapoints,
                borderColor: '#F28F16',
                backgroundColor: '#F28F16',
                fill: false,
                tension: 0.4,
                borderWidth: 2
            }
        ]
    };

    // // chart 的 config
    const config = {
        type: 'line',
        data: data,
        options: {
            spanGaps: 1000 * 60 * 60 * 24 * 1, // 一天  
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: titleText,
                    font: { size: 21 },
                },
                legend: {
                    labels: {
                        generateLabels: function (chart) {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            labels.forEach((label) => {
                                label.lineWidth = 0; // 可以改变lineWidth的值
                            });
                            return labels;
                        },
                        boxHeight: 12,
                        font: {
                            size: 16 // 改label的字體大小
                        }
                    }
                }

            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        // Luxon format string
                        // tooltipFormat: 'DD'
                        tooltipFormat: 'M/d',
                        unit: 'day', // 以天為單位
                        stepSize: stepSize,
                        displayFormats: {
                            day: 'M/d' // 指定日期顯示格式為 "12/25"
                        },
                    },
                    title: {
                        display: false,
                        text: 'Date',
                    },
                    ticks: {
                        font: { size: 16 },
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: scalesY
                    },
                    suggestedMin: 0,
                    suggestedMax: maxY,
                    ticks: {
                        font: { size: 16 },
                    }
                }
            }
        }
    };
    behaviorChart = new Chart(ctx, config);
}

// 店家種類篩選器
$('#shopClass').on('change', (e) => {
    if (e.target.value != 1) {
        showBehaviorChart(startDateNow, endDateNow, true);
    } else {
        showBehaviorChart(startDateNow, endDateNow);
    }
})

// 地區篩選器
$('#shopLocation').on('change', (e) => {
    if (e.target.value != 0) {
        showBehaviorChart(startDateNow, endDateNow, true);
    } else {
        showBehaviorChart(startDateNow, endDateNow);
    }
})

// 全站分析頁面點選儀錶板-店家頁面瀏覽次數
$('.total-score-area>div').eq(0).on('click', () => {
    target = 0;
    showBehaviorChart(startDateNow, endDateNow);
})

// 全站分析頁面點選儀錶板-平均停留時間
$('.total-score-area>div').eq(1).on('click', () => {
    target = 2;
    showBehaviorChart(startDateNow, endDateNow);
})

// // 日期選擇器
$(function () {
    let date = new Date;
    $('input[name="daterange"]').daterangepicker({
        opens: 'left',
        minDate: "12/01/2022",
        maxDate: formatDate2(date), // 今天
        startDate: startDateNow,
        endDate: endDateNow,
        locale: {
            format: 'YYYY/MM/DD'
        }

    }, function (start, end, label) {
        startDateNow = new Date(start); // 將 startDateNow 改成時間篩選器的結果
        endDateNow = new Date(end); // 將 endDateNow 改成時間篩選器的結果
        endDateNow.setDate(endDateNow.getDate() - 1);

        setDashboard(startDateNow, endDateNow);
        showBehaviorChart(startDateNow, endDateNow);
        showPopulationChart(startDateNow, endDateNow);
    });
});


// 設定chart日期區間的 default值
function setInitialDateRange() {
    let date = new Date();
    endDateNow.setDate(date.getDate() - 1); // 昨天
    startDateNow.setDate(date.getDate() - 7);// 七天前
}

// 將日期物件格式化成yyyy-mm-dd
function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    const str = `${yyyy}-${mm.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}`;
    return str;
}

// 將日期物件格式化成 mm/dd/yyyy (daterangepicker要用的)
function formatDate2(date) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    // const str = `${mm.toString().padStart(2,'0')}/${dd.toString().padStart(2,'0')}/${yyyy}`;
    const str = `${mm}/${dd}/${yyyy}`;
    return str;
}

// 時間篩選器按鈕的事件
$('.filter_time_btn span').on('click', (e) => {
    const index = $(e.target).index(); // 得到點擊元素在集合中的索引

    // 改變模糊的樣式
    // $('.filter_time_btn span').addClass('blur');
    $('.filter_time_btn span').removeClass('choose');
    $('.filter_time_btn span').eq(index).addClass('choose');

    // 渲染資料
    let date = new Date();
    switch (index) {
        case 0:
            startDateNow = new Date();
            endDateNow = new Date();
            endDateNow.setDate(date.getDate() - 1);
            startDateNow.setDate(date.getDate() - 1);// 30天前
            setDatePicker();
            break;
        case 1:
            startDateNow = new Date();
            endDateNow = new Date();
            setInitialDateRange();
            setDatePicker();

            break;
        case 2:
            startDateNow = new Date();
            endDateNow = new Date();
            endDateNow.setDate(date.getDate() - 1);
            startDateNow.setDate(date.getDate() - 30);// 30天前
            setDatePicker();

            break;
        case 3:
            startDateNow = new Date();
            endDateNow = new Date();
            endDateNow.setDate(date.getDate() - 1);
            startDateNow.setDate(date.getDate() - 90);// 90天前
            setDatePicker();
            break;
    }
    setDashboard(startDateNow, endDateNow);
    showBehaviorChart(startDateNow, endDateNow);
    showPopulationChart(startDateNow, endDateNow);
})

//渲染日期選擇器的值
function setDatePicker() {
    console.log(startDateNow);
    $('input[name="daterange"]').data('daterangepicker').setStartDate(formatDate(startDateNow));
    $('input[name="daterange"]').data('daterangepicker').setEndDate(formatDate(endDateNow));
}


// 使用者分析
$("#pills-analytic-tab").on('click', function () {
    showPopulationChart(startDateNow, endDateNow);
})


// 從本地端取得客層分析的 csv 檔案
function getPopulationCsvData() {
    // 抓資料庫的資料
    $.ajax({
        url: "../../files/Age and Gender Distribution Chart.csv",
        dataType: "text",
        success: function (data) {
            populationDataObj = processDataToJson(data); // 將讀取到 csv 轉成物件
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 發生錯誤時執行的動作
            console.log("讀取失敗")
            console.log(textStatus, errorThrown); // 在console中印出錯誤訊息
        }
    });
}

// 渲染點擊數的資料到網頁上
function showPopulationChart(startDate, endDate, filter = false) {

    const ctx = $('#populationChart'); // 將 chart 渲染到 #populationChart
    // const maleDatapoints = []; // 存男生數據
    // const femaleDatapoints = []; // 存女生數據
    const datapoints = new Array(12).fill(0);
    let sum = 0;

    // 如果已經有圖表的話，先清空
    if (populationChart) {
        populationChart.destroy();
    }

    // 算 startDate 跟 endDate 之間的天數
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const DATA_COUNT = daysDiff + 1; // 7

    //解構物件，取得需要的資料存到 datapoints 中
    for (let i = 0; i < DATA_COUNT; i++) {
        let day = new Date(startDate);
        // console.log(day); // 2023-5-7
        day.setDate(startDate.getDate() + i);
        let dayStr = formatDate(day);
        for (let j = 0; j < 12; j++) { // 12 是每個日期的資料總筆數
            datapoints[j] += parseInt(populationDataObj[dayStr][j]);
            sum += parseInt(populationDataObj[dayStr][j]);
        }
    }

    const maleDatapoints = (datapoints.slice(0, 6)).map(num => -num); // 存男生數據
    const femaleDatapoints = datapoints.slice(6, 12); // 存女生數據


    const labels = ['18 - 24', '25 - 34', '35 - 44', '45 - 54', '55 - 64', '65以上'];
    const data = {
        labels: labels,
        datasets: [
            {
                label: '女性',
                data: femaleDatapoints,
                borderColor: 'rgba(255, 99, 132, 0.6)',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: '男性',
                data: maleDatapoints,
                borderColor: 'rgba(54, 162, 235, 0.6)',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',

            }
        ]
    };

    // // chart 的 config
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    reverse: true,
                    ticks: {
                        font: {
                            size: 16
                        }
                    }
                },
                X: {
                    display: false
                }
            },
            indexAxis: 'y',
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
            elements: {
                bar: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: '客群分析(年齡、性別)',
                    font: { size: 21 },
                },
                tooltip: {
                    enabled: true, // 確保工具提示已啟用
                    callbacks: { // 把value轉為百分比
                        label: function (tooltipItem) {
                            let value = (Math.abs(parseInt(tooltipItem.raw)) / sum * 100).toFixed(1);
                            return `${value} %`;
                        }
                    }
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 14
                        },
                    },
                    position: 'right'
                }
            }
        },
    };
    populationChart = new Chart(ctx, config);
}


// 關鍵字的區域
// 使用者分析
$("#pills-buzzword-tab").on('click', function () {
    var data = [
        { "x": "冰", "value": 109453 },
        { "x": "肉鬆炸雞", "value": 98370 },
        { "x": "母親節優惠", "value": 64441 },
        { "x": "草仔粿奶茶", "value": 52709 },
        { "x": "肉桂捲", "value": 42294 },
        { "x": "煎餅果子", "value": 28117 },
        { "x": "楊枝甘露", "value": 26726 },
        { "x": "下午茶", "value": 26163 },
        { "x": "蔥麵包", "value": 22982 },
        { "x": "火鍋", "value": 22901 },
        { "x": "環保餐具優惠", "value": 15094 },
        { "x": "義大利麵", "value": 14865 },
        { "x": "酸菜魚", "value": 12972 },
        { "x": "芒果", "value": 12933 },
        { "x": "章魚燒", "value": 12159 }
    ];
    showBuzzwordChart(data);
    showBuzzwordTable(data);
})

// 顯示關鍵字的圖表
function showBuzzwordChart(data) {

    // 先將容器清空
    $("#buzzword-container").empty();

    // create a tag (word) cloud chart
    var chart = anychart.tagCloud(data);


    // set a chart title
    chart.title('最多搜尋')
    // set an array of angles at which the words will be laid out
    chart.angles([0])

    // display the word cloud chart
    chart.container("buzzword-container");
    chart.draw();
}

// 顯示關鍵字的表格
function showBuzzwordTable(data) {
    let target = $("#buzzwor-table table tbody");
    target.empty(); // 清空表格
    for (let i = 0; i < data.length - 5; i++) {
        let tr = `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${data[i].x}</td>
            <td>${(data[i].value).toLocaleString()}</td>
        /tr>`;
        target.append(tr);
    }

    // 這區是想要滑鼠 hover 右邊表格時，會牽動 chart 的 hover
    // $("#buzzwor-table>table>tbody>tr").hover((e) => {
    //     let hoverWord = $(e.target).parent('tr').children('td').eq(0).text();
    //     let a = $('#buzzword-container>div>svg>g>g>g').eq(1);
    //     let b = $(a).find('g').children();
    //     // console.log(typeof b);
    //     $.each(b, (key, value) => {
    //         // console.log($(value).html());
    //         if( $(value).html() == hoverWord){
    //             console.log(b.eq(key));
    //             $(b.eq(key)).hover();
    //         }
    //     })

    // })
}


