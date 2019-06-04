const { describe } = require('riteway')

const generateDelegateTransaction = require('../delegate-transaction-generator')

describe('delegate transaction generator', async assert => {
  assert({
    given: 'when given an object with a private key, address, and username',
    should: 'return an object with a delegate transaction signed by the private key',
    actual: generateDelegateTransaction({
      address: 'BC4Jgv5SMwdwEZPYcnHcLvNxxKtKDEkSSN',
      passphrase: 'undo demand funny tower sheriff same lawn vacant reason rural total despair',
      keys: {
        compressed: true,
        privateKey: 'd25f628c4be9edfe1277cbc301e1d96aea822bdea750cfc2deb74fcf4ecde35c',
        publicKey: '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a',
      },
      username: 'TEST_USER_1',
    }),
    expected: {
      address: 'BC4Jgv5SMwdwEZPYcnHcLvNxxKtKDEkSSN',
      transaction: {
        timestamp: 0,
        version: 1,
        type: 2,
        fee: 0,
        amount: 0,
        recipientId: null,
        senderPublicKey: '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a',
        asset: {
          delegate: {
            username: 'TEST_USER_1',
            publicKey: "03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a"
          }
        },
        signature: '3044022030b308bee0869c538a547d5ee1985087e021b884e0b744e15f4ebe3ecfb036a102207acf9a1b5119ab9c5c21d6ddc06eac4a7d021d85eb3ebf193016eb79df876a32',
        senderId: 'BC4Jgv5SMwdwEZPYcnHcLvNxxKtKDEkSSN',
        id: '89cd805338f2a60d91ed7b7bf3dce7d9571b7af3c74df4c43de4cbe87015dbce'
      },
      passphrase: 'undo demand funny tower sheriff same lawn vacant reason rural total despair',
      keys: {
        compressed: true,
        privateKey: 'd25f628c4be9edfe1277cbc301e1d96aea822bdea750cfc2deb74fcf4ecde35c',
        publicKey: '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a',
      },
      username: 'TEST_USER_1',
    },
  })
})
