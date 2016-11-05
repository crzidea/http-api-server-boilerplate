const path    = require('path')
const fs      = require('fs')
const Router  = require('koa-router')

const root      = require('require-root')('routes').path('')
const package   = require(`${root}/package.json`)
const debug     = require('debug')
const log       = debug(`${package.name}:load`)
const error     = debug(`${package.name}:load:error`)
const routeRoot = `${root}/routes`

/**
 * Load resources in `routes` directory.
 * Using Deep-First-Search
 *
 * @param {Application} app
 * @api private
 */
module.exports = function routes(context, dir){
  context = context || {}
  dir = dir || routeRoot
  const composedRouter = new Router()
  fs.readdirSync(dir).forEach((file) => {
    const child = path.resolve(dir, file)
    const stats = fs.lstatSync(child)
    if (!stats.isDirectory()) {
      return
    }
    const prefix = '/' + path.relative(dir, child)
    composedRouter.use(prefix, routes(context, child).routes())
  })
  load(dir)

  function load(routeDir){
    const newContext = Object.create(context)
    newContext.router = new Router()
    const prefix = '/' + path.relative(routeRoot, routeDir)
    newContext.debug = debug(`${package.name}:router:${prefix}`)
    try {
      require(routeDir)(newContext)
      if (newContext.router.routes) {
        composedRouter.use(newContext.router.routes())
      }
      log(`found routes in: ${prefix}`)
    } catch(e) {
      if ('MODULE_NOT_FOUND' !== e.code) {
        throw e
      }
    }
  }

  return composedRouter
}
