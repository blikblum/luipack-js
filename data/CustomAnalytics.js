import { Collection, Events, Model, waitLoading } from 'nextbone'
import { PivotData } from 'pivot-utils'
import { defaultsDeep } from 'lodash-es'
import { getChartDatasets } from './analyticsUtils.js'

class PivotDataEx extends PivotData {
  filter(record) {
    for (const k in this.props.valueFilter) {
      if (!(record[k] in this.props.valueFilter[k])) {
        return false
      }
    }
    return true
  }

  getRecords(rowKey, colKey) {
    const result = []
    PivotData.forEachRecord(this.props.data, this.props.derivedAttributes, (record) => {
      if (this.filter(record)) {
        let accept = true
        if (rowKey.length > 0) {
          accept = this.props.rows.every((attr, i) => record[attr] === rowKey[i])
        }

        if (accept && colKey.length > 0) {
          accept = this.props.cols.every((attr, i) => record[attr] === colKey[i])
        }

        if (accept) {
          result.push(record)
        }
      }
    })

    return result
  }
}

class ChartElementClickEvent extends Event {
  value

  constructor(options = {}) {
    super('chart-element-click', { bubbles: true })
    Object.assign(this, options)
  }
}

const defaultNameFormatters = {}

const defaultChartOptions = {
  type: 'line',
  data: { labels: [] },
  options: {
    onClick: (event, elements) => {
      const dataset = event.chart.data.datasets[0]
      const element = elements[0]
      if (element) {
        const colKey = dataset.colKeys[element.index]
        if (colKey) {
          const colName = event.chart.data.labels[element.index]
          event.chart.canvas.dispatchEvent(new ChartElementClickEvent({ colKey, colName }))
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      colorschemes: {
        scheme: 'tableau.Tableau10',
      },
    },
    scales: {
      x: {
        offset: true,
      },
    },
  },
}

const defaultLineChartOptions = {
  options: {
    devicePixelRatio: 1,
    scales: {
      x: {
        offset: true,
      },
    },
  },
}

function getPresetOptions(preset, options) {
  if (preset && options) {
    return options[preset]
  }
  return undefined
}

function getCacheKey({ row, col, preset, options }) {
  return `${row}${col}${preset}${JSON.stringify(options)}`
}

// todo: add concept of view that holds differente pivot / chart options
export class CustomAnalytics extends Model {
  static states = []

  constructor(data, options = {}) {
    super(data, options)
    this._tabularDataCache = new Map()
    this._pivotDataCache = new Map()
    const { states } = this.constructor
    if (Array.isArray(states)) {
      states.forEach((state) => {
        const stateKey = Symbol(state)
        Object.defineProperty(this, state, {
          get() {
            return this[stateKey]
          },
          set(value) {
            const oldValue = this[stateKey]
            if (oldValue && oldValue instanceof Events) {
              this.stopListening(oldValue)
            }
            this[stateKey] = value
            if (value) {
              // todo: handle Model
              if (value instanceof Collection) {
                this.listenTo(value, 'update reset', this.update)
              }
              this.update()
            }
          },
        })
        const initialValue = options[state]
        if (initialValue !== undefined) {
          this[state] = initialValue
        }
      })
    }
  }

  defaultRow

  defaultCol

  updating = false

  _nameFormatters

  _getNameFormatters() {
    if (!this._nameFormatters) {
      this._nameFormatters = defaultsDeep({}, this.nameFormatters, defaultNameFormatters)
    }
    return this._nameFormatters
  }

  _areStatesDefined() {
    const { states = [] } = this.constructor

    return states.every((state) => this[state] !== undefined)
  }

  async _waitStatesLoading() {
    const { states = [] } = this.constructor

    await Promise.all(states.map((state) => waitLoading(this[state] || {})))
  }

  // to be overriden
  // eslint-disable-next-line class-methods-use-this
  async getData() {
    return []
  }

  clearCache() {
    this._tabularDataCache.clear()
    this._pivotDataCache.clear()
  }

  async update() {
    if (!this._areStatesDefined()) return
    if (!this.updating) {
      // by default batch calls
      this.updating = true
      try {
        await this._waitStatesLoading()
      } finally {
        this.updating = false
      }

      const data = await this.getData()

      // todo: some filtering example: startDate / endDate
      this.clearCache()

      // manually trigger change event. Avoids comparing data arrays which can be large
      this.attributes.data = data
      this.trigger('change:data', this)
      this.trigger('change', this)
    }
  }

  getPivotOptions(pivotOptions) {
    const { defaultCol, defaultRow } = this
    const { row = defaultRow, col = defaultCol, options, preset } = pivotOptions

    const rows = row ? [row] : []
    const cols = col ? [col] : []

    const result = defaultsDeep(
      {},
      options,
      getPresetOptions(preset, this.pivotPresets),
      this.pivotOptions
    )

    if (!Array.isArray(result.rows)) {
      result.rows = rows
    }

    if (!Array.isArray(result.cols)) {
      result.cols = cols
    }

    return result
  }

  getPivotData(pivotOptions = {}) {
    const cacheKey = getCacheKey(pivotOptions)
    if (this._pivotDataCache.has(cacheKey)) {
      return this._pivotDataCache.get(cacheKey)
    }

    const options = this.getPivotOptions(pivotOptions)

    const pivotData = new PivotDataEx({
      ...options,
      data: this.get('data') || [],
    })

    this._pivotDataCache.set(cacheKey, pivotData)

    return pivotData
  }

  getTabularData(tabularOptions = {}) {
    const cacheKey = getCacheKey(tabularOptions)
    if (this._tabularDataCache.has(cacheKey)) {
      return this._tabularDataCache.get(cacheKey)
    }

    const result = {
      colKeys: [],
      colNames: [],
      colTotals: [],
      rowKeys: [],
      rowNames: [],
      rowTotals: [],
      rows: [],
      allTotal: {},
    }

    const { data } = this.pick('data')
    if (!data || !data.length) {
      return result
    }

    const pivotData = this.getPivotData(tabularOptions)

    // todo handle multidimensional pivot
    const row = pivotData.props.rows[0]
    const col = pivotData.props.cols[0]

    const rowKeys = pivotData.getRowKeys()
    // todo: proper pagination
    // const colKeys = pivotData.getColKeys().slice(-30)
    const colKeys = pivotData.getColKeys()

    if (!rowKeys.length && !colKeys.length) {
      return result
    }

    const nameFormatters = this._getNameFormatters()

    const colFormatter = nameFormatters[col] || ((v) => v)
    const rowFormatter = nameFormatters[row] || ((v) => v)

    result.colKeys = colKeys
    result.colNames = colKeys.map(([key]) => colFormatter(key, this))
    result.colTotals = colKeys.map((keys) => {
      const agg = pivotData.getAggregator([], keys)
      return agg.value()
    })

    result.rowKeys = rowKeys
    result.rowNames = rowKeys.map(([key]) => rowFormatter(key, this))
    result.rowTotals = rowKeys.map((keys) => {
      const agg = pivotData.getAggregator(keys, [])
      return agg.value()
    })

    for (const rowKey of rowKeys) {
      const rowValues = []
      result.rows.push(rowValues)
      for (const colKey of colKeys) {
        const agg = pivotData.getAggregator(rowKey, colKey)
        rowValues.push(agg.value())
      }
    }

    result.allTotal = pivotData.allTotal.value()

    this._tabularDataCache.set(cacheKey, result)

    return result
  }

  getChartOptions({ preset } = {}) {
    const computedOptions = defaultsDeep(
      {},
      getPresetOptions(preset, this.chartPresets),
      this.chartOptions,
      defaultChartOptions
    )
    if (computedOptions.type === 'line') {
      defaultsDeep(computedOptions, defaultLineChartOptions)
    }
    return computedOptions
  }

  getChartData(chartDataOptions) {
    // todo: add a way to select what data is displayed
    // currently is necessary to pass a valueFilter creating duplicate pivot data
    // by implementing a mechanism to select data here can reuse cached tabular/pivot data and unify getChartData
    const tabularData = this.getTabularData(chartDataOptions)
    const { rowKeys, colKeys, colNames, rowNames } = tabularData
    const { transform, datasetTransform, includeTotal } = chartDataOptions
    const seriesKey = !colKeys.length ? 'row' : 'col'
    const labels = seriesKey === 'col' ? colNames : rowNames

    const datasets = getChartDatasets(tabularData, { transform, includeTotal, datasetTransform })

    return { datasets, labels }
  }

  getPivotRecords(pivotData) {
    // todo: return pivot records applying filter and formatters
  }
}

export function registerNameFormatters(nameFormatters) {
  Object.assign(defaultNameFormatters, nameFormatters)
}
