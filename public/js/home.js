var socket = io(); // <!-- is a method from the lb Create the connection -->

socket.on('connect', function () {
  console.log(`Connected to server`);
});

socket.on('disconnect', function () {
  console.log(`Disconnect from server`);
});
  function updateClock() {
      var now = new Date(), // current date
          months = ['January', 'February', '...']; // you get the idea
          time = now.getHours() + ':' + now.getMinutes() +':' +now.getSeconds(), // again, you get the idea

          // a cleaner way than string concatenation
          date = [now.getDate(),
                  months[now.getMonth()],
                  now.getFullYear()].join(' ');

      // set the content of the element with the ID time to the formatted string
      document.getElementById('time').innerHTML = [date, time].join(' / ');
      setTimeout(updateClock, 1000);
  }
  updateClock();


$('#Emergency').on('submit', function (e) {
  e.preventDefault();

  socket.emit('EmergencyShutDown', {
    envokedFrom: 'Home Page',
  }, function () {

  });
});
$("#Settings").on('submit',function(e) {
  e.preventDefault();
  socket.emit('ChangeData', {
    ValueSet: $('[name=Temperature]').val()
  }, function () {

    });
    jQuery('#lableTest').text('label');
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
