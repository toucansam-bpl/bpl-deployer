const { crypto } = require('@arkecosystem/crypto')

module.exports = objWithKeys => ({
  ... objWithKeys,

  address: crypto.getAddress(objWithKeys.keys.publicKey, 25),
})