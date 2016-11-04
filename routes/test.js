var test = require('require-root')('routes')('lib/load/test');
var assert = require('assert');

test(__dirname, (package) => {
  describe('middleware #catch', () => {

    var neverfoundpath = '/neverfoundpath';

    describe('use env: development', () => {
      before(() => {
        process.env.NODE_ENV = 'development';
      });
      it('should respond `stack`', () => (
        package.request.get(neverfoundpath)
        .expect(404)
        .then(function(res) {
          assert(res.body.message);
          assert(res.body.stack);
        })
      ));
    });

    describe('use env: production', () => {
      before(() => {
        process.env.NODE_ENV = 'production';
      });
      it('should respond `stack`', () => (
        package.request.get(neverfoundpath)
        .expect(404)
        .then(function(res) {
          assert(res.body.message);
          assert.strictEqual(res.body.stack);
        })
      ));
    });

    describe('use env: production, with `x-env` header', () => {
      before(() => {
        process.env.NODE_ENV = 'production';
      });
      it('should respond `stack`', () => (
        package.request.get(neverfoundpath)
        .set('x-env', 'test')
        .expect(404)
        .then(function(res) {
          assert(res.body.message);
          assert(res.body.stack);
        })
      ));
    });

  });

  describe('/', () => {
    describe('GET', () => {
      it('should respond 200', () => (
        package.request.get('/')
        .expect(200)
        .then((res) => {
          assert(res.body)
        })
      ))
    })
  })
})
