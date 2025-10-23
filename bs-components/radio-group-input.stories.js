import { html } from 'lit'
import 'bootstrap'

import './radio-group-input'

const defaultItems = [
  { name: 'USG Renal', value: 1 },
  { name: 'Relatório Sisnefro', value: 2 },
  { name: 'Solicitação de exames', value: 3 },
]

export default {
  title: 'Components/RadioInputGroup',
  component: 'radio-group-input',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['change radio-input-group'],
    },
  },
  args: {
    styled: true,
    disabled: false,
    withOther: false,
    items: defaultItems,
  },
  argTypes: {
    styled: { control: 'boolean' },
    disabled: { control: 'boolean' },
    withOther: { control: 'boolean' },
  },
}

export const Value = {}
Value.args = {
  value: 2,
}

export const Inline = {}
Inline.args = {
  inline: true,
}

function formGroupRender({ items, value, invalidFeedback }) {
  return html`
    <div class="mb-3">
      <label class="form-label">Pendências</label>
      <radio-group-input
        name="test"
        class="${invalidFeedback ? 'is-invalid' : ''}"
        .value=${value}
        .items=${items}
        .styled=${this?.styled ?? false}
        .disabled=${this?.disabled ?? false}
        .withOther=${this?.withOther ?? false}
      ></radio-group-input>
      ${invalidFeedback ? html`<div class="invalid-feedback">${invalidFeedback}</div>` : ''}
    </div>
  `
}
export const FormGroup = { render: formGroupRender }
FormGroup.args = {}

export const FormGroupInvalid = { render: formGroupRender }
FormGroupInvalid.args = { invalidFeedback: 'There an error' }
