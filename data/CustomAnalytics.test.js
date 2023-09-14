import { describe, it, expect, chai } from 'vitest'
import { spy } from 'sinon'
import sinonChai from 'sinon-chai-es'
import { Collection } from 'nextbone'
import { CustomAnalytics } from './CustomAnalytics.js'

chai.use(sinonChai)

const fixtureData = [
  ['name', 'gender', 'colour', 'birthday', 'trials', 'successes'],
  ['Nick', 'male', 'blue', '1982-11-07', 103, 12],
  ['Jane', 'female', 'red', '1982-11-08', 95, 25],
  ['John', 'male', 'blue', '1982-12-08', 112, 30],
  ['Carol', 'female', 'yellow', '1983-12-08', 102, 12],
]

class SampleAnalytics extends CustomAnalytics {
  // eslint-disable-next-line class-methods-use-this
  getData() {
    return fixtureData
  }
}

class WithStatesAnalytics extends CustomAnalytics {
  static states = ['collection']

  getData() {
    return this.collection.toJSON()
  }
}

describe('CustomAnalytics', () => {
  it('should call getData when calling update', async () => {
    const analytics = new CustomAnalytics()
    const getDataSpy = spy(analytics, 'getData')
    await analytics.update()
    expect(getDataSpy).to.be.calledOnce
  })

  it('should batch execution of update implementation', async () => {
    const analytics = new CustomAnalytics()
    const getDataSpy = spy(analytics, 'getData')
    await Promise.all([analytics.update(), analytics.update()])
    expect(getDataSpy).to.be.calledOnce
  })

  it('should allow to execute update implementation more than once', async () => {
    const analytics = new CustomAnalytics()
    const getDataSpy = spy(analytics, 'getData')
    await analytics.update()
    await analytics.update()
    expect(getDataSpy).to.be.calledTwice
  })

  describe('with state', () => {
    it('should call update when setting state', () => {
      const analytics = new WithStatesAnalytics()
      const updateSpy = spy(analytics, 'update')
      analytics.collection = new Collection()
      expect(updateSpy).to.be.calledOnce
    })
  })

  describe('getRecords', () => {
    it('should return records that matches rowKey', async () => {
      const analytics = new SampleAnalytics()
      await analytics.update()
      const data = analytics.getPivotData({ row: 'colour', col: 'gender' })
      const records = data.getRecords(['blue'], [])
      expect(records.length).to.equal(2)
      expect(records[0]).to.eql({
        name: 'Nick',
        gender: 'male',
        colour: 'blue',
        birthday: '1982-11-07',
        trials: 103,
        successes: 12,
      })
      expect(records[1]).to.eql({
        name: 'John',
        gender: 'male',
        colour: 'blue',
        birthday: '1982-12-08',
        trials: 112,
        successes: 30,
      })
    })

    it('should return records that matches colKey', async () => {
      const analytics = new SampleAnalytics()
      await analytics.update()
      const data = analytics.getPivotData({ row: 'colour', col: 'gender' })
      const records = data.getRecords([], ['female'])
      expect(records.length).to.equal(2)
      expect(records[0]).to.eql({
        name: 'Jane',
        gender: 'female',
        colour: 'red',
        birthday: '1982-11-08',
        trials: 95,
        successes: 25,
      })
      expect(records[1]).to.eql({
        name: 'Carol',
        gender: 'female',
        colour: 'yellow',
        birthday: '1983-12-08',
        trials: 102,
        successes: 12,
      })
    })

    it('should return records that matches rowKey and colKey', async () => {
      const analytics = new SampleAnalytics()
      await analytics.update()
      const data = analytics.getPivotData({ row: 'colour', col: 'gender' })
      const records = data.getRecords(['yellow'], ['female'])
      expect(records.length).to.equal(1)
      expect(records[0]).to.eql({
        name: 'Carol',
        gender: 'female',
        colour: 'yellow',
        birthday: '1983-12-08',
        trials: 102,
        successes: 12,
      })
    })
  })
})
