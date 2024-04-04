import { Component, classMap, styleMap, html } from '../light-component.js'
import { delegate, view } from 'nextbone'
import { isEqual, isPlainObject } from 'lodash-es'

class DataTableActionEvent extends Event {
  model

  constructor(eventName, model) {
    super(eventName, { bubbles: true })
    this.model = model
  }
}

class DataTable extends view(Component) {
  static properties = {
    fields: { attribute: false },
    selected: { attribute: false },
    editing: { attribute: false },
    emptyMessage: { type: String, attribute: 'empty-message' },
    // css options
    dark: { type: Boolean },
    hover: { type: Boolean },
    bordered: { type: Boolean },
    borderless: { type: Boolean },
    responsive: { type: Boolean },
    sm: { type: Boolean },
    striped: { type: Boolean },
    theadDark: { type: Boolean, attribute: 'thead-dark' },
    theadLight: { type: Boolean, attribute: 'thead-light' },
  }

  static states = {
    collection: {},
  }

  constructor() {
    super()
    this.fields = []
    delegate(this, 'click', 'tr.item-row', this.onRowClick)
    delegate(this, 'click', '[data-toggle="editor"]', this.onToggleEditorClick)
    delegate(this, 'click', 'tr.item-row [data-action]', this.onActionClick)
  }

  _params = {}

  set params(value) {
    // todo use a proxy here
    if (isPlainObject(value) && !isEqual(value, this._params)) {
      this._params = { ...value }
      this.requestUpdate()
    }
  }

  renderEditor

  rowClasses

  onRowClick(e) {
    this.dispatchEvent(
      new CustomEvent('row-select', {
        bubbles: true,
        detail: { model: e.selectorTarget.model },
      })
    )
  }

  onToggleEditorClick(e) {
    const rowEl = e.selectorTarget.closest('.item-row')
    const rowModel = rowEl ? rowEl.model : undefined
    this.editing = rowModel
  }

  onActionClick(e) {
    const actionEl = e.selectorTarget
    const rowEl = actionEl.closest('.item-row')
    const rowModel = rowEl ? rowEl.model : undefined

    const { action } = actionEl.dataset
    if (action) {
      this.dispatchEvent(new DataTableActionEvent(action, rowModel))
    }
  }

  showLoading() {
    if (this.collection.isLoading) {
      if (this._showLoading === undefined) {
        this._showLoading = false
        setTimeout(() => {
          this._showLoading = this.collection.isLoading || undefined
          if (this._showLoading) {
            this.requestUpdate()
          }
        }, 100)
      }
    } else {
      this._showLoading = undefined
    }
    return this._showLoading
  }

  renderBody() {
    if (this.showLoading()) {
      return html`<tr>
        <td colspan=${this.fields.length}>
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </td>
      </tr>`
    }

    if (!this.collection.length) {
      return html`<tr>
        <td colspan=${this.fields.length}>
          <div class="d-flex justify-content-center">${this.emptyMessage}</div>
        </td>
      </tr>`
    }

    const rowClassesFn = typeof this.rowClasses === 'function' ? this.rowClasses : () => ''

    return this.collection.map((model, i) => {
      if (model === this.editing && this.renderEditor) {
        return html`<tr>
          <td colspan=${this.fields.length}>${this.renderEditor(model)}</td>
        </tr>`
      }

      return html`
        <tr
          class="item-row ${rowClassesFn(model, i)} ${model === this.selected
            ? 'table-active'
            : ''}"
          .model=${model}
        >
          ${this.fields.map((field) => {
            return html`
              <td>${field.render ? field.render(model, this._params) : model.get(field.attr)}</td>
            `
          })}
        </tr>
      `
    })
  }

  render() {
    if (!this.collection) return html``

    const tableClasses = {
      'table-dark': this.dark,
      'table-hover': this.hover,
      'table-bordered': this.bordered,
      'table-borderless': this.borderless,
      'table-striped': this.striped,
      'table-sm': this.sm,
    }

    const theadClasses = {
      'thead-dark table-dark': this.theadDark,
      'thead-light table-light': this.theadLight,
    }

    return html`
      <div class=${this.responsive ? 'table-responsive' : ''}>
        <table class="table ${classMap(tableClasses)}">
          <thead class=${classMap(theadClasses)}>
            <tr>
              ${this.fields.map((field) => {
                return html` <th style=${styleMap(field.styles || {})}>${field.title}</th> `
              })}
            </tr>
          </thead>
          <tbody>
            ${this.renderBody()}
          </tbody>
        </table>
      </div>
    `
  }
}

customElements.define('data-table', DataTable)

export { DataTable }
