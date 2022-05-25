import { html } from 'lit'
import 'jquery'
import 'bootstrap'

import '../bs-components/menu-button.js'

const defaultItems = [
  { name: 'Test', value: 1 },
  { name: 'Test 3', value: 3 },
  { name: 'Hello', value: 'world' },
]

export default {
  title: 'Components/MenuButton',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['change'],
    },
  },
  args: {
    items: defaultItems,
    type: 'primary',
  },
}

const Template = ({ value, items, type }) =>
  html`<menu-button .items=${items} .value=${value} type=${type}></menu-button>`

export const Default = Template.bind({})
Default.args = {}

export const ValueSet = Template.bind({})
ValueSet.args = {
  value: 3,
}

export const Divider = Template.bind({})
Divider.args = {
  items: [...defaultItems, { type: 'divider' }, { name: 'Name', value: 'value' }],
}
