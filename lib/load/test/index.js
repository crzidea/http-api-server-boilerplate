var path = require('path');
var request = require('supertest-as-promised');
var assert = require('assert');
var debug = require('debug');
var name = require('../../../package.json').name
var root = require('require-root')('routes').path('');

var main = require(root);

var package = {root, name, assert};

var prepare = {};
package.request = request(main().app.listen());

package.authorizations = {};
package.accounts = [];

module.exports = function(dirname, callback) {
  var relativePath = path.relative(root + '/routes', dirname);
  var pathname = '.' === relativePath ? '/' : '/' + relativePath;
  package.debug = debug(`${package.name}:test:${pathname}`);

  var loaders = Object.keys(prepare).map((name) => {
    return prepare[name];
  });

  describe(pathname, () => {

    before('prepare', () => {
      package.pathname = pathname
      return Promise.all(loaders)
      .then(() => {
        module.exports.package = package;
      });
    });

    callback(package);

  });

  return package;
}
