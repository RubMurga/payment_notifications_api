module.exports = {
  isUserNull: function (user) {
    if (!user) throw new Error('User not found')
  }
}
