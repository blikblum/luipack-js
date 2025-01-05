import $ from 'jquery'
import { Collection } from 'nextbone'
import DataTable from 'datatables.net'

import { Component, html } from './light-component.js'

/**
 * @import {Model} from 'nextbone'
 */

class RowEvent extends Event {
  constructor(name, props = {}) {
    super(name, { bubbles: true })
    Object.assign(this, props)
  }
}

export class DTDataAdapter {
  static test() {
    return true
  }

  constructor(value) {
    this.value = value
  }

  getData() {
    const value = this.value
    return Array.isArray(value) ? value : []
  }

  observe(cb) {
    cb()
  }

  getRowId(rowData) {
    return rowData.DT_RowId
  }

  getRowEventProps(rowData) {
    return { data: rowData }
  }
}

/**
 * @param {object} changes
 * @param {Model[]} changes.added
 * @param {Model[]} changes.merged
 * @param {Model[]} changes.removed
 */
function mapCollectionChanges(changes) {
  const added = changes.added.map((model) => ({ ...model.attributes, DT_RowId: model.cid }))
  const changed = changes.merged.map((model) => ({ ...model.attributes, DT_RowId: model.cid }))
  const removed = changes.removed.map((model) => ({ ...model.attributes, DT_RowId: model.cid }))
  return { added, changed, removed }
}

export class DTCollectionAdapter extends DTDataAdapter {
  static test(value) {
    return value instanceof Collection
  }

  getData() {
    return this.value.models.map((model) => ({ ...model.attributes, DT_RowId: model.cid }))
  }

  observe(cb) {
    const value = this.value
    const listener = (_, { changes }) => {
      const cbArg = changes ? mapCollectionChanges(changes) : undefined
      cb(cbArg)
    }
    cb()
    value.on('update reset', listener)
    return () => value.off('update reset', listener)
  }

  getRowId(rowData) {
    return rowData.DT_RowId
  }

  getRowEventProps(rowData) {
    const model = this.value.get(rowData.DT_RowId)
    return { model, data: { ...model.attributes } }
  }
}

const dataAdapters = [DTCollectionAdapter]

export class DTTable extends Component {
  static properties = {
    data: { attribute: false },
  }

  /**
   * @type {DataTable}
   */
  _dataTable

  _dataAdapter

  _dataUnobserve

  config

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this._dataUnobserve) {
      this._dataUnobserve()
    }
  }

  willUpdate(changed) {
    if (changed.has('data')) {
      if (this._dataUnobserve) {
        this._dataUnobserve()
        this._dataUnobserve = undefined
      }
      const Adapter = dataAdapters.find((adapter) => adapter.test(this.data)) || DTDataAdapter
      const adapter = (this._dataAdapter = new Adapter(this.data))
      this._dataUnobserve = adapter.observe((changes) => this.updateData(changes))
    }
  }

  firstUpdated() {
    const data = this.getTableData()
    const table = this.querySelector('table')

    $(table).on('init.dt', (e) => {
      const parent = this.parentElement
      const filters = parent.querySelector('dt-table-filters')
      if (filters) {
        filters.api = e.dt
        filters.initFilters()
      }
    })

    this._dataTable = new DataTable(table, { ...this.config, data })
    $(table).on('click', '[data-action]', (e) => {
      const data = this._dataTable.row(e.target.closest('tr')).data()
      if (this._dataAdapter) {
        const props = this._dataAdapter.getRowEventProps(data)
        this.dispatchEvent(new RowEvent(e.target.dataset.action, props))
      }
    })
  }

  updateData(changes) {
    const { _dataTable, _dataAdapter } = this
    if (!_dataTable) {
      return
    }
    if (changes) {
      if (changes.added && changes.added.length) {
        _dataTable.rows.add(changes.added)
      }
      if (changes.changed) {
        changes.changed.forEach((data) => {
          const row = _dataTable.row(`#${_dataAdapter.getRowId(data)}`)
          row.data(data)
        })
      }
      if (changes.removed) {
        changes.removed.forEach((data) => {
          _dataTable.row(`#${_dataAdapter.getRowId(data)}`).remove()
        })
      }
    } else {
      const tableData = this.getTableData()
      _dataTable.clear().rows.add(tableData)
    }

    _dataTable.draw()

    const searchPanes = _dataTable.searchPanes
    if (searchPanes) {
      searchPanes.rebuildPane(false, true)
    }
  }

  getTableData() {
    return this._dataAdapter ? this._dataAdapter.getData() : []
  }

  render() {
    return html`<table class="table display no-wrap w-100"></table>`
  }
}

customElements.define('dt-table', DTTable)
