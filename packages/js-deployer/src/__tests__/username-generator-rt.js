const { resolve } = require('path')
const { describe } = require('riteway')

const generateUsername = require('../username-generator')

describe('username generator', async assert => {
  const getNextUsername = generateUsername()

  assert({
    given: 'when supplied with an object',
    should: 'return an object with the same properties and an additional username',
    actual: getNextUsername({
      keys: {
        publicKey: 'bye',
      },
    }),
    expected: {
      keys: {
        publicKey: 'bye',
      },
      username: 'genesis_1'
    },
  })

  assert({
    given: 'when supplied with a different object',
    should: 'return an object with the same properties and a different username',
    actual: getNextUsername({
      keys: {
        publicKey: 'hi'
      },
    }),
    expected: {
      keys: {
        publicKey: 'hi'
      },
      username: 'genesis_2',
    },
  })
})

describe('username generator with a supplied filename', async assert => {
  const getNextUsername = generateUsername(resolve(__dirname, 'user-key-map.txt'))

  assert({
    given: 'when supplied with an object with a public key that is in the map file',
    should: 'return an object with the same properties and the matching username',
    actual: getNextUsername({
      keys: {
        publicKey: '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a',
      },
    }),
    expected: {
      keys: {
        publicKey: '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a',
      },
      username: 'TEST_USER_1'
    },
  })

  assert({
    given: 'when supplied with a different object',
    should: 'return an object with the same properties and a different matching username',
    actual: getNextUsername({
      keys: {
        publicKey: '038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011',
      },
    }),
    expected: {
      keys: {
        publicKey: '038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011',
      },
      username: 'TEST_USER_2'
    },
  })

  assert({
    given: 'when supplied with a different object without a matching public key',
    should: 'return an object with the same properties and a different matching username',
    actual: getNextUsername({
      keys: {
        publicKey: 'yo',
      },
    }),
    expected: {
      keys: {
        publicKey: 'yo',
      },
      username: 'genesis_3'
    },
  })
})