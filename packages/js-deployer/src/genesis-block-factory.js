const { Bignum, crypto, } = require('@arkecosystem/crypto')
const { createHash } = require('crypto')
const { pipe } = require('ramda')

const getBlockBytes = require('./get-block-bytes')
const getBytesHash = require('./get-bytes-hash')

const sortByType = transactions =>
  [...transactions].sort((a, b) => {
    return a.type === b.type
      ? a.amount - b.amount
      : a.type - b.type
  })

const createUnsignedBlock = (genesisWallet, timestamp) => transactions =>
  transactions.reduce((block, transaction) => {
    const bytes = crypto.getBytes(transaction)
    block.payloadHash.update(bytes)
    return {
      ... block,

      payloadLength: block.payloadLength + bytes.length,
      totalAmount: transaction.amount ? block.totalAmount.plus(transaction.amount) : block.totalAmount,
      totalFee: block.totalFee.plus(transaction.fee),
    }
  }, {
    generatorPublicKey: genesisWallet.keys.publicKey.toString('hex'),
    height: 1,
    numberOfTransactions: transactions.length,
    payloadHash: createHash('sha256'),
    payloadLength: 0,
    previousBlock: null,
    reward: 0,
    timestamp,
    totalAmount: new Bignum(0),
    totalFee: new Bignum(0),
    transactions,
    version: 0,
  })

const updatePayloadHash = genesisBlock => ({
  ... genesisBlock,

  payloadHash: genesisBlock.payloadHash.digest().toString('hex'),
})

const getBlockIdFromHash = ({ block, hash }) => {
  const blockBuffer = Buffer.alloc(8)
  for (let i = 0; i < 8; i++) {
    blockBuffer[i] = hash[7 - i]
  }

  return {
    ... block,

    id: new Bignum(blockBuffer.toString('hex'), 16).toString(),
  }
}

const signBlockHash = keys => ({ block, hash }) => ({
  ... block,

  blockSignature: crypto.signHash(hash, keys),
})

const generateBlockId = pipe(
  getBlockBytes,
  getBytesHash,
  getBlockIdFromHash,
)

const signBlock = wallet => pipe(
  getBlockBytes,
  getBytesHash,
  signBlockHash(wallet.keys),
)

module.exports = ({ genesisWallet, timestamp, }) => pipe(
  sortByType,
  createUnsignedBlock(genesisWallet, timestamp),
  updatePayloadHash,
  generateBlockId,
  signBlock(genesisWallet),
)
