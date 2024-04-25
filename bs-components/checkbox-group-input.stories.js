import { html } from 'lit'
import 'bootstrap'

import './checkbox-group-input'

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

const Template = ({ value, inline }) =>
  html`<checkbox-group-input
    name="test"
    .value=${value}
    .items=${items}
    ?inline=${inline}
  ></checkbox-group-input>`

export const ArrayValue = Template.bind({})
ArrayValue.args = {
  value: [2],
}

export const ArrayValueEmpty = Template.bind({})
ArrayValueEmpty.args = {
  value: [],
}

export const ObjectValue = Template.bind({})
ObjectValue.args = {
  value: { 2: true },
}

export const ObjectValueEmpty = Template.bind({})
ObjectValueEmpty.args = {
  value: {},
}

export const Inline = Template.bind({})
Inline.args = {
  inline: true,
}

const FormGroupTemplate = ({ value, invalidFeedback }) =>
  html`
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
export const FormGroup = FormGroupTemplate.bind({})
FormGroup.args = {}

export const FormGroupInvalid = FormGroupTemplate.bind({})
FormGroupInvalid.args = { invalidFeedback: 'There an error' }
