const { Bignum, client, crypto } = require('@arkecosystem/crypto')

const fromBig = big => big.div(100000000)
const toBig = big => big.times(100000000)

module.exports = ({
  currentSupply,
  gracePeriodBlockCount,
  maxSupply,
  payoutIntervals,
}) => {
  const payouts = payoutIntervals.reduce((acc, interval) => {
    return {
      nextIntervalHeight: acc.nextIntervalHeight + interval.blockCount,
      remainingSupply: acc.remainingSupply.minus(Bignum(interval.reward).times(interval.blockCount)),
      milestones: [
        ... acc.milestones,
        {
          height: acc.nextIntervalHeight,
          reward: interval.reward,
        }
      ]
    }
  }, {
    nextIntervalHeight: gracePeriodBlockCount + 1,
    milestones: [],
    remainingSupply: maxSupply.minus(currentSupply),
  })

  const fixed1RewardBlocks = Math.floor(fromBig(payouts.remainingSupply).toNumber() / 201) * 201
  const supplyAfter1FixedRewards = payouts.remainingSupply.minus(toBig(Bignum(fixed1RewardBlocks)))

  const luckyBlockCount = supplyAfter1FixedRewards.mod(201).toNumber()
  const remainingReward = supplyAfter1FixedRewards.idiv(201).toNumber()

  return [
    ... payouts.milestones,

    { height: payouts.nextIntervalHeight, reward: 100000000, },
    { height: payouts.nextIntervalHeight + fixed1RewardBlocks, reward: remainingReward + 1, },
    { height: payouts.nextIntervalHeight + fixed1RewardBlocks + luckyBlockCount, reward: remainingReward, },
    { height: payouts.nextIntervalHeight + fixed1RewardBlocks + 201, reward: 0, },
  ]
}
