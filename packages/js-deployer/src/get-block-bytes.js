const ByteBuffer = require('bytebuffer')

module.exports = block => {
  const size = 4 + 4 + 4 + 8 + 4 + 4 + 8 + 8 + 4 + 4 + 4 + 32 + 32 + 64

  try {
    const byteBuffer = new ByteBuffer(size, true)
    byteBuffer.writeInt(block.version)
    byteBuffer.writeInt(block.timestamp)
    byteBuffer.writeInt(block.height)

    if (block.previousBlock) {
      const previousBlock = Buffer.from(
        new Bignum(block.previousBlock).toString(16),
        'hex',
      )

      for (let i = 0; i < 8; i++) {
        byteBuffer.writeByte(previousBlock[i])
      }
    } else {
      for (let i = 0; i < 8; i++) {
        byteBuffer.writeByte(0)
      }
    }

    byteBuffer.writeInt(block.numberOfTransactions)
    byteBuffer.writeLong(block.totalAmount.toString())
    byteBuffer.writeLong(block.totalFee.toString())
    byteBuffer.writeLong(block.reward)

    byteBuffer.writeInt(block.payloadLength)

    const payloadHashBuffer = Buffer.from(block.payloadHash, 'hex')
    for (let i = 0; i < payloadHashBuffer.length; i++) {
      byteBuffer.writeByte(payloadHashBuffer[i])
    }

    const generatorPublicKeyBuffer = Buffer.from(
      block.generatorPublicKey,
      'hex',
    )
    for (let i = 0; i < generatorPublicKeyBuffer.length; i++) {
      byteBuffer.writeByte(generatorPublicKeyBuffer[i])
    }

    if (block.blockSignature) {
      const blockSignatureBuffer = Buffer.from(block.blockSignature, 'hex')
      for (let i = 0; i < blockSignatureBuffer.length; i++) {
        byteBuffer.writeByte(blockSignatureBuffer[i])
      }
    }

    byteBuffer.flip()

    return {
      block,
      bytes: byteBuffer.toBuffer(),
    }
  } catch (error) {
    throw error
  }
}