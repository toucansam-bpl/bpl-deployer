const { Client } = require('pg')
const client = new Client()


module.exports = () =>
    new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const delegateRegistrationRefundAddresses = await runAddressQuery(delegateRegistrationRefundAddressQuery)
            const secondPassphraseRefundAddresses = await runAddressQuery(secondPassphraseRefundAddressQuery)
            const voteRefundAddresses = await runAddressQuery(voteRefundAddressQuery)
            resolve({
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

const runAddressQuery = queryText =>
    async () => new Promise(async (resolve, reject) => {
        try {
            const result = await client.query(queryText)
            resolve(result.rows.map(r => r.address))
        }
        catch (ex) {
            reject(ex)
        }
    })

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

