var util      = require('util');

module.exports = {
    mongoUrl : util.format('mongodb://%s/%s',
                      process.env.DB_SERVER || 'localhost',
                      process.env.DB_NAME   || 'boilerplate'),
    servicePort : process.env.PORT || 3003,
    isMongoDebug : true,
    jwt: {
      secret: 'secret',
      expiresIn: '1h'
    },
    mailOptions: {
      host: 'host',
      port: 465,
      secure: true,
      auth: {
          user: 'user',
          pass: 'pass'
      }
    },
    logging: {
      consoleLevel: process.env.LOGGING_CONSOLE_LEVEL || 'debug'
    },
    bot: {
      alerts: {
        telegramToken: process.env.BOT_ALERTS_TOKEN || '652364022:AAFxRx2qvB1jXdB2YqVJvuwXgNzIesG8TwY',
        to: process.env.BOT_ALERTS_TO || '349532639'
      }
    }
};
