var responseTime = require('koa-response-time');
var compress = require('koa-compress');
var load = require('./lib/load/');
var koa = require('koa');
var package = require('./package.json')
var debug = require('debug')(`${package.name}:main`);
var etag = require('k-etag-not-modified');

/**
 * Environment.
 */
var env = process.env.NODE_ENV || 'development';

/**
 * Expose `api()`.
 */
module.exports = api;

var app = null;

/**
 * Initialize an app with the given `opts`.
 * The app is a singleton.
 *
 * @param   {Object}      opts
 * @return  {Application}
 * @api public
 */
function api(opts) {
  if (app) {
    return app;
  }
  opts = opts || {};
  app = koa();

  // x-response-time
  app.use(responseTime());

  app.use(etag());

  // boot
  var loader = load(app);
  loader.app = app;

  return loader;
}
