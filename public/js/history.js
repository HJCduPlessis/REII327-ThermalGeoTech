// <!-- is a method from the lb Create the connection -->

var socket = io();
var chart = $("#lineChart");
var dataRecived= [];

socket.on('connect', function () {
  console.log(`Connected to server`);
});
socket.on('HistoryRequest', function (Hdata) {
  var {TempHistoryData} =Hdata;
  dataRecived = TempHistoryData;
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
function updateClock() {
    var now = new Date(), // current date
        months = ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December']; // you get the idea
        time = now.getHours() + ':' + now.getMinutes() +':' +now.getSeconds(), // again, you get the idea
        date = [now.getDate(),
                months[now.getMonth()],
                now.getFullYear()].join(' ');
    document.getElementById('time').innerHTML = [date, time].join(' / ');
    socket.emit('HistoryRequestdata',{
      Page: 'History'
    },function () {

    });
    setTimeout(updateClock, 1000);
}
updateClock();
