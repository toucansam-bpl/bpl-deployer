const { Bignum, crypto, } = require('@arkecosystem/crypto')

const generateSequence = require('./sequence-generator')

const delegateFactory = require('./delegate-factory')
const generatePassphrase = require('./passphrase-generator')
const genesisBlockFactory = require('./genesis-block-factory')
const walletFactory = require('./wallet-factory')

module.exports = ({ delegateCount, passphraseFilePath, keyMapFilePath, totalPremine, }) => {
  const createDelegate = delegateFactory(passphraseFilePath, keyMapFilePath)
  const passphrases = generatePassphrase()
  const createWallet = walletFactory(() => ({ passphrase: passphrases.next().value }))

  const genesisWallet = createWallet()
  const premineWallet = createWallet()
  const premineTransfer = createTransferTransaction(premineWallet, genesisWallet, Bignum(totalPremine))

  const delegates = generateSequence(delegateCount).map(createDelegate)
  const createGenesisBlock = genesisBlockFactory({
    genesisWallet,
    timestamp: 0,
  })

  return {
    delegatePassphrases: delegates.map(d => d.passphrase),
    genesisBlock: createGenesisBlock(delegates.map(d => d.transaction).concat([premineTransfer])),
    genesisWallet,
  }
}


const createTransferTransaction = (senderWallet, receiverWallet, amount) => {
  const { data } = client
    .getBuilder()
    .transfer()
    .recipientId(receiverWallet.address)
    .amount(amount)
    .network(this.prefixHash)
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
