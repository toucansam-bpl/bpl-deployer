const { Bignum, } = require('@arkecosystem/crypto')
const { Client } = require('pg')
const { curry } = require('ramda')

const client = new Client()


module.exports = () =>
    new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const addressBalances = await runAddressBalanceQuery()
            const delegateRegistrationRefundAddresses = await runAddressQuery(delegateRegistrationRefundAddressQuery)
            const secondPassphraseRefundAddresses = await runAddressQuery(secondPassphraseRefundAddressQuery)
            const voteRefundAddresses = await runAddressQuery(voteRefundAddressQuery)
            resolve({
                addressBalances,
                delegateRegistrationRefundAddresses,
                secondPassphraseRefundAddresses,
                voteRefundAddresses,
            })
        }
        catch (err) {
            reject(err)
        }
        finally {
            await client.end()
        }
    })

const runQuery = curry(
    (transform, queryText) => new Promise(async (resolve, reject) => {
        try {
            const result = await client.query(queryText)
            resolve(result.rows.map(transform))
        }
        catch (ex) {
            reject(ex)
        }
    })
)

const runAddressQuery = runQuery(row => row.address)
const runAddressBalanceQuery = async () => runQuery(row => ({
    address: row.address,
    balance: row.balance.toString().split('.')[0],
    original: row.balance,
}), 'SELECT address, balance FROM mem_accounts;')

const voteRefundAddressQuery = `SELECT a.address, v.votes
    FROM mem_accounts a
    JOIN (
        SELECT "senderPublicKey", count(1) as votes
        FROM transactions
        WHERE type = 3
        GROUP BY "senderPublicKey"
        HAVING count(1) % 2 = 1
    ) v
        ON a."publicKey" = v."senderPublicKey"
;`

const delegateRegistrationRefundAddressQuery = `SELECT a.address
  FROM mem_accounts a
  JOIN (
    SELECT "senderPublicKey" FROM transactions WHERE type = 2 AND rawasset NOT LIKE '%BPL_MC_%'
  ) t
    ON a."publicKey" = t."senderPublicKey"
;`


const secondPassphraseRefundAddressQuery = `SELECT a.address
  FROM mem_accounts a
  JOIN (
    SELECT "senderPublicKey" FROM transactions WHERE type = 1
  ) t
    ON a."publicKey" = t."senderPublicKey"
;`

