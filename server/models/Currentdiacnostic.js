var mongoose = require('mongoose');
//Create a mongoose model
var Currentdiacnostic = mongoose.model('Currentdiacnostic3',{
    Current: {
      type: Number
    }
});

module.exports = {Currentdiacnostic};
