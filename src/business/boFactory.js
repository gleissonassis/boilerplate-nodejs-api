var MailTemplateBO        = require('./mailTemplateBO');
var UserBO                = require('./userBO');
var AlertBO               = require('./alertBO');
var NotificationBO        = require('./notificationBO');
var DAOFactory            = require('../daos/daoFactory');
var ModelParser           = require('../models/modelParser');
var HelperFactory         = require('../helpers/helperFactory');

function factory(bo, logger) {
  switch (bo) {
    case 'alert':
      return new AlertBO({
        alertDAO: DAOFactory.getDAO('alert', logger),
        modelParser: new ModelParser(logger),
        dateHelper: HelperFactory.getHelper('date', logger)
      }, logger);
    case 'mailTemplate':
      return new MailTemplateBO({
        mailTemplateDAO: DAOFactory.getDAO('mailTemplate', logger),
        modelParser: new ModelParser(logger)
      }, logger);
    case 'notification':
      var modelParser = new ModelParser(logger);

      return new NotificationBO({
        mailTemplateBO: new MailTemplateBO({
          mailTemplateDAO: DAOFactory.getDAO('mailTemplate'),
          modelParser: modelParser,
        }, logger),
        userBO: new UserBO({
          userDAO: DAOFactory.getDAO('user'),
          jwtHelper: HelperFactory.getHelper('jwt'),
          modelParser: modelParser,
          userHelper: HelperFactory.getHelper('user')
        }, logger),
        dynamicTextHelper: HelperFactory.getHelper('dynamicText', logger),
        sendMailHelper: HelperFactory.getHelper('sendMail', logger),
      }, logger);
    case 'user':
      return new UserBO({
        userDAO: DAOFactory.getDAO('user', logger),
        jwtHelper: HelperFactory.getHelper('jwt', logger),
        modelParser: new ModelParser(logger),
        userHelper: HelperFactory.getHelper('user'),
        notificationBO: factory('notification', logger),
        addressBO: factory('address', logger),
        alertBO: factory('alert', logger)
      }, logger);
    default:
      return null;
  }
};

module.exports = {getBO: factory};
