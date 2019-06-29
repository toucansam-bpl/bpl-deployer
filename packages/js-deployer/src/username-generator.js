const readMappingFile = require('./mapping-file-reader')

module.exports = mapFilePath => {
  const keyMap = !!mapFilePath ? readMappingFile(mapFilePath) : {}
  let seq = 0

  return obj => {
    seq += 1
    const username = keyMap[obj.keys.publicKey] || `seed_node_${seq}`

    return {
      ... obj,

      username,
    }
  }
}
