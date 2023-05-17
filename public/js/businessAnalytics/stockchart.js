
  $(function () {  
    var stockChartOptions = {
      title:{
        text:"觸及數vs.優惠卷兌換數"
      },
      animationEnabled: true,
      exportEnabled: true,
      charts: [{
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          crosshair: {
            enabled: true,
            //snapToDataPoint: true
          }
        },
        data: data
      }],    
      rangeSelector: {
        inputFields: {
          startValue: 4000,
          endValue: 6000,
          valueFormatString: "###0"
        },
        
        buttons: [{
          label: "1000",
          range: 1000,
          rangeType: "number"
        },{
          label: "2000",
          range: 2000,
          rangeType: "number"
        },{
          label: "5000",
          range: 5000,
          rangeType: "number"
        },{
          label: "All",        
          rangeType: "all"
        }]
      }
    }
    $("#chartContainer").CanvasJSStockChart(stockChartOptions);
  });
  
  var limit = 10000;    //increase number of dataPoints by increasing this
  var y = 1000;
  var data = []; var dataSeries = { type: "spline" };
  var dataPoints = [];
  for (var i = 0; i < limit; i += 1) {
    y += Math.round((Math.random() * 10 - 5));
    dataPoints.push({ x: i, y: y });
  }
  dataSeries.dataPoints = dataPoints;
  data.push(dataSeries);
