var crypto = require('crypto');

module.exports = function(data) {
  return data ? crypto.createHmac('sha256', data.toString()).digest('hex') : null;
};
