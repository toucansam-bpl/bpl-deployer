const { resolve } = require('path')
const { describe } = require('riteway')

const readMappingFile = require('../mapping-file-reader')

describe('mapping file reader', async assert => {
  assert({
    given: 'when reading a file',
    should: 'return the file as a string',
    actual: readMappingFile(resolve(__dirname, 'user-key-map.txt')),
    expected: {
      '03af35b6ea06b9c4cdb426bcd685feb097103aae87d645ceaf66eee9578cbd2f4a': 'test_user_1',
      '038aca101b5615e3495bdfbda084cc5f0c6ccbc8345e097db5bb649c827e0ae011': 'test_user_2',
      '024fabdf72a2147a0f08da3e71584f868e0f0356600ee273774d0aff475d071c': 'test_user_3',
    }
  })
})
