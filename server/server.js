//loading in third party`s
const path = require('path');
const http = require('http');
const express = require('express');
const hbs = require('hbs'); // templing engine, reuseble mark-ups
//Handlebars is used.
const socketIO = require('socket.io');

//
//Set path that will call the public files
const publicPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../views/partials');
const port = process.env.PORT || 3000;
// Configure express app
var app = express();
//creat a server using http
var server = http.createServer(app);
//Configure the server to use socket.io
var io = socketIO(server); // Return Web socket server. This is how we can communicate between the server and the client.

hbs.registerPartials(viewPath)
app.set('view engine', 'hbs') // let as set
app.use(express.static(publicPath)); // What the remote user have acces
// Listen on the port set-up
// Call a method
io.on('connection', (socket) => {
  console.log(`New user connected`);

  socket.on('disconnect', () => {
    console.log('User was disconnect');
  })
}); //Lets register an event lisiner.
app.get('/Home',(req, res) => {
  res.render('Home.hbs', {
    pageTitle: 'Home Page',
    currentYear: new Date().getFullYear()
  });
});

server.listen(port,() => {
  console.log(`Server is up on ${port}`);
});
