const path  = require('path')
const debug = require('debug')

const root      = require('require-root')('routes').path('')
const package   = require(`${root}/package.json`)
const main      = require(root)
const supertest = require('supertest-as-promised')

const context   = {root}

context.qs      = require('qs')
context.assert  = require('assert')

module.exports = function test(dirname, callback) {
  const relativePath  = path.relative(`${root}/routes`, dirname)
  const pathname      = '.' === relativePath ? '/' : `/${relativePath}`
  const newContext    = Object.create(context)

  newContext.pathname = pathname
  newContext.debug    = debug(`${package.name}:test:${pathname}`)


  describe(pathname, () => {

    before('supertest', () => {

      if (context.request) {
        return
      }

      const loader = main()
      return loader.then(() => {
        context.request = supertest(loader.app.listen())
      })

    })

    callback(newContext)

  })

  return newContext
}
