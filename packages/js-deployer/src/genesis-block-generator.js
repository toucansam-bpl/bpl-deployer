const { Bignum, client, crypto, } = require('@arkecosystem/crypto')

const generateSequence = require('./sequence-generator')

const readAddressBalanceFile = require('./address-balance-file-reader')
const delegateFactory = require('./delegate-factory')
const generatePassphrase = require('./passphrase-generator')
const genesisBlockFactory = require('./genesis-block-factory')
const readVotingAddressFile = require('./voting-address-file-reader')
const walletFactory = require('./wallet-factory')

module.exports = ({ delegateCount, passphraseFilePath, keyMapFilePath, addressBalanceFilePath, votingAddressFilePath, }) => {
  const createDelegate = delegateFactory(passphraseFilePath, keyMapFilePath)
  const passphrases = generatePassphrase()
  const createWallet = walletFactory(() => ({ passphrase: passphrases.next().value }))

  const genesisWallet = createWallet()
  const premineWallet = createWallet()
  const balanceTransfers = readAddressBalanceFile(addressBalanceFilePath)
    .map(createTransferTransaction(premineWallet))

  const voteRefunds = readVotingAddressFile(votingAddressFilePath)
    .map(createVoteRefundTransaction(premineWallet))

  const delegates = generateSequence(delegateCount).map(createDelegate)
  const createGenesisBlock = genesisBlockFactory({
    genesisWallet,
    timestamp: 0,
  })

  const allTransactions = delegates.map(d => d.transaction)
    .concat(balanceTransfers)
    .concat(voteRefunds)

  return {
    delegatePassphrases: delegates.map(d => d.passphrase),
    genesisBlock: createGenesisBlock(allTransactions),
    genesisWallet,
  }
}

const createTransferTransaction = senderWallet => ({ address, balance }) => {
  const { data } = client
    .getBuilder()
    .transfer()
    .recipientId(address)
    .amount(balance)
    .vendorField('v2 balance migration')
    .network(25)
    .sign(senderWallet.passphrase)

  return formatGenesisTransaction(data, senderWallet)
}

const createVoteRefundTransaction = senderWallet => address => {
  const { data } = client
    .getBuilder()
    .transfer()
    .recipientId(address)
    .amount(Bignum(1))
    .vendorField('v2 vote refund')
    .network(25)
    .sign(senderWallet.passphrase)

  return formatGenesisTransaction(data, senderWallet)
}

const formatGenesisTransaction = (transaction, wallet) => {
  Object.assign(transaction, {
    fee: Bignum(0),
    timestamp: 0,
    senderId: wallet.address,
  })
  transaction.signature = crypto.sign(transaction, wallet.keys)
  transaction.id = crypto.getId(transaction)

  return transaction
}

/*
SELECT a.address, v.votes
  FROM mem_accounts a
  JOIN (
    SELECT "senderPublicKey", count(1) as votes
      FROM transactions
     WHERE type = 3
     GROUP BY "senderPublicKey"
     HAVING count(1) % 2 = 1
  ) v
    ON a."publicKey" = v."senderPublicKey";
*/
