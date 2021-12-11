import { Component, html, property } from '../light-component'

import './array-input.scss'

const stopEvent = (e) => {
  e.stopPropagation()
}

export default class ArrayInput extends Component {
  @property({ type: Array, attribute: false })
  value

  @property({ type: String })
  name

  @property({ type: String })
  placeholder = 'Add another'

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
              <button type="button" class="close" aria-label="Delete" @click=${this.deleteClick}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          `
      )}
      <div class="d-flex">
        <input
          type="text"
          class="form-control flex-grow-1 mx-1"
          placeholder=${this.placeholder}
          @change=${this.newInputChange}
          @input=${stopEvent}
        />
        <button type="button" class="close pb-2 invisible">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `
  }
}

customElements.define('array-input', ArrayInput)
customElements.define('string-array-input', ArrayInput)
