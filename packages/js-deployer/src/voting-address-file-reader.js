const { readFileSync } = require('fs')

module.exports = filePath =>
    readFileSync(filePath).toString()
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim())
