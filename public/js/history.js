// <!-- is a method from the lb Create the connection -->

var socket = io();
var chart = $("#lineChart");
var dataRecived= [];

socket.on('connect', function () {
  console.log(`Connected to server`);
  socket.emit('StartUpRequest',{
    Page: 'History'
  },function () {

  });
});
var x ;
socket.on('HistoryRequest', function (Hdata) {
  var {TempHistoryData} =Hdata;
  dataRecived = TempHistoryData;
   x =[{
       x: 1,
       y: 0
   }, {
       x: 2,
       y: 10
   }, {
       x: 10,
       y: 5
   }];
  for (var i = 0; i < TempHistoryData.length; i++) {
   //x = TempHistoryData[i];
  }
  $("#ChosenData").on('submit',function(e) {
    e.preventDefault();
    socket.emit('HistorySearch', {
      FirtsDate: $('[name=FirstDate]').val(),
      SecondDate: $('[name=SecondDate]').val()
    }, function () {

      });
    });
    let lineChart = new Chart(chart,{
      type: 'line',
     data: {
         datasets: [{
           fill: false,
             label: 'Scatter Dataset',
             backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
             data:  dataRecived
         }]
     },
     options: {
         scales: {
           xAxes: [{
                 type: 'linear',
                 position: 'bottom'
             }]
         }
     }

    });
console.log(x);
  console.log(dataRecived);
});
socket.on('disconnect', function () {
  console.log(`Disconnect from server`);
});

jQuery('#Emergency').on('submit', function (e) {
  e.preventDefault();

  socket.emit('EmergencyShutDown', {
    envokedFrom: 'History Page'
  }, function () {

  });
});
