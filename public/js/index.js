var socket = io(); <!-- is a method from the lb Create the connection -->

socket.on('connect', function () {
  console.log(`Connected to server`);
});

socket.on('disconnect', function () {
  console.log(`Disconnect from server`);
});
