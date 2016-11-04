const path = require('path')
const supertest = require('supertest-as-promised')
const assert = require('assert')
const debug = require('debug')
const name = require('../../../package.json').name
const root = require('require-root')('routes').path('')

const main = require(root)
const request = supertest(main().app.listen())

const context = {root, name, assert, request}

context.qs = require('qs')

module.exports = function test(dirname, callback) {
  const relativePath = path.relative(root + '/routes', dirname)
  const pathname = '.' === relativePath ? '/' : '/' + relativePath

  describe(pathname, () => {

    before('prepare', () => {
      context.pathname = pathname
      context.debug = debug(`${context.name}:test:${pathname}`)
    })

    callback(context)

  })

  return context
}
