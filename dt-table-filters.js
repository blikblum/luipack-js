import $ from 'jquery'

/**
 * @param {ApiColumnMethods} column
 * @param {{sName: string}} columnOptions
 * @param {NodeListOf<HTMLInputElement | HTMLSelectElement>} inputs
 * @returns {(HTMLInputElement | HTMLSelectElement)[]}
 */
function getColumnInputs(column, columnOptions, inputs) {
  const result = []
  for (const input of inputs) {
    const field = input.dataset.field
    if (field && field === column.dataSrc()) {
      result.push(input)
      continue
    }

    const name = input.dataset.name
    if (name && name === columnOptions.sName) {
      result.push(input)
    }
  }

  return result
}

/**
 * @import {Api, ApiColumnMethods} from 'datatables.net'
 */

export class DtTableFilters extends HTMLElement {
  /**
   * @type {Api}
   */
  api

  /**
   * @param {HTMLSelectElement} select
   * @param {ApiColumnMethods} column
   */
  initSelect(select, column) {
    // todo: extract into a function that can be overriden
    // expose registerSelectFilter
    // implement a TomSelect filter in a separated module
    const isMultiple = select.multiple

    select.add(new Option(''))

    // Apply listener for user change in value
    select.addEventListener('change', function () {
      if (isMultiple) {
        // inspired by https://jsfiddle.net/jvretamero/bv6g0r64/
        // other examples https://stackoverflow.com/questions/49846701/datatables-with-column-filter-dropdowns-and-multiple-checkbox-selection
        const values = Array.from(select.selectedOptions)
          .map((option) => option.value)
          .map((value) => $.fn.dataTable.util.escapeRegex(value))
          .filter(Boolean)

        column.search(values.length ? `^(${values.join('|')})$` : '', true, false).draw()
        return
      } else {
        column.search(select.value, { exact: true }).draw()
      }
    })

    // Add list of options
    column
      .data()
      .unique()
      .sort()
      .each(function (d) {
        if (d) {
          select.add(new Option(d))
        }
      })
  }

  /**
   * @param {HTMLInputElement} input
   * @param {ApiColumnMethods} column
   */
  initInput(input, column) {
    input.addEventListener('keyup', () => {
      const value = input.value.trim()
      if (column.search() !== value) {
        column.search(value).draw()
      }
    })
  }

  initFilters() {
    const inputs = this.querySelectorAll('input, select')

    const settings = this.api.settings()[0]

    const self = this

    this.api.columns().every(function () {
      const column = this
      const columnOptions = settings.aoColumns[column.index()]

      const columnInputs = getColumnInputs(column, columnOptions, inputs)

      for (const input of columnInputs) {
        if (input.tagName === 'SELECT') {
          self.initSelect(/** @type {HTMLSelectElement} */ (input), column)
        } else if (input.tagName === 'INPUT') {
          self.initInput(/** @type {HTMLInputElement} */ (input), column)
        }
      }
    })
  }
}

customElements.define('dt-table-filters', DtTableFilters)
