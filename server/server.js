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
 var {Currentdiacnostic} = require('./models/currentdiacnostic');
 var {TempDiacnostic1} = require('./models/tempdiacnostic');
 var awsIot = require('aws-iot-device-sdk');
 var flagConnection = false;
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
    var modeg = {"state":{"desired":{"EmergencyStop":true}}};
    clientTokenUpdate = thingShadows.update('ThermoGeotechPi', modeg);
    if (clientTokenUpdate === null)
    {
       console.log('update shadow failed, operation still in progress');
    }
    });
    socket.on('DiagnodticEnvoked',(DED) => {
      console.log('DiagnodticEnvoked', DED);
  });
  socket.on('SelfTestEnvoked',(STE) => {
    console.log('SelfTestEnvoked', STE);
});
socket.on('SendUpdatData',(SUD) => {
  var TestSendUpdatData = DataCollected();
  // console.log(TestSendUpdatData);
  socket.emit('RecivedNewData',{
    TestSendUpdatData
  })
});
socket.on('SendUpdatDataDiacnostic',(SUD) => {
  var SendUpdatDataDiacnostic = RunDiagnosticDataCompare();
  // console.log(TestSendUpdatData);
  socket.emit('RecivedNewDiacnostic',{
    SendUpdatDataDiacnostic
  })
});
socket.on('StartUpRequest',(SUR) => {
  console.log(SUR);
  var TempHistoryData =GetHistoryData();
  socket.emit('HistoryRequest',{
    TempHistoryData
  })
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
flagConnection =true;
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
var TemperatureforHomePage;
var SystemModeforHomePage;
var CurrentforHomePage;
var SystemPower;
var SetTemperatureHomePage;

function DataCollected() {
  NewData.find().sort({_id:-1}).limit(1).then((test) => {
    var obj = test[0];
    var {Temperature} = obj;
    var {SystemState} = obj;
    var {Current} = obj;
    if(SystemState)
    {
       SystemModeforHomePage = "Automatic";
    }
    else {
      SystemModeforHomePage = "InActive";
    }
    TemperatureforHomePage = Temperature;
    CurrentforHomePage = Current;
    if(Current > 0){
      SystemPower = "On";
    }
    else {
      SystemPower = "Off";
    }

  });
  DataSetting.find().sort({_id:-1}).limit(1).then((doc) => {
    var tempd = doc[0];
    var {SetTemperature} = tempd;
    SetTemperatureHomePage = SetTemperature;
  });
  return {
    Temperature: TemperatureforHomePage,
    SystemState: SystemModeforHomePage,
    Current: CurrentforHomePage,
    Power: SystemPower,
    SetTemp: SetTemperatureHomePage,
    flagConnection: flagConnection
  }
}
var HistoryData =[];
function GetHistoryData() {
  NewData.find().sort({_id:-1}).limit(1000).then((test) => {
    for (var i = 0; i < test.length; i++) {
      var temp = test[i];
      var {Temperature} = temp;
      var y = Temperature;
      var {_id} = temp;
      var x = i;
      HistoryData[i] = {x,y};
    }
  });
  return HistoryData
}
var newDiacnosticData = [];
var oldDiacnosticData = [];
var oldMax ;
var newMax ;
var oldAvg ;
var newAvg ;
var condition;
var avg;
var max;
function RunDiagnosticDataCompare() {
  NewData.find().sort({_id:1}).limit(100).then((DiagnosticDataOld) => {
    for (var i = 0; i < DiagnosticDataOld.length; i++) {
      var temp = DiagnosticDataOld[i];
      var {Current} = temp;
      var y = Current;

      if(y != 0){
        oldDiacnosticData[i] = y;

      }


    }
    for (var i = 0; i < oldDiacnosticData.length; i++) {
      if(i == 0){
        oldMax =oldDiacnosticData[i];
        oldAvg = oldDiacnosticData[i];
      }
      else{
        if(oldDiacnosticData[i] > oldMax){
          oldMax = oldDiacnosticData[i];
        }
        var olddata = oldAvg;
        oldAvg = oldDiacnosticData[i]+olddata;
      }
    }
    oldAvg = oldAvg/oldDiacnosticData.length;
  });
  NewData.find().sort({_id:-1}).limit(100).then((DiagnosticDataNew) => {
    for (var i = 0; i < DiagnosticDataNew.length; i++) {
      var temp = DiagnosticDataNew[i];
      var {Current} = temp;
      var y = Current;
      if(y != 0){
        newDiacnosticData[i] = y;
        //console.log(newDiacnosticData[i]);
      }
    }
    for (var i = 0; i < newDiacnosticData.length; i++) {
      if(i == 0){
        newMax =newDiacnosticData[i];
        newAvg = newDiacnosticData[i];
      }
      else{
        if(newDiacnosticData[i] > oldMax){
          newMax = newDiacnosticData[i];
        }
        var olddata = newAvg;
        newAvg = newDiacnosticData[i]+olddata;
      }
    }
    newAvg = newAvg/newDiacnosticData.length;
    avg = oldAvg - newAvg;
    max = oldMax- newMax;
    if(avg >= 0){condition = 'Great';}
    else if(avg < 0){
      var persentage =(-1)*avg/oldAvg*100;
      if(persentage < 10)
      {
        condition = 'Good';
      }
      else if (persentage >= 10 && persentage < 20) {
        condition = 'Okay';
      }
      else if (persentage >= 20 && persentage < 40) {
        condition = 'Bad';
      }
      else{
        condition = 'Worst';
      }
      }
    else if (true) {}
  });
return {
  Condition: condition,
  OldMaxIs: oldMax,
  OldAvgIs: oldAvg,
  NewAvgIs: newAvg,
  NewMaxIs: newMax
}
}
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
