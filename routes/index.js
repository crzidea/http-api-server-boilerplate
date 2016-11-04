module.exports = (context) => {
  context.router.get('/', function* () {
    this.response.body = {}
  })
}
