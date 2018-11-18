var socket = io();
var flag = false;
socket.on('connect', function () {
  console.log(`Connected to server`);
});

socket.on('disconnect', function () {
  console.log(`Disconnect from server`);
});

jQuery('#Emergency').on('submit', function (e) {
  e.preventDefault();

  socket.emit('EmergencyShutDown', {
    envokedFrom: 'Diagnostic Page',
  }, function () {

  });
});
$("#DiagnosticButton").click('button',function(e) {
  e.preventDefault();
  flag = false;
  socket.emit('DiagnodticEnvoked', {
    Invoked: true
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
      if (!flag) {
        socket.emit('SendUpdatDataDiacnostic', {
          ValueSet: 'WantData'
        }, function () {

          });
      }
      setTimeout(updateClock, 1000);
  }
  updateClock();
  socket.on('RecivedNewDiacnostic',function(data){
    var {SendUpdatDataDiacnostic} = data;
    var {Condition} = SendUpdatDataDiacnostic;
    var {OldMaxIs}  = SendUpdatDataDiacnostic;
    var {OldAvgIs}  = SendUpdatDataDiacnostic;
    var {NewAvgIs}  = SendUpdatDataDiacnostic;
    var {NewMaxIs} = SendUpdatDataDiacnostic;
    if(NewAvgIs > 0){flag = true;}
    // console.log(data,Temperature);
    document.getElementById('StatusDisplay').innerHTML = Condition;
    document.getElementById('OldAvgDisplay').innerHTML = OldAvgIs;
    document.getElementById('NewAvgDisplay').innerHTML = NewAvgIs;
    document.getElementById('OldMaxDisplay').innerHTML = OldMaxIs;
    document.getElementById('NewMaxtDisplay').innerHTML = NewMaxIs;
  });
