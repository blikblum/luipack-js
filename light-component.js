import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { ref, createRef } from 'lit/directives/ref.js'
import { repeat } from 'lit/directives/repeat.js'

class Component extends LitElement {
  createRenderRoot() {
    // disable shadow dom
    return this
  }
}

export {
  Component,
  customElement,
  html,
  property,
  classMap,
  styleMap,
  ifDefined,
  repeat,
  ref,
  createRef,
}
