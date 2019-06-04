const { createHash } = require('crypto')

module.exports = ({ block, bytes }) => ({
  block,
  hash: createHash('sha256')
    .update(bytes)
    .digest(),
})