const { describe } = require('riteway')

const generateKeys = require('../key-generator')

describe('key generator', async assert => {
  const delegate = generateKeys({
    passphrase: 'tape upon educate vast toss agent hover one illness tiny bubble reopen'
  })

  assert({
    given: 'when supplied with an object with a passphrase',
    should: 'return an object with the passphrase and the proper keys',
    actual: delegate,
    expected: {
      passphrase: delegate.passphrase,
      keys: {
        compressed: true,
        privateKey: '8b82f0777f9039b2d93e8d2ad412496689e3bc42da3a93e4c3190925f4d8d0f3',
        publicKey: '032c74afe53f9b74391a673b939f317fbc79ae85d80554d881cbb88976dfbecbe7',
      },
    },
  })

  const delegate2 = generateKeys({
    passphrase: 'scatter race dry special nasty pond leopard grief dog safe empty post',
  })
  assert({
    given: 'when supplied with an object with a different passphrase',
    should: 'return an object with the different passphrase and different keys',
    actual: delegate2,
    expected: {
      passphrase: delegate2.passphrase,
      keys: {
        compressed: true,
        privateKey: '59114efe18462da9906c48b67a31725e99a3e28aaf3b7085ed846eb4e23a7fd6',
        publicKey: '02602e8bb6f7c67ec41f24bbe62ebf4b7bad640238bcc487dd0f33a8579eda7941',
      },
    },
  })
})