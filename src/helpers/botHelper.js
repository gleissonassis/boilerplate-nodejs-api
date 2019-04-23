var settings      = require('../config/settings');

module.exports = function(dependencies) {
  if (!dependencies) {
    dependencies = {};
  }

  var bot = dependencies.bot;

  return {
    sendMessage: function(text) {
      return bot.sendMessage(settings.bot.alerts.to, text);
    }
  };
};
