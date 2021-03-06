var model               = require('../models/mailTemplate')();
var $                   = require('mongo-dot-notation');

module.exports = function(logger) {
  var projectionCommonFields = {
    __v: false,
    isEnabled: false,
  };

  return {
    clear: function() {
      return new Promise(function(resolve, reject) {
        model.remove({}, function(err) {
          if (err) {
            logger.error('An error has occurred while deleting all mail templates', err);
            reject(err);
          } else {
            logger.info('The mail templates have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        logger.debug('Getting mail templates from database', filter);

        model.find(filter, projectionCommonFields)
          .lean()
          .exec()
          .then(function(items) {
            logger.debug('%d mail templates were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.error('An error has ocurred while mail templates from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.info('Creating a new mail template', JSON.stringify(entity));
        model.create(entity)
        .then(function(item) {
          logger.info('The mail template has been created succesfully', JSON.stringify(item));
          return self.getById(item._id);
        })
        .then(resolve)
        .catch(function(error) {
          logger.error('An error has ocurred while saving a new mail template', error);
          reject({
            status: 422,
            message: error.message
          });
        });
      });
    },

    update: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.info('Update a mail template');

        model.findByIdAndUpdate(entity._id, $.flatten(entity), {'new': true})
        .then(function(item) {
          logger.info('The mail template has been updated succesfully');
          logger.debug(JSON.stringify(item.toObject()));
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while updating a mail template', error);
          reject({
            status: 422,
            message: error
          });
        });
      });
    },

    getById: function(id) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.info('Getting a mail template by id %s', id);

        self.getAll({_id: id, isEnabled: true})
        .then(function(mailTemplates) {
          if (mailTemplates.length === 0) {
            logger.debug('Mail template not found');
            resolve(null);
          } else {
            logger.debug('The mail template was found');
            logger.debug(JSON.stringify(mailTemplates[0]));
            resolve(mailTemplates[0]);
          }
        }).catch(function(erro) {
            logger.error('An error has occurred while getting a mail template by id %s', id, erro);
            reject(erro);
        });
      });
    },

    disable: function(id) {
      return new Promise(function(resolve, reject) {
        logger.info('Disabling a mail template');

        model.findByIdAndUpdate(id, {_id:id, isEnabled: false}, {'new': true, fields: projectionCommonFields})
        .then(function(item) {
          logger.info('The mail template has been disabled succesfully');
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while disabling a mail template', error);
          reject({
            status: 422,
            message: error
          });
        });
      });
    },
  };
};
