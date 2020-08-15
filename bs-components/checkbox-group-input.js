import { event } from 'nextbone'
import { Component, html, property } from '../light-component.js'

import './checkbox-group-input.scss'

export default class CheckboxGroupInput extends Component {
  @property({ attribute: false })
  value

  @property({ type: String })
  name

  @property({ type: Array, attribute: false })
  items

  updateValue(itemValue, checked) {
    // todo: only trigger change / update value if state changed
    let value = this.value || []
    if (Array.isArray(value)) {
      const valueIndex = value.indexOf(itemValue)
      if (checked) {
        if (valueIndex === -1) {
          value.push(itemValue)
        }
      } else if (valueIndex !== -1) {
        value.splice(valueIndex, 1)
      }
      value = value.slice()
    } else {
      if (checked) {
        value[itemValue] = true
      } else {
        delete value[itemValue]
      }
      value = { ...value }
    }
    this.value = value
    this.dispatchEvent(new InputEvent('change', { bubbles: true }))
    this.requestUpdate()
  }

  @event('change', 'input')
  itemCheckboxChange(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  @event('input', 'input')
  itemCheckboxInput(e) {
    e.preventDefault()
    e.stopPropagation()
    const index = +e.target.dataset.index
    const item = this.items[index] || {}
    const itemValue = item.value !== undefined ? item.value : item.name
    this.updateValue(itemValue, e.target.checked)
  }

  valueContainsItemValue(itemValue) {
    return Array.isArray(this.value) ? this.value.includes(itemValue) : itemValue in this.value
  }

  render() {
    const items = this.items || []

    return html`
      ${items.map((item, i) => {
        const id = `${this.name}-${i}`
        return html`
          <div class="custom-control custom-checkbox">
            <input
              id=${id}
              type="checkbox"
              name=${this.name}
              class="custom-control-input"
              data-index=${i}
              .checked=${this.valueContainsItemValue(item.value)}
            />
            <label class="custom-control-label" for=${id}>${item.name}</label>
          </div>
        `
      })}
    `
  }
}

customElements.define('checkbox-group-input', CheckboxGroupInput)
