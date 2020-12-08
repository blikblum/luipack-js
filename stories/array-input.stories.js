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
  args: {
    placeholder: 'Add another',
  },
}

const Template = ({ value, placeholder }) =>
  html`<array-input name="test" placeholder=${placeholder} .value=${value}></array-input>`

export const Default = Template.bind({})
Default.args = {
  value: ['Item 1'],
}

export const Empty = Template.bind({})
Empty.args = {
  value: [],
}
