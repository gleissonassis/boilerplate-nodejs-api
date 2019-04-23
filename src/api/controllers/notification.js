var BOFactory             = require('../../business/boFactory');
var HTTPResponseHelper    = require('../../helpers/httpResponseHelper');

module.exports = function() {
  return {
    sendNotification: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      var business = BOFactory.getBO('notification', req.logger);
      business.sendNotification(req.body)
        .then(rh.ok)
        .catch(rh.error);
    }
  };
};
