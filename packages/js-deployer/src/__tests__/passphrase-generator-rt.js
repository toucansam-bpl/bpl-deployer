const { validateMnemonic } = require('bip39')
const { resolve } = require('path')
const { describe } = require('riteway')

const generatePassphrase = require('../passphrase-generator')

describe('passphrase generator with no passphrase file', async assert => {
  const passphrases = generatePassphrase()

  const firstPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called',
    should: 'return a random passphrase',
    actual: validateMnemonic(firstPassphrase),
    expected: true,
  })

  const secondPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called a second time',
    should: 'return another random passphrase',
    actual: validateMnemonic(secondPassphrase),
    expected: true,
  })
  
  assert({
    given: 'when iter.next is called a second time',
    should: 'return a different random passphrase',
    actual: firstPassphrase === secondPassphrase,
    expected: false,
  })
})

describe('passphrase generator when created with a file with 2 existing passphrases', async assert => {
  const passphrases = generatePassphrase(resolve(__dirname, 'two-passphrases.txt'))

  const firstPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called the first time',
    should: 'return first passphrase from the file',
    actual: firstPassphrase,
    expected: 'undo demand funny tower sheriff same lawn vacant reason rural total despair',
  })

  const secondPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called a second time',
    should: 'return the second passphrase from the file',
    actual: secondPassphrase,
    expected: 'siege swear august ordinary dynamic say junior icon cube acoustic aisle stone',
  })

  const thirdPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called a third time',
    should: 'return a random passphrase',
    actual: validateMnemonic(thirdPassphrase),
    expected: true,
  })

  assert({
    given: 'when iter.next is called a third time',
    should: 'return a random passphrase that is not the same as either of the file passphrases',
    actual: thirdPassphrase !== firstPassphrase && thirdPassphrase !== secondPassphrase,
    expected: true,
  })
})

describe('passphrase generator when created with a file with 3 existing passphrases', async assert => {
  const passphrases = generatePassphrase(resolve(__dirname, 'three-passphrases.txt'))

  const firstPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called the first time',
    should: 'return first passphrase from file',
    actual: firstPassphrase,
    expected: 'tape upon educate vast toss agent hover one illness tiny bubble reopen',
  })

  const secondPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called a second time',
    should: 'return second passphrase from file',
    actual: secondPassphrase,
    expected: 'dash snake couple sauce settle wait ankle virus choice beauty across liquid',
  })

  const thirdPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called a third time',
    should: 'return the third passphrase from the file',
    actual: thirdPassphrase,
    expected: 'scatter race dry special nasty pond leopard grief dog safe empty post',
  })

  const fourthPassphrase = passphrases.next().value
  assert({
    given: 'when iter.next is called a fourth time',
    should: 'return a random passphrase',
    actual: validateMnemonic(fourthPassphrase),
    expected: true,
  })

  assert({
    given: 'when iter.next is called a fourth time',
    should: 'return a random passphrase that is not the same as any of the file passphrases',
    actual: fourthPassphrase !== firstPassphrase && fourthPassphrase !== secondPassphrase && fourthPassphrase !== thirdPassphrase,
    expected: true,
  })
  
})