import { Component, html } from '../light-component.js'

const stopEvent = (e) => {
  e.stopPropagation()
}

export class StringArrayInput extends Component {
  static properties = {
    value: { attribute: false },
    name: { type: String },
    placeholder: { type: String },
  }

  constructor() {
    super()
    this.placeholder = 'Add another'
  }

  triggerChange() {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true }))
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

  addItem(input) {
    const value = input.value.trim()
    if (!value) {
      return
    }
    this.value = [...(this.value || []), value]
    input.value = ''
    this.triggerChange()
  }

  inputChange(e) {
    e.stopPropagation()
    const input = e.target
    const row = input.closest('[data-index]')

    this.editItem(+row.dataset.index, input.value)
  }

  deleteClick(e) {
    const button = e.currentTarget
    const row = button.closest('[data-index]')
    this.removeItem(+row.dataset.index)
  }

  newInputChange(e) {
    e.stopPropagation()
    this.addItem(e.target)
  }

  render() {
    const arr = this.value || []

    return html`
      ${arr.map(
        (text, i) =>
          html`
            <div class="d-flex align-items-center" data-index=${i}>
              <div class="flex-grow-1 mx-1 mb-1">
                <input
                  class="form-control"
                  type="text"
                  .value=${text || null}
                  @change=${this.inputChange}
                  @input=${stopEvent}
                />
              </div>
              <button
                type="button"
                class="btn-close"
                aria-label="Remove"
                @click=${this.deleteClick}
              ></button>
            </div>
          `
      )}
      <div class="d-flex align-items-center">
        <div class="flex-grow-1 mx-1">
          <input
            type="text"
            class="form-control  "
            placeholder=${this.placeholder}
            @change=${this.newInputChange}
            @input=${stopEvent}
          />
        </div>
        <button type="button" class="btn-close invisible" aria-hidden="true"></button>
      </div>
    `
  }
}

customElements.define('string-array-input', StringArrayInput)
