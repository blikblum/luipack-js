import { LitElement, html, customElement, property } from 'lit-element'
import { classMap } from 'lit-html/directives/class-map'
import { styleMap } from 'lit-html/directives/style-map'
import { ifDefined } from 'lit-html/directives/if-defined'

class Component extends LitElement {
  createRenderRoot() {
    // disable shadow dom
    return this
  }
}

export { Component, customElement, html, property, classMap, styleMap, ifDefined }
