var socket = io(); <!-- is a method from the lb Create the connection -->

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
