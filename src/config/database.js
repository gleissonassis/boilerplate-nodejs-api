var mongoose    = require('mongoose');
var settings    = require('./settings');

module.exports = function(){
  mongoose.connect(settings.mongoUrl, {useMongoClient: true});
  mongoose.Promise = Promise;
  mongoose.set('debug', settings.isMongoDebug);

  mongoose.connection.on('connected', function() {
    console.log('Mongoose! Connected at ' + settings.mongoUrl);
  });

  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose! Disconnected em ' + settings.mongoUrl);
  });

  mongoose.connection.on('error', function(erro) {
    console.log('Mongoose! Error : ' + erro);
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('Mongoose! Disconnected by the application');
      process.exit(0);
    });
  });
};
