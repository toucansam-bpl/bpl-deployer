const { Bignum, client, crypto, } = require('@arkecosystem/crypto')

const generateSequence = require('./sequence-generator')

const delegateFactory = require('./delegate-factory')
const generatePassphrase = require('./passphrase-generator')
const genesisBlockFactory = require('./genesis-block-factory')
const walletFactory = require('./wallet-factory')

module.exports = ({
        addressBalances,
        delegateCount,
        delegateRegistrationRefundAddresses,
        secondPassphraseRefundAddresses,
        votingRefundAddresses,
    }) => {
  const createDelegate = delegateFactory()
  const passphrases = generatePassphrase()
  const createWallet = walletFactory(() => ({ passphrase: passphrases.next().value }))

  const genesisWallet = createWallet()
  const premineWallet = createWallet()
  const balanceTransfers = addressBalances.map(createTransferTransaction(premineWallet))

  const delegateRegistrationRefunds = delegateRegistrationRefundAddresses
    .map(createDelegateRegistrationRefundTransaction(premineWallet))

  const secondPassphraseRefunds = secondPassphraseRefundAddresses
    .map(createSecondPassphraseRefundTransaction(premineWallet))

  const voteRefunds = votingRefundAddresses
    .map(createVoteRefundTransaction(premineWallet))

  const delegates = generateSequence(delegateCount).map(createDelegate)
  const createGenesisBlock = genesisBlockFactory({
    genesisWallet,
    timestamp: 0,
  })

  const allTransactions = delegates.map(d => d.transaction)
    .concat(balanceTransfers)
    .concat(delegateRegistrationRefunds)
    .concat(secondPassphraseRefunds)
    .concat(voteRefunds)

  return {
    delegatePassphrases: delegates.map(d => d.passphrase),
    genesisBlock: createGenesisBlock(allTransactions),
    genesisWallet,
  }
}

const createTransferTransaction = senderWallet => ({ address, balance }) => {
  const { data } = client
    .getBuilder()
    .transfer()
    .recipientId(address)
    .amount(balance)
    .vendorField('v2 balance migration')
    .network(25)
    .sign(senderWallet.passphrase)

  return formatGenesisTransaction(data, senderWallet)
}

const createDelegateRegistrationRefundTransaction = senderWallet => address => {
  const { data } = client
    .getBuilder()
    .transfer()
    .recipientId(address)
    .amount(Bignum(1000000000))
    .vendorField('v2 delegate registration refund')
    .network(25)
    .sign(senderWallet.passphrase)

  return formatGenesisTransaction(data, senderWallet)
}

const createSecondPassphraseRefundTransaction = senderWallet => address => {
  const { data } = client
    .getBuilder()
    .transfer()
    .recipientId(address)
    .amount(Bignum(500000000))
    .vendorField('v2 second passphrase refund')
    .network(25)
    .sign(senderWallet.passphrase)

  return formatGenesisTransaction(data, senderWallet)
}

const createVoteRefundTransaction = senderWallet => address => {
  const { data } = client
    .getBuilder()
    .transfer()
    .recipientId(address)
    .amount(Bignum(100000000))
    .vendorField('v2 vote refund')
    .network(25)
    .sign(senderWallet.passphrase)

  return formatGenesisTransaction(data, senderWallet)
}

const formatGenesisTransaction = (transaction, wallet) => {
  Object.assign(transaction, {
    fee: Bignum(0),
    timestamp: 0,
    senderId: wallet.address,
  })
  transaction.signature = crypto.sign(transaction, wallet.keys)
  transaction.id = crypto.getId(transaction)

  return transaction
}

