var mongoose = require('mongoose');
//Create a mongoose model
var NewData = mongoose.model('NewData',{
    Temperature: {
      type: Number
    },
    Current: {
      type: Number
    },
    SystemState: {
      type: Boolean
    },
    SelfTestInvoked: {
      type: Boolean
    },
    SendDataAt: {
      type: Number
    }
});

module.exports = {NewData};
