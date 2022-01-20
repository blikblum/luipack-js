import { html } from 'lit'
import { Collection } from 'nextbone'
import 'jquery'
import 'bootstrap'

import '../bs-components/data-table.js'

const defaultCollection = new Collection([
  {
    id: 1,
    name: 'Roarke Skyner',
    bed: 1,
    sector: 'Enfermaria B',
    registry: '2000',
  },
  {
    id: 2,
    name: 'Chester Heeps',
    bed: 2,
    sector: 'Enfermaria A',
    registry: '2001',
    tags: ['tag a', 'tag b'],
  },
  {
    id: 3,
    name: 'Minni Spain-Gower',
    bed: 3,
    sector: 'Enfermaria B',
    registry: '2002',
    tags: ['tag a', 'tag c'],
  },
  {
    id: 4,
    name: 'Forester Jobern',
    bed: 4,
    sector: 'Enfermaria B',
  },
  {
    id: 5,
    name: 'Fred Bouttell',
    bed: 5,
    sector: 'Enfermaria B',
    registry: '2004',
    tags: ['tag c', 'tag x'],
  },
])

function renderTags(model) {
  const tags = model.get('tags') || []
  return tags.map((tag) => html`<span class="badge badge-success ml-1">${tag}</span>`)
}

const defaultFields = [
  {
    title: 'Nome',
    attr: 'name',
  },
  {
    title: 'Setor',
    render: (model) => html` <strong>${model.get('sector')}</strong> `,
  },
  {
    title: 'Tags',
    render: renderTags,
    styles: { width: '200px' },
  },
]

export default {
  title: 'Components/DataTable',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['my-action'],
    },
  },
  args: {
    fields: defaultFields,
    collection: defaultCollection,
  },
}

const Template = ({ fields, collection, params, renderEditor }) =>
  html`<data-table
    .fields=${fields}
    .collection=${collection}
    .renderEditor=${renderEditor}
    .params=${params}
  ></data-table>`

export const Default = Template.bind({})
Default.args = {}

export const Action = Template.bind({})
Action.args = {
  fields: [
    ...defaultFields,
    {
      render: () =>
        html`
          <button type="button" class="btn btn-primary btn-sm" data-action="my-action">
            Action
          </button>
        `,
    },
  ],
}

export const Params = Template.bind({})
Params.args = {
  params: { user: 'Luiz' },
  fields: [
    ...defaultFields,
    {
      title: 'User',
      render: (m, { user }) => user,
    },
  ],
}

export const Editor = Template.bind({})
Editor.args = {
  fields: [
    ...defaultFields,
    {
      render: () =>
        html`
          <button type="button" class="btn btn-primary btn-sm" data-toggle="editor">Editar</button
          ><button type="button" class="btn btn-danger btn-sm">Excluir</button>
        `,
    },
  ],
  renderEditor(model) {
    return html`<div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="">Nome</label>
              <input type="text" .value=${model.get('name') || null} />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <button type="button" class="btn btn-secondary btn-sm" data-toggle="editor">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary btn-sm">Salvar</button>
          </div>
        </div>
      </div>
    </div>`
  },
}
