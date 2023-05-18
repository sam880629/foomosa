$(function () {

    // Y軸月份
    let Mm = ['Apr 2022', 'May 2022', 'Jun 2022', 'Jul 2022', 'Aug 2022', 'Sep 2022', 'Oct 2022', 'Nov 2022', 'Dec 2022', 'Jan 2023', 'Feb 2023', ' Mar 2023'];
    let url = '/businessAnalyticsSelf/linechart';
    $.get(url, function (Datas) {
        // 將資料庫抓取的資料做分類整理
        const newDatas1 = Datas.cu_chart.reduce((acc, Value) => {
            const type = Value.menu_type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(Value);
            return acc;
        }, {});

        //中文對應的英文key值
        const cu_keyList = {
            '主食': 'MainDish',
            '招牌必點': 'SignatureDish',
            '湯品': 'Soup',
            '特色飲品': 'Beverage'
        };

        //將中文key值轉換成英文
        const renamedData_cu = Object.fromEntries(
            Object.entries(newDatas1).map(([key, value]) => [cu_keyList[key] || key, value])
        );

        // 將資料庫抓取的資料做分類整理
        const newDatas2 = Datas.touch.reduce((acc, Value) => {
            const type = Value.menu_type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(Value);
            return acc;
        }, {});

        //中文對應的英文key值   
        const touch_keyList = {
            '主食': 'MainDish_T',
            '招牌必點': 'SignatureDish_T',
            '湯品': 'Soup_T',
            '特色飲品': 'Beverage_T'
        };
        //將中文key值轉換成英文
        const renamedDatas_touch = Object.fromEntries(
            Object.entries(newDatas2).map(([key, value]) => [touch_keyList[key] || key, value])
        );


        //優惠眷兌換數資料
        let cu_chartData = [
            { MainDish: cu_chart(renamedData_cu.MainDish) },     //主食
            { SignatureDish: cu_chart(renamedData_cu.SignatureDish) },//招牌
            { Soup: cu_chart(renamedData_cu.Soup) },             //湯品
            { Beverage: cu_chart(renamedData_cu.Beverage) }      //特色飲品
        ];
        // 觸擊數資料
        let touchData = [
            { MainDish_T: touch(renamedDatas_touch.MainDish_T) },     //主食
            { SignatureDish_T: touch(renamedDatas_touch.SignatureDish_T) },//招牌
            { Soup_T: touch(renamedDatas_touch.Soup_T) },             //湯品
            { Beverage_T: touch(renamedDatas_touch.Beverage_T) }      //特色飲品
        ];
        try {
            writecanvas(Mm, cu_chartData, touchData)
        } catch (err) {
            console.log(err)
        }
    })

    // 計算 cu_chart每個月的次數
    function cu_chart(my_datas) {
        let monthSum = [];//月次數
        for (let targetMonth = 0; targetMonth < 12; targetMonth++) {
            let count = 0;
            for (let i = 0; i < my_datas.length; i++) {
                const date = new Date(my_datas[i].coupon_used_date); // 將資料轉換成 Date 物件
                // 計算當月共有幾次
                if (date.getMonth() === targetMonth) {
                    count++;
                }
            }
            monthSum.push(count);
        }
        return monthSum.slice(3).concat(monthSum.slice(0, 3))
    }

    // 計算 touch每個月的次數
    function touch(my_datas) {
        let monthSum = [];//月次數
        for (let targetMonth = 0; targetMonth < 12; targetMonth++) {
            let count = 0;
            for (let i = 0; i < my_datas.length; i++) {
                const date = new Date(my_datas[i].touch_time); // 將資料轉換成 Date 物件
                // 計算當月共有幾次
                if (date.getMonth() === targetMonth) {
                    count++;
                }
            }
            monthSum.push(count);
        }
        return monthSum.slice(3).concat(monthSum.slice(0, 3))
    }

    // 渲染canvas
    function writecanvas(labels, cu_chartData, touchData) {
        const data = {
            labels: labels, //Y軸月份
            datasets: [
                {
                    label: '主食兌換數',
                    data: cu_chartData[0].MainDish,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    yAxisID: 'y',
                },

                {
                    label: '招牌兌換數',
                    data: cu_chartData[1].SignatureDish,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 1)',
                    yAxisID: 'y',
                    hidden: true
                },

                {
                    label: '湯品兌換數',
                    data: cu_chartData[2].Soup,
                    borderColor: 'rgba(75, 192, 150, 1)',
                    backgroundColor: 'rgba(75, 192, 150, 1)',
                    yAxisID: 'y',
                    hidden: true
                },
                {
                    label: '飲品兌換數',
                    data: cu_chartData[3].Beverage,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    yAxisID: 'y',
                    hidden: true
                },
                {
                    label: '主食觸及數',
                    data: touchData[0].MainDish_T,
                    borderColor: '#0C4D7A',
                    backgroundColor: '#0C4D7A',
                    yAxisID: 'y1',
                },
                {
                    label: '招牌觸及數',
                    data: touchData[1].SignatureDish_T,
                    borderColor: '#FF6600',
                    backgroundColor: '#FF6600',
                    yAxisID: 'y1',
                    hidden: true
                },
                {
                    label: '湯品觸及數',
                    data: touchData[2].Soup_T,
                    borderColor: '#33916F',
                    backgroundColor: '#33916F',
                    yAxisID: 'y1',
                    hidden: true
                },
                {
                    label: '飲品觸及數',
                    data: touchData[3].Beverage_T,
                    borderColor: '#FF093E',
                    backgroundColor: '#FF093E',
                    yAxisID: 'y1',
                    hidden: true
                },
            ]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    title: {
                        display: true,
                        font:{ size:21},
                        text: '優惠卷兌換數 vs. 觸及數'
                    },
                    legend: {
                        position: 'right',
      //},
                        labels: {
                            // This more specific font property overrides the global property
                            font: {
                                size: 16
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        max: 110,
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            font:{ size:18},
                            display: true,
                            text: '優惠卷兌換數'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            font:{ size:18},
                            display: true,
                            text: '觸及數'
                        },
                        grid: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    },
                }
            },
        };
        const ctx = document.getElementById('myChart');
        const chart = new Chart(ctx, config);//使用chart.js
        let foodBox = document.querySelectorAll('.food_checkbox input[type=checkbox]');
        //input checked新增監聽器，顯示/隱藏線
        foodBox.forEach((item, index) => {
            item.addEventListener('change', function () {

                if (!this.checked) {
                    flag = true;//隱藏
                } else {
                    flag = false;//顯示
                }
                chart.config.data.datasets[index].hidden = flag
                chart.config.data.datasets[index + 4].hidden = flag
                chart.update();//更新圖表
            })
        });
    }
})





