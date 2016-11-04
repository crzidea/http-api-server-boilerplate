var debug = require('debug')('error-cacher');

module.exports = function* (next) {
  var env = process.env.NODE_ENV || 'development';
  try {
    yield next;
    if (404 === this.response.status && !this.response.body) {
      var error = Error('Not found');
      error.status = 404;
      throw error;
    }
  } catch (e) {
    this.response.status = e.status || 500;
    this.response.body = {};
    this.response.body.message = e.message;
    var xEnv = this.request.headers['x-env'] || process.env.NODE_ENV || env;
    if ('production' !== xEnv) {
      this.response.body.stack = e.stack;
    }
    debug(e);
  }
}
