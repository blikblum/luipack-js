import { delegate } from 'nextbone'
import { Component, html } from '../light-component.js'

import './checkbox-group-input.scss'

let checkboxGroupCount = 0

export default class CheckboxGroupInput extends Component {
  static properties = {
    value: { attribute: false },
    name: { type: String },
    inline: { type: Boolean },
    items: { attribute: false },
  }

  _idPrefix = `checkboxgroup${checkboxGroupCount++}-`

  constructor() {
    super()
    delegate(this, 'change', 'input', this.itemCheckboxChange)
    delegate(this, 'input', 'input', this.itemCheckboxInput)
  }

  updateValue(itemValue, checked) {
    // todo: only trigger change / update value if state changed
    let value = this.value || []
    let newValue
    if (Array.isArray(value)) {
      const valueIndex = value.indexOf(itemValue)
      newValue = [...value]
      if (checked) {
        if (valueIndex === -1) {
          newValue.push(itemValue)
        }
      } else if (valueIndex !== -1) {
        newValue.splice(valueIndex, 1)
      }
    } else {
      newValue = { ...value }
      if (checked) {
        newValue[itemValue] = true
      } else {
        delete newValue[itemValue]
      }
    }
    this.value = newValue
    this.dispatchEvent(new InputEvent('change', { bubbles: true }))
    this.dispatchEvent(new InputEvent('input', { bubbles: true }))
    this.requestUpdate()
  }

  itemCheckboxChange(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  itemCheckboxInput(e) {
    e.preventDefault()
    e.stopPropagation()
    const index = +e.target.dataset.index
    const item = this.items[index] || {}
    const itemValue = item.value !== undefined ? item.value : item.name
    this.updateValue(itemValue, e.target.checked)
  }

  valueContainsItemValue(itemValue) {
    const { value = [] } = this
    return Array.isArray(value) ? value.includes(itemValue) : itemValue in value
  }

  render() {
    const items = this.items || []

    return html`
      ${items.map((item, i) => {
        const id = `${this._idPrefix}${i}`
        return html`
          <div class="form-check ${this.inline ? 'form-check-inline' : ''}">
            <input
              id=${id}
              type="checkbox"
              name=${this.name}
              class="form-check-input"
              data-index=${i}
              .checked=${this.valueContainsItemValue(item.value)}
            />
            <label class="form-check-label" for=${id}>${item.name}</label>
          </div>
        `
      })}
    `
  }
}

customElements.define('checkbox-group-input', CheckboxGroupInput)
