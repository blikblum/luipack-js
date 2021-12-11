import { Component, classMap, styleMap, property, html } from '../light-component.js'
import { state, event } from 'nextbone'

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
              <span class="sr-only">Loading...</span>
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

    return this.collection.map((model) => {
      if (model === this.editing && this.renderEditor) {
        return html`<tr>
          <td colspan=${this.fields.length}>${this.renderEditor(model)}</td>
        </tr>`
      }

      return html`
        <tr
          class="item-row ${classMap({
            'table-active': model === this.selected,
          })}"
          .model=${model}
        >
          ${this.fields.map((field) => {
            return html` <td>${field.render ? field.render(model) : model.get(field.attr)}</td> `
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
      'table-responsive': this.responsive,
      'table-striped': this.striped,
      'table-sm': this.sm,
    }

    const theadClasses = {
      'thead-dark': this.theadDark,
      'thead-light': this.theadLight,
    }

    return html`
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
    `
  }
}

customElements.define('data-table', DataTable)

export { DataTable }
