var mongoose = require('mongoose'); //712
//promisis
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hennieduplessis:QvdfVti9Qxhqw5bC@reii327cluster-shard-00-00-udnes.mongodb.net:27017,reii327cluster-shard-00-01-udnes.mongodb.net:27017,reii327cluster-shard-00-02-udnes.mongodb.net:27017/testdb?ssl=true&replicaSet=Reii327Cluster-shard-0&authSource=admin&retryWrites=true',{useNewUrlParser: true});


module.exports = {mongoose};
