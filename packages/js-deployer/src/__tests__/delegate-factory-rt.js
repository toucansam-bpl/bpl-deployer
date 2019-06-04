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
            username: 'TEST_USER_1',
            publicKey: "03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a",
          }
        },
        signature: '3044022030b308bee0869c538a547d5ee1985087e021b884e0b744e15f4ebe3ecfb036a102207acf9a1b5119ab9c5c21d6ddc06eac4a7d021d85eb3ebf193016eb79df876a32',
        senderId: 'BC4Jgv5SMwdwEZPYcnHcLvNxxKtKDEkSSN',
        id: '89cd805338f2a60d91ed7b7bf3dce7d9571b7af3c74df4c43de4cbe87015dbce'
      },
      keys: {
        compressed: true,
        privateKey: 'd25f628c4be9edfe1277cbc301e1d96aea822bdea750cfc2deb74fcf4ecde35c',
        publicKey: '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a',
      },
      username: 'TEST_USER_1',
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
            username: 'TEST_USER_2',
            publicKey: "038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011",
          }
        },
        signature: '3045022100a2f3c0c4b2f6acb1072ea26418b0de2cddb62467d8045fbe8916b7a5fc684039022053e66c8bcf9c5ab454407d2fedbab147c36df4aec7ef279342c25f92f2d59baa',
        senderId: 'B5qr7KqwXj987ufS49yzE8tTkvmcwbSXc2',
        id: '16a0ac174b8da8156b079df78612cc79c4d215a3b94a14ccfeb764e0cc8db8f8'
      },
      keys: {
        compressed: true,
        privateKey: '206e5dde19d60c6e151c38a232cb1941bedf6df89882941bc5f28a3cd49e75ed',
        publicKey: '038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011',
      },
      username: 'TEST_USER_2',
    }
  })
})

