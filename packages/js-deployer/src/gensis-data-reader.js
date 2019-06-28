const { Client } = require('pg')
const client = new Client()


module.exports = () =>
    new Promise(async (resolve, reject) => {
        try {
            await client.connect()
            const res = await client.query(voteRefundAddressQuery)
            console.log(res.rows)
            resolve({

            })
        }
        catch (err) {
            reject(err)
        }
        finally {
            await client.end()
        }
    })

const voteRefundAddressQuery = `
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
`

/*
SELECT a.address
  FROM mem_accounts a
  JOIN (
    SELECT "senderPublicKey" FROM transactions WHERE type = 2 AND rawasset NOT LIKE '%BPL_MC_%'
  ) t
    ON a."publicKey" = t."senderPublicKey"
*/

/*
SELECT a.address
  FROM mem_accounts a
  JOIN (
    SELECT "senderPublicKey" FROM transactions WHERE type = 1
  ) t
    ON a."publicKey" = t."senderPublicKey"
;
*/

