import { html } from 'lit'
import 'jquery'
import 'bootstrap'

import '../bs-components/string-array-input.js'

export default {
  title: 'Components/StringArrayInput',
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
  html`<string-array-input
    name="test"
    placeholder=${placeholder}
    .value=${value}
  ></string-array-input>`

export const Default = Template.bind({})
Default.args = {
  value: ['Item 1'],
}

export const Empty = Template.bind({})
Empty.args = {
  value: [],
}
