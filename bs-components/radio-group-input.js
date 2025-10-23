import { Component, html } from '../light-component.js'

export default class RadioGroupInput extends Component {
  static properties = {
    value: { attribute: false },
    name: { type: String },
    withOther: { type: Boolean, attribute: 'with-other' },
    items: { type: Array, attribute: false },
    disabled: { type: Boolean },
    styled: { type: Boolean },
    inline: { type: Boolean },
  }

  updateValue(value) {
    this.value = value
    this.dispatchEvent(new InputEvent('change', { bubbles: true }))
    this.requestUpdate()
  }

  connectedCallback() {
    super.connectedCallback()
    this.otherSelected =
      this.value !== undefined &&
      !!this.items &&
      !this.items.some((item) => {
        const itemValue = item.value === undefined ? item.title : item.value
        return this.value === itemValue
      })
    if (this.otherSelected) {
      this.otherValue = this.value
    }
  }

  itemRadioInputChange(e) {
    e.preventDefault()
    e.stopPropagation()
    const index = +e.target.dataset.index
    const item = this.items[index] || {}
    const value = item.value !== undefined ? item.value : item.title
    this.otherSelected = false
    this.updateValue(value)
  }

  otherRadioInputChange(e) {
    e.preventDefault()
    this.otherSelected = e.target.checked
    this.updateValue(this.otherValue)
  }

  otherInputChange(e) {
    e.preventDefault()
    this.otherValue = e.target.value
    this.updateValue(this.otherValue)
  }

  render() {
    const items = this.items || []
    const styles = {
      wrapper: this.styled ? 'form-check' : 'custom-control custom-radio',
      input: this.styled ? 'form-check-input' : 'custom-control-input',
      label: this.styled ? 'form-check-label' : 'custom-control-label',
    }

    return html`
      ${items.map((item, i) => {
        const radioValue = item.value || item.title
        const label = item.name || item.title
        return html`
          <div class="${this.inline ? 'form-check-inline' : ''} ${styles.wrapper}">
            <input
              id=${this.name + i}
              type="radio"
              name=${this.name}
              class="${styles.input}"
              data-index=${i}
              @change=${this.itemRadioInputChange}
              .value=${radioValue}
              .checked=${this.value === radioValue}
              ?disabled=${this.disabled}
            />
            <label class="${styles.label}" for=${this.name + i}>${label}</label>
          </div>
        `
      })}
      ${this.withOther
        ? html`<div class="${this.inline ? 'form-check-inline' : ''} ${styles.wrapper}">
              <input
                id="other-radio-input"
                type="radio"
                name=${this.name}
                class="${styles.input}"
                .checked=${this.otherSelected}
                @change=${this.otherRadioInputChange}
                ?disabled=${this.disabled}
              />
              <label class="${styles.label}" for="other-radio-input">Outro</label>
            </div>
            <div class="mb-3">
              <input
                id="other-input"
                type="text"
                name=${this.name}
                class="form-control"
                ?disabled=${!this.otherSelected || this.disabled}
                .value=${this.otherValue || null}
                @input=${this.otherInputChange}
              />
            </div>`
        : ''}
    `
  }
}

customElements.define('radio-group-input', RadioGroupInput)
