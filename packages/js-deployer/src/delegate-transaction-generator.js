const { Bignum, client, crypto } = require('@arkecosystem/crypto')
const { pipe } = require('ramda')

const rawDelegateTransaction = delegate => ({
  ... delegate,

  transaction: client
    .getBuilder()
    .delegateRegistration()
    .amount(Bignum.ZERO)
    .usernameAsset(delegate.username)
    .sign(delegate.passphrase)
    .data
})

const addCommonTransactionProperties = delegate => {
  return ({
    ... delegate,

    transaction: {
      ... delegate.transaction,

      fee: new Bignum(0),
      timestamp: 0,
      senderId: delegate.address,
    },
  })
}

const signTransaction = delegate => ({
  ... delegate,

  transaction: {
    ... delegate.transaction,

    signature: crypto.sign(delegate.transaction, delegate.keys),
  },
})

const addTransactionId = delegate => ({
  ... delegate,

  transaction: {
    ... delegate.transaction,

    id: crypto.getId(delegate.transaction),
  },
})

module.exports = pipe(
  rawDelegateTransaction,
  addCommonTransactionProperties,
  signTransaction,
  addTransactionId,
)
