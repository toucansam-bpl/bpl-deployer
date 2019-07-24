const { Bignum, client, crypto } = require('@arkecosystem/crypto')
const { describe } = require('riteway')

const calculateMilestones = require('../milestone-calculator')

describe('milestone calculator', async assert => {
  const currentSupply = Bignum('3000000000000000')
  const maxSupply = Bignum('5000000000000000')
  const milestones = calculateMilestones({
    currentSupply,
    gracePeriodBlockCount: Math.floor(4 * 60 * 24 * 7 / 201) * 201,
    maxSupply,
    payoutIntervals: [
      { blockCount: 1051230, reward: 400000000, },
      { blockCount: 1576845, reward: 300000000, },
      { blockCount: 3153690, reward: 200000000, },
    ],
  })

  assert({
      given: 'another grace period and max supply',
      should: 'calculate proper initial and ending reward intervals',
      actual: milestones,
      expected: [
        { height:    40201, reward: 400000000, },
        { height:  1091431, reward: 300000000, },
        { height:  2668276, reward: 200000000, },
        { height:  5821966, reward: 100000000, },
        { height: 10579033, reward:  48756219, },
        { height: 10579215, reward:  48756218, },
        { height: 10579234, reward:         0, },
      ],
  })

  assert({
      given: 'milestone calculation',
      should: 'have proper total supply',
      actual: milestones.reduce((acc, milestone) => {
        let supply = acc.supply
        for(let i = acc.height; i < milestone.height; i += 1) {
          supply = supply.plus(acc.previousReward)
        }
        return {
          height: milestone.height,
          previousReward: milestone.reward,
          supply,
        }
      }, {
        height: 0,
        previousReward: Bignum(0),
        supply: currentSupply,
      }).supply,
      expected: maxSupply,
  })
})
