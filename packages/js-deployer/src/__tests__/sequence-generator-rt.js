const { describe } = require('riteway')

const generateSequence = require('../sequence-generator')

describe('sequence generator', async assert => {
  assert({
    given: 'a 3 item sequence is requested',
    should: 'generate the proper sequence',
    actual: generateSequence(3),
    expected: [1, 2, 3],
  })

  assert({
    given: 'a 5 item sequence is requested',
    should: 'generate the proper sequence',
    actual: generateSequence(5),
    expected: [1, 2, 3, 4, 5],
  })
})
