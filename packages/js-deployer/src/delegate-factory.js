const { pipe } = require('ramda')

const walletFactory = require('./wallet-factory')
const generateDelegateTransaction = require('./delegate-transaction-generator')
const generatePassphrase = require('./passphrase-generator')
const generateUsernames = require('./username-generator')

module.exports = (passphraseFilePath, keyMapFilePath) => {
  const passphrases = generatePassphrase(passphraseFilePath)
  const getNextUsername = generateUsernames(keyMapFilePath)
  const createWallet = walletFactory(() => ({ passphrase: passphrases.next().value, }))

  return pipe(
    createWallet,
    getNextUsername,
    generateDelegateTransaction,
  )
}