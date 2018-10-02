//Set path that will call the public files
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

//
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
// Configure express app
var app = express();
//creat a server using http
var server = http.createServer(app);
//Configure the server to use socket.io
var io = socketIO(server); // Return Web socket server. This is how we can communicate between the server and the client.
app.use(express.static(publicPath)); // What the remote user have acces
// Listen on the port set-up
// Call a method
io.on('connection', (socket) => {
  console.log(`New user connected`);

  socket.on('disconnect', () => {
    console.log('User was disconnect');
  })
}); //Lets register an event lisiner.

server.listen(port,() => {
  console.log(`Server is up on ${port}`);
});
