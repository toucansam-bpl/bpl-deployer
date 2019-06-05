const { Bignum, } = require('@arkecosystem/crypto')
const { resolve } = require('path')
const { describe } = require('riteway')

const readAddressBalances = require('../address-balance-file-reader')

describe('mapping file reader', async assert => {
  assert({
    given: 'when reading an address balance file',
    should: 'return the file as an array of address balance objects with previous decimal places truncated',
    actual: readAddressBalances(resolve(__dirname, 'address-balances.txt')),
    expected: [
      { address: 'BA62giaXsh7aHT22WwiNG7XSbfBaA1yUfd', balance: Bignum(10000000) },
      { address: 'BPJAnBKCTrs2gRq1BQ4JhefmQj5un7qDeX', balance: Bignum(20662238615) },
      { address: 'BHwFtrequ9d9sh54WCy7Uf7CJJA8E8VXQy', balance: Bignum(20923299352) },
      { address: 'B9iPEpawQ8ew914SqNLKDzwDU5GTZJBDUK', balance: Bignum(21169724404) },
      { address: 'BNs2XvBYLXHj4kvc1C5KjuphtiJwXYa28c', balance: Bignum(110000000) },
      { address: 'BBfQZYJ3UHQUXfBt4MVsQFyjsGo4h1ok63', balance: Bignum(1510000000) },
      { address: 'BGY4AuJaaBGMTem4ffcP8Yf6yMXNJmpxAg', balance: Bignum(20000000) },
      { address: 'BNWHimnmuDUQaMVyUfnscz74WY5dqTbRhX', balance: Bignum(20000000) },
      { address: 'BBy9Dnx6T1V3N2C5Uu7WcskXJ5LRZm1wsm', balance: Bignum(19782741694) },
      { address: 'BNLj4GcK7do3DonyfmKHp8SAW6mKf1tSbC', balance: Bignum(21081490747) },
      { address: 'BBBc1iV4pDv7jX9T3TqEm82F5Qn66aiwj9', balance: Bignum(20489542016) },
    ]
  })
})
