import { html } from 'lit-html'
import 'jquery'
import 'bootstrap'

import '../bs-components/array-input'

export default {
  title: 'Components/ArrayInput',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['change'],
    },
  },
}


export const Default = () =>
  html`<array-input name="test" .value=${['Item 1']}></array-input>`

export const Empty = () =>
  html`<array-input name="test" .value=${[]}></array-input>`

