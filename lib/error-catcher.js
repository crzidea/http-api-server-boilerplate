const root      = require('require-root')('.routes').path('')
const package   = require(`${root}/package.json`)
const debug     = require('debug')(`${package.name}:error-catcher`)

module.exports = function* (next) {
  const env = process.env.NODE_ENV || 'development';
  try {
    yield next;
    if (404 === this.response.status && !this.response.body) {
      const error = Error('Not found');
      error.status = 404;
      throw error;
    }
  } catch (e) {
    this.response.status = e.status || 500;
    this.response.body = {};
    this.response.body.message = e.message;
    const xEnv = this.request.headers['x-env'] || process.env.NODE_ENV || env;
    if ('production' !== xEnv) {
      this.response.body.stack = e.stack;
    }
    debug(e);
  }
}
