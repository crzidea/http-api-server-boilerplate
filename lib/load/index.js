var routes = require('./routes.js');
var cors = require('kcors');
var qs = require('koa-qs');
var errorCatcher = require('../error-catcher');
var bodyHeaders = require('../body-headers');

module.exports = function(app) {
  var router = routes();
  app.use(bodyHeaders);
  app.use(errorCatcher);
  app.use(cors({
    exposeHeaders: ['X-Range', 'X-Set-Token']
  }));
  qs(app, 'extended');
  app.use(router.routes());

  var loaders = {};

  var promisesLoaders = Object.keys(loaders).map(function(name) {
    return loaders[name];
  });

  return Promise.all(promisesLoaders)
  .then(function() {
    return app;
  });
}
