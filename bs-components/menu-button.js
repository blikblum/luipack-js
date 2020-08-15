import { event, view, state } from 'nextbone'
import { Component, html, property , classMap } from '../light-component.js'

import './menu-button.scss'

@view
class MenuButton extends Component {
  @property({ attribute: false })
  items

  @state
  collection

  @property({ type: String })
  icon

  @property({ type: String })
  type = 'secondary'

  @property({ type: String })
  caption

  @property({ type: Boolean, attribute: 'fixed-caption' })
  fixedCaption

  @property({ type: Boolean })
  sm

  @property({ type: Boolean })
  lg

  @property({ type: String, attribute: 'value-attr' })
  valueAttr

  @property({ type: String, attribute: 'name-attr' })
  nameAttr

  @property({})
  value

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
          data-toggle="dropdown"
        >
          <span class=${this.iconClass}></span>
          ${buttonCaption}
        </button>
        <div class="dropdown-menu">
          ${items.map((item) => {
            if (item.type === 'separator') {
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
