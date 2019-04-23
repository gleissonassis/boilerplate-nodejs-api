var RequestHelper           = require('./requestHelper');
var DateHelper              = require('./dateHelper');
var SendMailHelper          = require('./sendMailHelper');
var DynamicTextHelper       = require('./dynamicTextHelper');
var HashHelper              = require('./hashHelper');
var StringReplacerHelper    = require('./stringReplacerHelper');
var UserHelper              = require('./userHelper');
var JWTHelper               = require('./jwtHelper');
var BotHelper               = require('./botHelper');
var TeleBot                 = require('telebot');
var request                 = require('request');
var nodemailer              = require('nodemailer');
var settings                = require('../config/settings');


module.exports = {
  getHelper: function(helper, logger) {
    switch (helper) {
      case 'hash':
        return HashHelper;
      case 'bot':
        return new BotHelper({
          bot: new TeleBot(settings.bot.alerts.telegramToken)
        }, logger);
      case 'cdal':
        return new CDALHelper({
          requestHelper: this.getHelper('request')
        }, logger);
      case 'request':
        return new RequestHelper({
          request: request
        }, logger);
      case 'date':
        return new DateHelper(logger);
      case 'sendMail':
        return new SendMailHelper(nodemailer, logger);
      case 'stringReplacer':
        return new StringReplacerHelper(logger);
      case 'user':
        return new UserHelper(logger);
      case 'jwt':
        return new JWTHelper(logger);
      case 'dynamicText':
        return new DynamicTextHelper({
          stringReplacerHelper: this.getHelper('stringReplacer')
        }, logger);
      default:
        return null;
    }
  }
};
