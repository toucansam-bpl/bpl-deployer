const { pipe } = require('ramda')

const generateAddress = require('./address-generator')
const generateKeys = require('./key-generator')

module.exports = (generatePassphrase) => {
  return pipe(
    generatePassphrase,
    generateKeys,
    generateAddress,
  )
}