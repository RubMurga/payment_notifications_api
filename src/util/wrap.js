module.exports = {
  wrap: function (fn) {
    return (req, res, next) => {
      fn(req, res).then(returnVal => res.send(returnVal)).catch(next)
    }
  },
  wrapMiddleware: function (fn) {
    return (req, res, next) => {
      fn(req).then(() => next(), next)
    }
  }
}
