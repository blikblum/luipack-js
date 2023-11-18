import { event, view, state } from 'nextbone'
import { Component, html, classMap } from '../light-component.js'

import './menu-button.scss'

@view
class MenuButton extends Component {
  static properties = {
    items: { attribute: false },
    collection: { attribute: false },
    icon: { type: String },
    type: { type: String },
    caption: { type: String },
    fixedCaption: { type: Boolean, attribute: 'fixed-caption' },
    sm: { type: Boolean },
    lg: { type: Boolean },
    valueAttr: { type: String, attribute: 'value-attr' },
    nameAttr: { type: String, attribute: 'name-attr' },
    value: {},
  }

  @state
  collection

  constructor() {
    super()
    this.type = 'secondary'
  }

  @event('click', '.dropdown-item')
  itemClick(e) {
    const { item } = e.selectorTarget
    if (item) {
      this.value = item.value
    }
    this.dispatchEvent(new CustomEvent('item-click', { bubbles: true, detail: item }))
  }

  get iconClass() {
    return this.icon ? `fa fa-${this.icon}` : null
  }

  _getItems() {
    if (this.items) {
      return this.items
    }
    if (this.collection) {
      // todo: cache collection items ?
      const nameAttr = this.nameAttr || 'name'
      const valueAttr = this.valueAttr || 'value'
      return this.collection.map((model) => ({
        name: model.get(nameAttr),
        value: model.get(valueAttr),
      }))
    }
    return []
  }

  render() {
    const items = this._getItems()
    const item = this.value !== undefined && items.find((item) => item.value === this.value)
    const buttonCaption = item && !this.fixedCaption ? item.name : this.caption
    const buttonClasses = { 'btn-lg': this.lg, 'btn-sm': this.sm }
    buttonClasses[`btn-${this.type}`] = true
    return html`
      <div class="dropdown">
        <button
          type="button"
          class="btn dropdown-toggle ${classMap(buttonClasses)}"
          data-bs-toggle="dropdown"
        >
          <span class=${this.iconClass}></span>
          ${buttonCaption}
        </button>
        <div class="dropdown-menu">
          ${items.map((item) => {
            if (item.type === 'divider') {
              return html` <div class="dropdown-divider"></div> `
            }
            return html` <a class="dropdown-item" .item=${item}>${item.name}</a> `
          })}
        </div>
      </div>
    `
  }
}

customElements.define('menu-button', MenuButton)
