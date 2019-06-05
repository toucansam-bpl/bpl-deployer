const { validateMnemonic } = require('bip39')
const { resolve } = require('path')
const { describe } = require('riteway')

const generateGenesisBlock = require('../genesis-block-generator')

describe('genesis block generator when generating a genesis block from a file with 5 passphrases', async assert => {
  const genesisBlock = generateGenesisBlock({
    addressBalanceFilePath: resolve(__dirname, 'address-balances.txt'),
    delegateCount: 10,
    passphraseFilePath: resolve(__dirname, 'five-passphrases.txt'),
    keyMapFilePath: resolve(__dirname, 'five-passphrase-keymap.txt'),
    votingAddressFilePath: resolve(__dirname, 'voting-addresses.txt')
  })

  const [first, second, third, fourth, fifth, ...rest] = genesisBlock.delegatePassphrases

  assert({
    given: 'a genesis block was generated',
    should: 'have the five passphrases from the file',
    actual: [first, second, third, fourth, fifth],
    expected: [
      'tape upon educate vast toss agent hover one illness tiny bubble reopen',
      'dash snake couple sauce settle wait ankle virus choice beauty across liquid',
      'scatter race dry special nasty pond leopard grief dog safe empty post',
      'undo demand funny tower sheriff same lawn vacant reason rural total despair',
      'siege swear august ordinary dynamic say junior icon cube acoustic aisle stone',
    ],
  })

  assert({
    given: 'a genesis block was generated',
    should: 'have 5 additional random passphrases',
    actual: rest.map(p => validateMnemonic(p)),
    expected: [true, true, true, true, true],
  })
})
