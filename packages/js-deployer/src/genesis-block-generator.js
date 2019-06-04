const generateSequence = require('./sequence-generator')

const delegateFactory = require('./delegate-factory')
const generatePassphrase = require('./passphrase-generator')
const genesisBlockFactory = require('./genesis-block-factory')
const walletFactory = require('./wallet-factory')

module.exports = ({ delegateCount, passphraseFilePath, keyMapFilePath }) => {
  const createDelegate = delegateFactory(passphraseFilePath, keyMapFilePath)
  const passphrases = generatePassphrase()
  const createWallet = walletFactory(() => ({ passphrase: passphrases.next().value }))

  const genesisWallet = createWallet()
  const delegates = generateSequence(delegateCount).map(createDelegate)
  const createGenesisBlock = genesisBlockFactory({
    genesisWallet,
    timestamp: 0,
  })

  return {
    delegatePassphrases: delegates.map(d => d.passphrase),
    genesisBlock: createGenesisBlock(delegates.map(d => d.transaction)),
    genesisWallet,
  }
}
