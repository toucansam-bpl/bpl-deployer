const { describe } = require('riteway')

const generateAddress = require('../address-generator')

describe('address generator', async assert => {
  assert({
    given: 'when supplied with an object with a set of keys',
    should: 'return an object with the proper address added',
    actual: generateAddress({
      passphrase: 'tape upon educate vast toss agent hover one illness tiny bubble reopen',
      keys: {
        compressed: true,
        privateKey: '8b82f0777f9039b2d93e8d2ad412496689e3bc42da3a93e4c3190925f4d8d0f3',
        publicKey: '032c74afe53f9b74391a673b939f317fbc79ae85d80554d881cbb88976dfbecbe7',
      },
    }),
    expected: {
      address: 'B9gVs1EYvuSCALJTii3LPmYup8VQcc5osm',
      passphrase: 'tape upon educate vast toss agent hover one illness tiny bubble reopen',
      keys: {
        compressed: true,
        privateKey: '8b82f0777f9039b2d93e8d2ad412496689e3bc42da3a93e4c3190925f4d8d0f3',
        publicKey: '032c74afe53f9b74391a673b939f317fbc79ae85d80554d881cbb88976dfbecbe7',
      },
    },
  })

  assert({
    given: 'when supplied with an object with a set of keys',
    should: 'return an object with the proper address added',
    actual: generateAddress({
      passphrase: 'scatter race dry special nasty pond leopard grief dog safe empty post',
      keys: {
        compressed: true,
        privateKey: '59114efe18462da9906c48b67a31725e99a3e28aaf3b7085ed846eb4e23a7fd6',
        publicKey: '02602e8bb6f7c67ec41f24bbe62ebf4b7bad640238bcc487dd0f33a8579eda7941',
      },
    }),
    expected: {
      address: 'BTmvsCqBBLfRAxHJmynvVM43pGzTB8cfdR',
      passphrase: 'scatter race dry special nasty pond leopard grief dog safe empty post',
      keys: {
        compressed: true,
        privateKey: '59114efe18462da9906c48b67a31725e99a3e28aaf3b7085ed846eb4e23a7fd6',
        publicKey: '02602e8bb6f7c67ec41f24bbe62ebf4b7bad640238bcc487dd0f33a8579eda7941',
      },
    },
  })
})