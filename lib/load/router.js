var debug = require('debug')('mit-api:load');
var error = require('debug')('mit-api:load:error');
var path = require('path');
var fs = require('fs');
var Router = require('koa-router');
var root = __dirname + '/../../routes/';

/**
 * Load resources in `routes` directory.
 * Using Deep-First-Search
 *
 * @param {Application} app
 * @api private
 */
module.exports = function routes(context, dir){
  context = context || {}
  dir = dir || root;
  const composedRouter = new Router()
  fs.readdirSync(dir).forEach((file) => {
    var child = path.resolve(dir, file)
    var stats = fs.lstatSync(child)
    if (!stats.isDirectory()) {
      return
    }
    var prefix = '/' + path.relative(dir, child)
    composedRouter.use(prefix, routes(context, child).routes())
  })
  load(dir)

  function load(routeDir){
    context.router = new Router()
    try {
      require(routeDir)(context)
      if (context.router.routes) {
        composedRouter.use(context.router.routes())
      }
      debug('found routes in: %s', routeDir)
    } catch(e) {
      if ('MODULE_NOT_FOUND' !== e.code) {
        throw e
      }
    }
  }

  return composedRouter
}
