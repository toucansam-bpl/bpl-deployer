const { crypto } = require('@arkecosystem/crypto')

module.exports = objWithPassphrase => ({
  ... objWithPassphrase,

  keys: crypto.getKeys(objWithPassphrase.passphrase)
})