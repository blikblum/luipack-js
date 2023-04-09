import { html } from 'lit'
import 'bootstrap'

import './custom-array-input.js'
import './checkbox-group-input.js'

export default {
  title: 'Components/CustomArrayInput',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['change', 'input'],
    },
  },
  args: {
    value: [{ name: 'Hello', value: 'World' }],
    itemRender(item, { index }) {
      return html`<div class="row">
          <div class="col">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input
                name="name"
                class="form-control"
                type="text"
                placeholder="Name"
                .value=${item.name || null}
              />
            </div>
          </div>
          <div class="col">
            <div class="mb-3">
              <label class="form-label">Value</label>
              <input
                name="value"
                class="form-control"
                type="text"
                placeholder="Value"
                .value=${item.value || null}
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="mb-3">
              <label class="form-label">Number Value</label>
              <input
                name="numberValue"
                class="form-control"
                type="number"
                placeholder="Number Value"
                .value=${item.numberValue || null}
              />
            </div>
          </div>
          <div class="col align-items-center d-flex">
            <div class="form-check">
              <input
                id=${`checkbox-value-${index}`}
                name="checkboxValue"
                class="form-check-input"
                type="checkbox"
                .checked=${Boolean(item.checkboxValue)}
              />
              <label for=${`checkbox-value-${index}`} class="form-check-label"
                >Checkbox Value</label
              >
            </div>
          </div>
        </div> `
    },
  },
}

const Template = ({ value, itemRender, addItems, addDefault }) =>
  html`<custom-array-input
    name="test"
    .itemRender=${itemRender}
    .addDefault=${addDefault}
    .addItems=${addItems}
    .value=${value}
  ></custom-array-input>`

export const Default = Template.bind({})
Default.args = {}

export const Empty = Template.bind({})
Empty.args = {
  value: [],
}

export const AddItems = Template.bind({})
AddItems.args = {
  addItems: [
    { name: 'Item 1', value: { name: 'New', value: 'Item' } },
    {
      name: 'Item 2',
      value: {
        name: 'Dynamic',
        get value() {
          return 'xxx'
        },
      },
    },
  ],
}

export const AddDefault = Template.bind({})
AddDefault.args = {
  addDefault: { name: 'Default name', value: 'Default value' },
}

export const Card = Template.bind({})
Card.args = {
  itemRender(item) {
    return html`
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  name="name"
                  class="form-control"
                  type="text"
                  placeholder="Name"
                  .value=${item.name || null}
                />
              </div>
            </div>
            <div class="col">
              <div class="mb-3">
                <label class="form-label">Value</label>
                <input
                  name="value"
                  class="form-control"
                  type="text"
                  placeholder="Value"
                  .value=${item.value || null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
}

const tagitems = [
  { name: 'tag 1', value: 1 },
  { name: 'tag 2', value: 2 },
  { name: 'other tag', value: 3 },
]

export const CheckboxGroup = Template.bind({})
CheckboxGroup.args = {
  value: [{ name: 'Hello', tags: [1, 3] }],
  itemRender(item) {
    return html`
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  name="name"
                  class="form-control"
                  type="text"
                  placeholder="Name"
                  .value=${item.name || null}
                />
              </div>
            </div>
            <div class="col">
              <div class="mb-3">
                <label class="form-label">Tags</label>
                <checkbox-group-input
                  name="tags"
                  custom-input
                  .items=${tagitems}
                  .value=${item.tags}
                ></checkbox-group-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
}
