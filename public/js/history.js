// <!-- is a method from the lb Create the connection -->

var socket = io();
var chart = $("#lineChart");
let lineChart = new Chart(chart,{
  type: 'line',
  data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            fill: false
        }]
    },
    options: {
        scales: {
          xAxes:[{
            type: 'time',
            distribution: 'series',
            time: {
              unit: 'second'
            }
          }],
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
socket.on('connect', function () {
  console.log(`Connected to server`);
});

socket.on('disconnect', function () {
  console.log(`Disconnect from server`);
});

jQuery('#Emergency').on('submit', function (e) {
  e.preventDefault();

  socket.emit('EmergencyShutDown', {
    envokedFrom: 'History Page',
  }, function () {

  });
});
$("#ChosenData").on('submit',function(e) {
  e.preventDefault();
  socket.emit('HistorySearch', {
    FirtsDate: $('[name=FirstDate]').val(),
    SecondDate: $('[name=SecondDate]').val()
  }, function () {

    });
  });
