import $ from 'jquery'
import { Collection } from 'nextbone'
import DataTable from 'datatables.net'

import { Component, html } from './light-component.js'

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

  getRowEventProps(rowData) {
    return { data: rowData }
  }
}

export class DTCollectionAdapter extends DTDataAdapter {
  static test(value) {
    return value instanceof Collection
  }

  getData() {
    return this.value.toJSON({ computed: true })
  }

  observe(cb) {
    const value = this.value
    value.on('update reset', cb)
    return () => value.off('update reset', cb)
  }

  getRowEventProps(rowData) {
    return { model: this.value.get(rowData.id), data: rowData }
  }
}

const dataAdapters = [DTCollectionAdapter]

class DataTablesTable extends Component {
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
      const adapter = new Adapter(this.data)
      this._dataUnobserve = adapter.observe(() => this.updateData())
      this._dataAdapter = adapter
    }
  }

  firstUpdated() {
    const data = this.getTableData()
    const table = this.querySelector('table')
    this._dataTable = new DataTable(table, { ...this.config, data })
    $(table).on('click', '[data-action]', (e) => {
      const data = this._dataTable.row(e.target.closest('tr')).data()
      if (this._dataAdapter) {
        const props = this._dataAdapter.getRowEventProps(data)
        this.dispatchEvent(new RowEvent(e.target.dataset.action, props))
      }
    })
    const searchPanesContainer = this.querySelector('.dtsp-panesContainer')
    if (searchPanesContainer) {
      searchPanesContainer.classList.add('collapse')
    }
  }

  updateData() {
    if (!this._dataTable) {
      return
    }
    const tableData = this.getTableData()
    this._dataTable.clear().rows.add(tableData).draw()
    const searchPanes = this._dataTable.searchPanes
    if (searchPanes) {
      searchPanes.rebuildPane()
    }
  }

  getTableData() {
    return this._dataAdapter ? this._dataAdapter.getData() : []
  }

  render() {
    return html`<table class="table display no-wrap w-100"></table>`
  }
}

customElements.define('dt-table', DataTablesTable)

export { DataTablesTable }
