const { Bignum, } = require('@arkecosystem/crypto')
const { readFileSync } = require('fs')

module.exports = filePath =>
    readFileSync(filePath).toString()
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const [ address, balance ] = line.split('|')
          return {
            address: address.trim(),
            legacyBplBalance: balance.trim(),
          }
        })
        .map(bplBalance => {
          const [ balance ] = bplBalance.legacyBplBalance.split('.')
          return {
            address: bplBalance.address,
            balance: Bignum(balance),
          }
        })
