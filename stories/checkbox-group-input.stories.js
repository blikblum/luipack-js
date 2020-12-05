import { html } from 'lit-html'
import 'jquery'
import 'bootstrap'

import '../bs-components/checkbox-group-input'

export default {
  title: 'Components/CheckBoxInputGroup',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['change checkbox-group-input'],
    },
  },
}

const items = [
  { name: 'USG Renal', value: 1 },
  { name: 'Relatório Sisnefro', value: 2 },
  { name: 'Solicitação de exames', value: 3 },
]

export const ArrayValue = () =>
  html`<checkbox-group-input name="test" .value=${[2]} .items=${items}></checkbox-group-input>`

export const ArrayValueEmpty = () =>
  html`<checkbox-group-input name="test" .value=${[]} .items=${items}></checkbox-group-input>`

export const ObjectValue = () =>
  html`<checkbox-group-input
    name="test"
    .value=${{ 2: true }}
    .items=${items}
  ></checkbox-group-input>`

export const ObjectValueEmpty = () =>
  html`<checkbox-group-input name="test" .value=${{}} .items=${items}></checkbox-group-input>`
