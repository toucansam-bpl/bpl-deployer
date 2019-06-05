const { validateMnemonic } = require('bip39')
const { crypto } = require('@arkecosystem/crypto')
const { resolve } = require('path')
const { describe } = require('riteway')
const { privateKeyVerify } = require('secp256k1')

const delegateFactory = require('../delegate-factory')

const verifyBplAddress = address => crypto.validateAddress(address, 25)

describe('delegate factory, when creating a delegate from scratch', async assert => {
  const createDelegate = delegateFactory()
  const delegate = createDelegate()

  assert({
    given: 'a generated delegate',
    should: 'have a bip39 passphrase',
    actual: validateMnemonic(delegate.passphrase),
    expected: true,
  })

  assert({
    given: 'a generated delegate',
    should: 'have compressed keys in key object',
    actual: delegate.keys.compressed,
    expected: true,
  })

  assert({
    given: 'a generated delegate',
    should: 'have a properly formatted public key in key object',
    actual: crypto.validatePublicKey(delegate.keys.publicKey),
    expected: true,
  })

  assert({
    given: 'a generated delegate',
    should: 'have a properly formatted address',
    actual: verifyBplAddress(delegate.address),
    expected: true,
  })
  /*
  assert({
    given: 'a generated delegate',
    should: 'have a properly formatted private key in key object',
    actual: privateKeyVerify(Buffer.from(delegate.keys.privateKey)),
    expected: true,
  })
  */
  assert({
    given: 'a generated delegate',
    should: 'have a generated username',
    actual: delegate.username,
    expected: 'genesis_1',
  })
})

describe('delegate factory, when creating delegates from a file', async assert => {
  const createDelegate = delegateFactory(
    resolve(__dirname, 'two-passphrases.txt'),
    resolve(__dirname, 'user-key-map.txt')
  )
  const delegate = createDelegate()

  assert({
    given: 'a generated delegate',
    should: 'use the first passphrase from the file',
    actual: delegate,
    expected: {
      address: 'BC4Jgv5SMwdwEZPYcnHcLvNxxKtKDEkSSN',
      passphrase: 'undo demand funny tower sheriff same lawn vacant reason rural total despair',
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
            username: 'test_user_1',
            publicKey: "03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a",
          }
        },
        signature: '304402207bfccddcc7a89bcca0592c9d33b2546c8f1ee0d7b841fdadc890bb32a25640f602205de00fcc738ad55ea9d8eb00252e6b0e0fd93ad71cd7c5d54f87c9e58407ff1f',
        senderId: 'BC4Jgv5SMwdwEZPYcnHcLvNxxKtKDEkSSN',
        id: '66e1e46f5cc9992b51578537a4166d795174ed5b7c95f86b3c70779118f35227'
      },
      keys: {
        compressed: true,
        privateKey: 'd25f628c4be9edfe1277cbc301e1d96aea822bdea750cfc2deb74fcf4ecde35c',
        publicKey: '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a',
      },
      username: 'test_user_1',
    }
  })

  const delegate2 = createDelegate()

  assert({
    given: 'a second generated delegate',
    should: 'have the second passphrase from the file',
    actual: delegate2,
    expected: {
      address: 'B5qr7KqwXj987ufS49yzE8tTkvmcwbSXc2',
      passphrase: 'siege swear august ordinary dynamic say junior icon cube acoustic aisle stone',
      transaction: {
        timestamp: 0,
        version: 1,
        type: 2,
        fee: 0,
        amount: 0,
        recipientId: null,
        senderPublicKey: '038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011',
        asset: {
          delegate: {
            username: 'test_user_2',
            publicKey: "038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011",
          }
        },
        signature: '3045022100adf7bc663d06a41d27d685555f1bde80647d40b2612d177d81ff873e99ecedf602206356b2a402f7234bfbf9bf4ba885b01741d060154cb5acf4ac26a06f42cec3db',
        senderId: 'B5qr7KqwXj987ufS49yzE8tTkvmcwbSXc2',
        id: '6a525b0d357164011a7dac9fdda8193042057c903ebc7b2d1e1614ae6e5979cf'
      },
      keys: {
        compressed: true,
        privateKey: '206e5dde19d60c6e151c38a232cb1941bedf6df89882941bc5f28a3cd49e75ed',
        publicKey: '038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011',
      },
      username: 'test_user_2',
    }
  })
})

