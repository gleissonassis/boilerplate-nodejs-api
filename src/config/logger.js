var winston         = require('winston');
var HelperFactory   = require('../helpers/helperFactory');
var settings        = require('./settings');

console.log('HelperFactory', HelperFactory);

module.exports = function() {
  var hashHelper = HelperFactory.getHelper('hash');
  var dateHelper = HelperFactory.getHelper('date');
  var botHelper = HelperFactory.getHelper('bot');

  var logger = winston.createLogger({
    transports: [
      new winston.transports.Console({level: settings.logging.consoleLevel || 'debug'}),
      /*new (winston.transports.DailyRotateFile)({
        level: settings.logging.fileLevel || 'debug',
        filename: 'logs/kaplan-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: false,
        maxSize: '1m',
        maxFiles: '15d'
      })*/
    ]
  });

  var obj = {
    correlationId: null,
    currentUser: null,
    request: null,

    info: function(...args) {
      logger.info(args);
    },

    debug: function(...args) {
      logger.debug(args);
    },

    warn: function(...args) {
      logger.warn(args);
    },

    error: function(...args) {
      logger.error(args);
    },

    logEvent: function(type, message, data) {
      //return null;

      try {
        var self = this;
        var info = {};
        var data = data;

        if (this.request) {
          info = {
            ip: this.request.headers['x-forwarded-for'] || this.request.headers['x-real-ip'] || this.request.connection.remoteAddress,
            userAgent: this.request.headers['user-agent']
          };
        }

        if (data && data.stack && data.message) {
          data = {
            stack: data.stack.toString(),
            message: data.message.toString(),
            raw: data.toString()
          }
        }

        if (data && data.password) {
          delete data.password;
        }

        logEventBO.save({
          type: type,
          message: message,
          data: data,
          user: this.currentUser,
          correlationId: this.correlationId,
          info: info
        })
          .then(function(r) {
            var ignoredEvents = ['NEW_DEPOSIT',
                                  'NEW_NOTIFICATION',
                                  'NEW_LOGIN',
                                  'NEW_USER',
                                  'DEPOSIT_CHANGED',
                                  'NEW_ORDER',
                                  'NEW_TRANSFER_BONUS',
                                  'NEW_NOT_FOUND_DEPOSIT',
                                  'ORDER_CANCELED',
                                  'NEW_ICO_SALE',
                                  'LOGIN_FAILED_EXISTING_USER'];

            if (ignoredEvents.indexOf(type) === -1) {
              try {
                var botMessage = type + ' ' + message +
                                      "\nId: " + r.id +
                                      "\nCorrelation Id: " + self.correlationId;

                if (self.currentUser) {
                  botMessage += "\nCurrent user\n\nName: " + self.currentUser.name  +
                                "\nEmail: " + self.currentUser.email
                }

                botHelper.sendMessage(botMessage);
              } catch (e) {
                console.log('BOT ERROR', e)
              }
            }
          })

      } catch (e) {
        console.log(e);
        console.log('An error has occurred on logEvent', e);
      }
    },

    configureFormat: function() {
      var self = this;
      logger.format = winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(function(info) {
          if (self.currentUser) {
            return '[' + info.timestamp + '] ' + self.correlationId + '@' + self.currentUser.id  + ' - ' + info.message;
          } else {
            return '[' + info.timestamp + '] ' + self.correlationId + ' ' + info.message;
          }
        })
      );
    }
  };

  obj.correlationId = hashHelper(dateHelper.getNow().getTime() + Math.random());
  obj.configureFormat();

  return obj;
};
