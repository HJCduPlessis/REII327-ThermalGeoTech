var mongoose = require('mongoose');
//Create a mongoose model
var DataSetting = mongoose.model('DataSetting',{
    SetTemperature: {
      type: Number
    },
    SystemState: {
      type: Boolean
    },
});

module.exports = {DataSetting};
