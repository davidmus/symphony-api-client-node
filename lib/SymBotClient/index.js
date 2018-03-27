const SymBotAuth = require('../SymBotAuth');
const SymConfigLoader = require('../SymConfigLoader');
const DatafeedEventsService = require('../DatafeedEventsService');
const MessagesClient = require('../MessagesClient');
const Q = require('kew');

var SymBotClient = {};

SymBotClient.sessionToken = {};

SymBotClient.initBot = (path_to_config_file) => {
  var defer = Q.defer();

  SymConfigLoader.loadFromFile(path_to_config_file).then( SymConfig => {
    SymBotAuth.authenticate( SymConfig ).then( (symAuth) => {
      defer.resolve( { 'config': SymConfig, 'sessionAuthToken': symAuth.sessionAuthToken, 'kmAuthToken': symAuth.kmAuthToken } );
    })
  }).fail( (err) => {
    defer.reject( err );
  });

  return defer.promise;
}

SymBotClient.getDatafeedEventsService = (subscriberCallback) => {
  DatafeedEventsService.initService(subscriberCallback);
}

SymBotClient.sendMessage = ( conversationId, message, data ) => {
  var defer = Q.defer();

  MessagesClient.sendMessage( conversationId, message, data ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

module.exports = SymBotClient;