var UserDAO             = require('./userDAO');
var MailTemplateDAO     = require('./mailTemplateDAO');
var AlertDAO            = require('./alertDAO');

module.exports = {
  getDAO: function(dao, logger) {
    switch (dao) {
      case 'alert':
        return new AlertDAO(logger);
      case 'user':
        return new UserDAO(logger);
      case 'mailTemplate':
        return new MailTemplateDAO(logger);
      default:
        return null;
    }
  }
};
