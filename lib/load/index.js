const router = require('./router.js')
const cors = require('kcors')
const qs = require('koa-qs')
const bodyParser = require('koa-bodyparser')
const errorCatcher = require('../error-catcher')
const bodyHeaders = require('../body-headers')

module.exports = function(app) {
  app.use(bodyParser())
  app.use(cors())
  app.use(bodyHeaders)
  app.use(errorCatcher)

  qs(app, 'extended')

  const context = {}
  app.use(router(context).routes())

  const loaders = []
  /**
   * @example loaders.push(require('./kafka-producer.js')(context))
   */

  return Promise.all(loaders).then(() => app)
}
