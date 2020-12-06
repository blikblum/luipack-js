import { html } from 'lit-html'

export default {
  title: 'Components/Test',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['click'],
    },
  },
}

class MyComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button>Click x</button>'   
  }
}

customElements.define('my-component', MyComponent)

class MyParentComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<my-component></my-component>'  
  }
}

customElements.define('my-parent-component', MyParentComponent)

export const Default = () =>
  html`<my-parent-component></my-parent-component>`

