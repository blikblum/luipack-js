import { Component, classMap, styleMap, property, html } from '../light-component.js'
import { state, event } from 'nextbone'
import { isEqual, isPlainObject } from 'lodash-es'

class DataTableActionEvent extends Event {
  model

  constructor(eventName, model) {
    super(eventName, { bubbles: true })
    this.model = model
  }
}

class DataTable extends Component {
  @property({ attribute: false })
  fields = []

  @property({ attribute: false })
  selected

  @property({ attribute: false })
  editing

  @property({ attribute: 'empty-message' })
  emptyMessage

  @state
  collection

  _params = {}

  set params(value) {
    // todo use a proxy here
    if (isPlainObject(value) && !isEqual(value, this._params)) {
      this._params = { ...value }
      this.requestUpdate()
    }
  }

  // css options
  @property({ type: Boolean })
  dark

  @property({ type: Boolean })
  hover

  @property({ type: Boolean })
  bordered

  @property({ type: Boolean })
  borderless

  @property({ type: Boolean })
  responsive

  @property({ type: Boolean })
  sm

  @property({ type: Boolean })
  striped

  @property({ type: Boolean, attribute: 'thead-dark' })
  theadDark

  @property({ type: Boolean, attribute: 'thead-light' })
  theadLight

  renderEditor

  rowClasses

  @event('click', 'tr.item-row')
  onRowClick(e) {
    this.dispatchEvent(
      new CustomEvent('row-select', {
        bubbles: true,
        detail: { model: e.selectorTarget.model },
      })
    )
  }

  @event('click', '[data-toggle="editor"]')
  onToggleEditorClick(e) {
    const rowEl = e.selectorTarget.closest('.item-row')
    const rowModel = rowEl ? rowEl.model : undefined
    this.editing = rowModel
  }

  @event('click', 'tr.item-row [data-action]')
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
