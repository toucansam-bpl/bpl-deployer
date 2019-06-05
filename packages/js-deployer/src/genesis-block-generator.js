const { Bignum, client, crypto, } = require('@arkecosystem/crypto')
const { pipe } = require('ramda')

const generateSequence = require('./sequence-generator')

const readAddressBalanceFile = require('./address-balance-file-reader')
const delegateFactory = require('./delegate-factory')
const generatePassphrase = require('./passphrase-generator')
const genesisBlockFactory = require('./genesis-block-factory')
const walletFactory = require('./wallet-factory')

module.exports = ({ delegateCount, passphraseFilePath, keyMapFilePath, addressBalanceFilePath, }) => {
  const createDelegate = delegateFactory(passphraseFilePath, keyMapFilePath)
  const passphrases = generatePassphrase()
  const createWallet = walletFactory(() => ({ passphrase: passphrases.next().value }))

  const genesisWallet = createWallet()
  const premineWallet = createWallet()
  const balanceTransfers = readAddressBalanceFile(addressBalanceFilePath)
    .map(createTransferTransaction(premineWallet))

  const delegates = generateSequence(delegateCount).map(createDelegate)
  const createGenesisBlock = genesisBlockFactory({
    genesisWallet,
    timestamp: 0,
  })

  return {
    delegatePassphrases: delegates.map(d => d.passphrase),
    genesisBlock: createGenesisBlock(delegates.map(d => d.transaction).concat(balanceTransfers)),
    genesisWallet,
  }
}

const transferBalances = senderWallet => pipe(
  readAddressBalanceFile,
  createTransferTransaction(senderWallet)
)

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
