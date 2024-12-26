import { html } from 'lit'
import 'bootstrap'

import './checkbox-group-input'

const defaultItems = [
  { name: 'USG Renal', value: 1 },
  { name: 'Relatório Sisnefro', value: 2 },
  { name: 'Solicitação de exames', value: 3 },
]

export default {
  title: 'Components/CheckBoxInputGroup',
  component: 'checkbox-group-input',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['change checkbox-group-input'],
    },
  },
  args: {
    items: defaultItems,
  },
}

export const ArrayValue = {}
ArrayValue.args = {
  value: [2],
}

export const ArrayValueEmpty = {}
ArrayValueEmpty.args = {
  value: [],
}

export const ObjectValue = {}
ObjectValue.args = {
  value: { 2: true },
}

export const ObjectValueEmpty = {}
ObjectValueEmpty.args = {
  value: {},
}

export const Inline = {}
Inline.args = {
  inline: true,
}

export const Disabled = {}
Disabled.args = {
  disabled: true,
}

function formGroupRender({ items, value, invalidFeedback }) {
  return html`
    <div class="mb-3">
      <label class="form-label">Pendências</label>
      <checkbox-group-input
        name="test"
        class="${invalidFeedback ? 'is-invalid' : ''}"
        .value=${value}
        .items=${items}
      ></checkbox-group-input>
      ${invalidFeedback ? html`<div class="invalid-feedback">${invalidFeedback}</div>` : ''}
    </div>
  `
}
export const FormGroup = { render: formGroupRender }
FormGroup.args = {}

export const FormGroupInvalid = { render: formGroupRender }
FormGroupInvalid.args = { invalidFeedback: 'There an error' }
