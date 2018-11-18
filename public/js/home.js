var socket = io(); // <!-- is a method from the lb Create the connection -->
var i =0;
var oldData;
socket.on('connect', function () {
  console.log(`Connected to server`);
});

socket.on('disconnect', function () {
  console.log(`Disconnect from server`);
});
socket.on('RecivedNewData',function(data){
  var {TestSendUpdatData} = data;
  var {Temperature} = TestSendUpdatData;
  oldData = Temperature;
  var {SystemState}  = TestSendUpdatData;
  var {Current}  = TestSendUpdatData;
  var {Power}  = TestSendUpdatData;
  var {SetTemp} = TestSendUpdatData;
  var {flagConnection} = TestSendUpdatData;
  // console.log(data,Temperature);
  document.getElementById('SetTemperatureDisplay').innerHTML = SetTemp;
  document.getElementById('TemperatureDisplay').innerHTML = Temperature;
  document.getElementById('SystemStateDisplay').innerHTML = SystemState;
  document.getElementById('PowerDisplay').innerHTML = Power;
  document.getElementById('CurrentDisplay').innerHTML = Current;
  document.getElementById('connectionDisplay').innerHTML = flagConnection;
});
  function updateClock() {
    i++;
      var now = new Date(), // current date
          months = ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December']; // you get the idea
          time = now.getHours() + ':' + now.getMinutes() +':' +now.getSeconds(), // again, you get the idea
          date = [now.getDate(),
                  months[now.getMonth()],
                  now.getFullYear()].join(' ');
      document.getElementById('time').innerHTML = [date, time].join(' / ');
      socket.emit('SendUpdatData', {
        ValueSet: 'WantData'
      }, function () {

        });
      setTimeout(updateClock, 1000);
  }
  updateClock();


$('#Emergency').on('submit', function (e) {
  e.preventDefault();
  socket.emit('EmergencyShutDown', {
    envokedFrom: 'Diagnostic Page',
  }, function () {

  });

});
$("#Settings").on('submit',function(e) {
  e.preventDefault();
  socket.emit('ChangeData', {
    ValueSet: $('[name=Temperature]').val()
  }, function () {

    });
  });
  $("#Active").click('button',function(e) {
    e.preventDefault();
    socket.emit('AutoMaticMode', {
      mode: true
    }, function () {

      });
    });
    $("#InActive").click('button',function(e) {
      e.preventDefault();
      socket.emit('AutoMaticMode', {
        mode: false
      }, function () {

        });
      });
