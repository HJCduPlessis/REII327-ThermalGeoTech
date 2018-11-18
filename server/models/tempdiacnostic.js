var mongoose = require('mongoose');
//Create a mongoose model
var TempDiacnostic1 = mongoose.model('TempDiacnostic1',{
    Temperature: {
      type: Number
    }
});

module.exports = {TempDiacnostic1};
