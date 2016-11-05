const path  = require('path')
const debug = require('debug')

const root      = require('require-root')('routes').path('')
const package   = require(`${root}/package.json`)
const main      = require(root)
const supertest = require('supertest-as-promised')
const request   = supertest(main().app.listen())

const context   = {root, request}

context.qs      = require('qs')
context.assert  = require('assert')

module.exports = function test(dirname, callback) {
  const relativePath  = path.relative(`${root}/routes`, dirname)
  const pathname      = '.' === relativePath ? '/' : `/${relativePath}`
  const newContext    = Object.create(context)

  newContext.pathname = pathname
  newContext.debug    = debug(`${package.name}:test:${pathname}`)

  describe(pathname, () => {
    callback(newContext)
  })

  return newContext
}
