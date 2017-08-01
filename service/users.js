module.exports.createUser = function (hash, name, email) {
  return {
    name: name,
    email: email,
    password: hash,
    created: Date.now(),
    isAdmin: false,
    isActive: true
  }
}
