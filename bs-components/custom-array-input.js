import { delegate } from 'nextbone'
import { Component, html, property } from '../light-component.js'

function resolveValue(value) {
  if (typeof value === 'function') return value()
  return value || {}
}

class CustomArrayInput extends Component {
  @property({ type: String, attribute: 'add-label' })
  addLabel

  @property({ type: String, attribute: 'empty-message' })
  emptyMessage

  @property({ type: String })
  name

  @property({ type: Array, attribute: false })
  value

  itemRender

  addItems

  defaults

  constructor() {
    super()
    delegate(this, 'click', '.dropdown-item', this.addItemClick, this)
    delegate(this, 'input', 'input, [custom-input]', this.inputInputHandler, this)
    delegate(this, 'change', 'input, [custom-input]', this.inputChangeHandler, this)
  }

  inputInputHandler(e) {
    e.stopPropagation()
    const input = e.selectorTarget
    const attr = input.name
    if (!attr) {
      return
    }
    const { item } = input.closest('.array-input-item')
    const index = this.value.indexOf(item)
    if (attr === '*') {
      this.editItem(index, input.value)
      return
    }

    let value
    switch (input.type) {
      case 'number':
        value = input.valueAsNumber
        break

      default:
        // todo: handle date
        value = input.value
        break
    }
    this.editItem(index, { ...item, [attr]: value || undefined })
  }

  inputChangeHandler(e) {
    e.stopPropagation()
    // todo: handle radio /checkbox here?
  }

  triggerChange() {
    this.dispatchEvent(new InputEvent('input', { bubbles: true }))
  }

  removeItem(index) {
    if (!this.value) return
    this.value = this.value.filter((item, i) => index !== i)
    this.triggerChange()
  }

  editItem(index, value) {
    if (!this.value) return
    const prev = this.value
    this.value = [...prev.slice(0, index), value, ...prev.slice(index + 1)]
    this.triggerChange()
  }

  addItem(value) {
    this.value = [...(this.value || []), value]
    this.triggerChange()
  }

  addButtonClick(e) {
    e.stopPropagation()
    this.addItem(resolveValue(this.addDefault))
  }

  addItemClick(e) {
    e.preventDefault()
    const index = +e.selectorTarget.dataset.index
    const item = this.addItems[index] || {}
    this.addItem(item.value || {})
  }

  removeButtonClick(e) {
    e.stopPropagation()
    const input = e.currentTarget
    const { item } = input.closest('.array-input-item')
    const index = this.value.indexOf(item)
    this.removeItem(index)
  }

  _renderItems(value) {
    if (!value.length) {
      return html`<div style="font-style: italic;">${this.emptyMessage || 'No items'}</div>`
    }
    return value.map((item) => {
      return html`<div class="array-input-item form-row mb-1" .item=${item}>
        <div class="col">${this.itemRender(item)}</div>

        <div class="col-auto d-flex align-items-center">
          <button type="button" class="close" aria-label="Remove" @click=${this.removeButtonClick}>
            <span aria-hidden="true" style="vertical-align: super;">&times;</span>
          </button>
        </div>
      </div>`
    })
  }

  render() {
    const { value = [], addLabel = 'Add item' } = this

    return html`
      ${this._renderItems(value)}
      <div class="form-row mt-2">
        <div class="col-auto">
          ${this.addItems
            ? html` <div class="dropdown">
                <button
                  class="btn btn-light btn-sm dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  ${addLabel}
                </button>
                <div class="dropdown-menu">
                  ${this.addItems.map(
                    ({ name }, i) =>
                      html`<a href="#" class="dropdown-item" data-index=${i}>${name}</a>`
                  )}
                </div>
              </div>`
            : html`<button type="button" class="btn btn-light btn-sm" @click=${this.addButtonClick}>
                ${addLabel}
              </button>`}
        </div>
      </div>
    `
  }
}

customElements.define('custom-array-input', CustomArrayInput)

export { CustomArrayInput }
