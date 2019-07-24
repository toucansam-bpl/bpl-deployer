const { Bignum, } = require('@arkecosystem/crypto')
const { readFileSync } = require('fs')
const { homedir } = require('os')
const { Client } = require('pg')
const { resolve } = require('path')
const { curry } = require('ramda')

const v1ConfigPath = resolve(homedir(), 'BPL-node', 'config.mainnet.json')
const v1Config = JSON.parse(readFileSync(v1ConfigPath).toString())

const client = new Client(v1Config.db)


module.exports = () =>
    new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const addressBalances = await runAddressBalanceQuery()
            const delegateRegistrationRefundAddresses = await runAddressQuery(delegateRegistrationRefundAddressQuery)
            const secondPassphraseRefundAddresses = await runAddressQuery(secondPassphraseRefundAddressQuery)
            const voteRefundAddresses = await runAddressQuery(voteRefundAddressQuery)
            resolve({
                addressBalances: addressBalances.filter(ab => ab.balance.gt(0)),
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
    balance: Bignum(row.balance.toString().split('.')[0]),
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

