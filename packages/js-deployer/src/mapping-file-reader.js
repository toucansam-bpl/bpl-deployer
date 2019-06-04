const { readFileSync } = require('fs')

module.exports = filePath =>
  readFileSync(filePath).toString().split('\n').reduce((all, line) => {
    const parts = line.split('|')
    if (parts.length === 2) {
      all[parts[1].trim()] = parts[0].trim().toLowerCase()
    }
    return all
  }, {})
