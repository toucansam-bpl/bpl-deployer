const { generateMnemonic } = require('bip39')
const { fromFile } = require('gen-readlines')

module.exports = function* (passphraseFilePath) {
  if (passphraseFilePath) {
    for(let passphrase of fromFile(passphraseFilePath)) {
      yield passphrase.toString()
    }
  }
  
  while (true) {
    yield generateMnemonic()
  }
}