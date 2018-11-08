//loading in third party`s
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs'); // templing engine, reuseble mark-ups
//Handlebars is used.
const socketIO = require('socket.io');

 var {mongoose} = require('./db/mongoose');
 var {NewData} = require('./models/newdata');
 var {User} = require('./models/users');
 var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
var thingShadows = awsIot.thingShadow({
   keyPath: 'server/56eab5f35a-private.pem.key',
  certPath: 'server/56eab5f35a-certificate.pem.crt',
    caPath: 'server/AmazonRootCA1.pem',
  clientId: 'Hennie',
      host: 'axvtt5lr7rbu1-ats.iot.us-east-1.amazonaws.com'
});
// Client token value returned from thingShadows.update() operation
//
 var clientTokenUpdate;
//
// //
// // Simulated device values
// //

thingShadows.on('connect', function() {
    thingShadows.register( 'ThermoGeotechPi', {}, function() {
   var rgbLedLampState = {"state":{"desired":{"SetTemperature":55,"SelfTestInvoked":true,"SystemState":true}}};
   clientTokenUpdate = thingShadows.update('ThermoGeotechPi', rgbLedLampState  );

   if (clientTokenUpdate === null)
       {
          console.log('update shadow failed, operation still in progress');
       }
});
});
thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+JSON.stringify(stateObject));

//
// These events report the status of update(), get(), and delete()
// calls.  The clientToken value associated with the event will have
// the same value which was returned in an earlier call to get(),
// update(), or delete().  Use status events to keep track of the
// status of shadow operations.
//
    });
thingShadows.on('delta',
    function(thingName, stateObject) {
       console.log('received delta on '+thingName+': '+JSON.stringify(stateObject));


    });

thingShadows.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout on '+thingName+
                   ' with token: '+ clientToken);
//

    });

    thingShadows.on('foreignStateChange',
    function (thingName, operation, stateObject) {
    console.log('received on '+thingName+':'+JSON.stringify(stateObject));
    console.log('');
    var {state} = stateObject;
    if(state != null)
    {
      var {reported} = state;
      var {Temperature} = reported;
      var {Current} = reported;
      var {SelfTestInvoked} = reported;
      var {SystemState} = reported;
      var {SendDataAt} = reported;
      var newd = new NewData({
      Temperature: Temperature,
      Current: Current,
      SelfTestInvoked: SelfTestInvoked,
      SystemState: SystemState,
      SendDataAt: SendDataAt
    });
      newd.save().then((doc) => {
        console.log('test');
      },(e) => {
      console.log('b');
      });
    }

  });
//Set path that will call the public files
const publicPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../views/partials');
const port = process.env.PORT || 3000;
// Configure express app

var app = express();
// app.use(bodyParser.json();)
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
  });
  socket.on('EmergencyShutDown', (ESD) => {
    console.log('EmergencyShutDown', ESD);
    });
    socket.on('DiagnodticEnvoked',(DED) => {
      console.log('DiagnodticEnvoked', DED);
  });
  socket.on('SelfTestEnvoked',(STE) => {
    console.log('SelfTestEnvoked', STE);
});
socket.on('AutoMaticMode',(AMM) => {
  console.log('AutoMaticMode', AMM);
});
socket.on('NewDataArrive',(NDA) =>{
  console.log(NDA);
});
socket.on('ChangeData',(CD) =>{
  console.log(CD);
});
}); //Lets register an event lisiner.
app.get('/Home',(req, res) => {
  res.render('Home.hbs', {
    pageTitle: 'Home Page',
    currentYear: new Date().getFullYear()
  });
});

app.get('/diagnostic',(req, res) => {
  res.render('diagnostic.hbs', {
    pageTitle: 'Diagnostic Page',
    currentYear: new Date().getFullYear()
  });
});

app.get('/history',(req, res) => {
  res.render('history.hbs', {
    pageTitle: 'History Page',
    currentYear: new Date().getFullYear()
  });
});

server.listen(port,() => {
  console.log(`Server is up on ${port}`);
});
