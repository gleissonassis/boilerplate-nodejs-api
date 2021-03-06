module.exports = function(dependencies, logger) {
  if (!dependencies) {
    dependencies = {};
  }

  var request = dependencies.request;

  return {
    getJSON: function(url, headers) {
      return this.get(url, headers, true);
    },

    get: function(url, headers, isJSON) {
      return new Promise(function(resolve, reject) {
        logger.info('[RequestHelper] Performing a get to ', url, headers);

        request({
          uri: url,
          method: 'GET',
          headers: headers,
          json: isJSON ? true : false // it is necessary because isJSON can be undefined
        },
        function (error, response, body) {
          if (error) {
            logger.error('[RequestHelper] An error has ocurred while getting ', url, headers, error, body);
            reject({
              status: 500,
              error: error.code
            });
          } else {
            logger.info('[RequestHelper] Get has been performed successfully ', url, headers, body);
            resolve(body);
          }
        });
      });
    },

    post: function(url, data, headers, isJSON, allwedStatus) {
      if (isJSON) {
        return this.postJSON(url, headers, data, allwedStatus);
      } else {
        return this.postFormData(url, headers, data, allwedStatus);
      }
    },

    postJSON: function(url, headers, data, allwedStatus) {
      return new Promise(function(resolve, reject) {
        logger.info('[RequestHelper] Performing a JSON post to ', url, headers, JSON.stringify(data));

        request({
          uri: url,
          method: 'POST',
          headers: headers,
          json: data
        },
        function (error, response, body) {
          if (error) {
            logger.error('[RequestHelper] An error has ocurred while posting to ', url, headers, data, error, body);
            reject({
              status: 500,
              error: error.code
            });
          } else {
            var status = allwedStatus || [];

            logger.info(status.length === 0 ?
                        'All http status are accepted':
                        'Only status ' + JSON.stringify(status) + ' are accepted');
            logger.info('HTTP Status ', response.statusCode);

            if (status.length === 0 || status.indexOf(response.statusCode) > -1) {
              logger.info('[RequestHelper] Post has been performed successfully ', url, headers, data, body);
              resolve(body);
            } else {
              logger.error('[RequestHelper] The HTTP status is not accepted as success');
              delete body.details;
              reject(body);
            }
          }
        });
      });
    },

    postFormData: function(url, headers, data) {
      return new Promise(function(resolve, reject) {
        headers['content-type'] = 'application/x-www-form-urlencoded';

        logger.info('[RequestHelper] Performing a form data post to ', url);
        logger.debug('[RequestHelper] ' + JSON.stringify(headers));
        logger.debug('[RequestHelper] ' + JSON.stringify(data));

        request.post({
          url: url,
          headers: headers,
          form: data
        },
        function (error, response, body) {
          if (error) {
            logger.error('[RequestHelper] An error has ocurred while posting to ', url, error, body);
            reject(body);
          } else {
            logger.info('[RequestHelper] Post has been performed successfully ', url, body);
            resolve(body);
          }
        });
      });
    }
  };
};
