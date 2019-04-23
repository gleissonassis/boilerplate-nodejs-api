var BOFactory             = require('../../business/boFactory');
var HTTPResponseHelper    = require('../../helpers/httpResponseHelper');

module.exports = function() {

  return {
    getAll: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      var business = BOFactory.getBO('mailTemplate', req.logger);
      business.getAll({})
        .then(rh.ok)
        .catch(rh.error);
    },

    save: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      var business = BOFactory.getBO('mailTemplate', req.logger);
      business.save(req.body)
        .then(function(r) {
          rh.created(r);
        })
        .catch(rh.error);
    },

    update: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      var business = BOFactory.getBO('mailTemplate', req.logger);
      req.body.id = req.params.id;
      business.update(req.body)
        .then(rh.ok)
        .catch(rh.error);
    },

    getById: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      var business = BOFactory.getBO('mailTemplate', req.logger);
      business.getById(req.params.id)
        .then(rh.ok)
        .catch(rh.error);
    },

    delete: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      var business = BOFactory.getBO('mailTemplate', req.logger);
      business.delete(req.params.id)
        .then(rh.ok)
        .catch(rh.error);
    }
  };
};
