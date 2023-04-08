import './string-array-input.js'

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
    name: 'test',
  },
  component: 'string-array-input',
}

export const Default = {
  args: {
    value: ['Item 1'],
  },
}

export const Empty = {
  args: {
    value: [],
  },
}
