module.exports = function* (next) {
  yield next;
  var xBodyHeaders = this.get('X-Body-Headers');
  if (xBodyHeaders) {
    this.body = {
      body: this.body,
      headers: this.response.headers
    }
  }
}
