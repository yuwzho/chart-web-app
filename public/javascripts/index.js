$(document).ready(function(){
  var timeData = [],
  temperatureData = [],
  humidityData = [];
  var data = {
	  labels : timeData,
		datasets : [
		  {
				fill : false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
				data : temperatureData
			},
			{
				fill : false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
				data : humidityData
			}
		]
  }
  
  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & Humidity real-time data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
        id: 'Humidity',
        type: 'linear',
        scaleLabel: {
          labelString: 'Humidity(%)',
          display: true
        },
        position: 'right'
      }]
  }}
  
  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = {animation : false}
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('ws://' + location.host);
  ws.onopen = function () {
    ws.send('blabla');
  }
 ws.onmessage = function (message) {
   console.log('receive message' + message.data);
   try {
     var obj = JSON.parse(message.data);
     timeData.push(obj.time || (new Date()).toISOString());
     temperatureData.push(obj.temperature || 0);
     humidityData.push(obj.humidity || 0);

     // only keep no more than 50 points in the line chart
     var len = timeData.length;
     if (len > 50) {
       timeData.shift();
       temperatureData.shift();
       humidityData.shift();
     }
     myLineChart.update();
   }catch(err) {
     console.error(err);
   }
 }
});
