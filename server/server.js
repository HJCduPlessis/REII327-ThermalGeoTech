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
 var {DataSetting} = require('./models/datasetting');
 var awsIot = require('aws-iot-device-sdk');

var thingShadows = awsIot.thingShadow({
   keyPath: 'server/56eab5f35a-private.pem.key',
  certPath: 'server/56eab5f35a-certificate.pem.crt',
    caPath: 'server/AmazonRootCA1.pem',
  clientId: 'Hennie',
      host: 'axvtt5lr7rbu1-ats.iot.us-east-1.amazonaws.com'
});

 var clientTokenUpdate;

thingShadows.on('connect', function() {
thingShadows.register('ThermoGeotechPi',{},function(){
});
});

thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
      // console.log('received '+stat+' on '+thingName+': '+JSON.stringify(stateObject));
//
    });
thingShadows.on('delta',
    function(thingName, stateObject) {
      // console.log('received delta on '+thingName+': '+JSON.stringify(stateObject));


    });

thingShadows.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout on '+thingName+
                   ' with token: '+ clientToken);
//

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
  var oldMode;
  DataSetting.find().sort({_id:-1}).limit(1).then((doc) => {
    var tempd = doc[0];
    var {SystemState} = tempd;
    var {_id} = tempd;
    oldMode = SystemState;
    //console.log(oldMode);
    var {mode} =AMM;
    var newcount =0;
    var oldcount = 0;
    if(mode){newcount =1}
    if(oldMode){oldcount = 1}
    if(oldcount != newcount){

       var modeg = {"state":{"desired":{"SystemState":mode}}};
       console.log(mode);
       clientTokenUpdate = thingShadows.update('ThermoGeotechPi', modeg);
       if (clientTokenUpdate === null)
       {
          console.log('update shadow failed, operation still in progress');
       }
     DataSetting.findOneAndUpdate({
       _id: _id
     },{
       $set: {
         SystemState: mode
       }
     },{
      returnOriginal: false
    }).then((result) => {
      console.log(result);
    });
    }
  });


});
socket.on('HistorySearch',(HS) =>{
  console.log(HS);
});
socket.on('ChangeData',(CD) =>{
  console.log(CD);
  var value;
  var {ValueSet} = CD;
  value =ValueSet;

  var modeg = {"state":{"desired":{"SetTemperature":parseInt(ValueSet, 10)}}};
  console.log(value);
  clientTokenUpdate = thingShadows.update('ThermoGeotechPi', modeg);
  if (clientTokenUpdate === null)
  {
     console.log('update shadow failed, operation still in progress');
  }
  DataSetting.find().sort({_id:-1}).limit(1).then((doc) => {
    var tempd = doc[0];
    var {_id} = tempd;
    DataSetting.findOneAndUpdate({
      _id: _id
    },{
      $set: {
        SetTemperature: value
      }
    },{
     returnOriginal: false
   }).then((result) => {
     console.log(result);
   });
  });
});
}); //Lets register an event lisiner.

thingShadows.on('foreignStateChange',
function (thingName, operation, stateObject) {
// console.log('received on '+thingName+':'+JSON.stringify(stateObject));
// console.log('');

var {state} = stateObject;
var {reported} = state;
var {desired} = state;
if(state != null && reported != null)
{

  var {Temperature} = reported;
  // t1 =Temperature;
  var {Current} = reported;
  var {SelfTestInvoked} = reported;
  var {SystemState} = reported;
  var {SendDataAt} = reported;
  var newd = new NewData({
  Temperature: Temperature,
  Current: Current,
  SelfTestInvoked: SelfTestInvoked,
  SystemState: SystemState,
});
  newd.save().then((doc) => {
  },(e) => {
  console.log('b');
  });
}
else if(state != null && desired != null)
{
  var {SelfTestInvoked} = desired;
  var {SystemState} = desired;
  console.log(SelfTestInvoked);
  console.log(SystemState);
}


});

DataSetting.find().sort({_id:-1}).limit(1).then((doc) => {
  var tempd = doc[0];
  var {SetTemperature} = tempd;
  SetTemperatureHomePage = SetTemperature;
});
var HistoryData =[];
NewData.find().sort({_id:-1}).limit(100).then((test) => {
  for (var i = 0; i < test.length; i++) {
    var temp = test[i];
    var {Temperature} = temp;
    HistoryData[i] = Temperature;
  }
  //console.log(HistoryData);
});
app.get('/Home',(req, res) => {
  res.render('Home.hbs', {
    pageTitle: 'Home Page',
    currentYear: new Date().getFullYear(),
    Temperature: TemperatureforHomePage,
    SystemState: SystemModeforHomePage,
    Current: CurrentforHomePage,
    Power: SystemPower,
    SetTemp: SetTemperatureHomePage
  });
});

app.get('/diagnostic',(req, res) => {
  res.render('diagnostic.hbs', {
    pageTitle: 'Diagnostic Page',
    currentYear: new Date().getFullYear()
  });
  console.log('d');
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
