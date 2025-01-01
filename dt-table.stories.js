import { Collection } from 'nextbone'
import { html } from './light-component.js'

import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'

import './dt-table.js'
import './dt-table.scss'

console.log($.fn.dataTable)

const defaultData = [
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
]

const defaultCollection = new Collection(defaultData)

const defaultConfig = {
  pageLength: 30,
  columns: [
    {
      className: 'dt-control',
      orderable: false,
      data: null,
      defaultContent: '',
    },
    {
      title: 'Id',
      data: 'id',
    },
    {
      title: 'Nome',
      data: 'name',
      defaultContent: '--',
    },
    {
      title: 'Setor',
      data: null,
      render({ sector }) {
        return `<strong>${sector}</strong>`
      },
    },
    {
      title: 'Leito',
      data: 'bed',
      defaultContent: '--',
    },
    {
      title: 'Tags',
      data: 'tags',
      defaultContent: '',
      render: {
        _: '[, ]',
        sp: '[]',
      },
      searchPanes: {
        orthogonal: 'sp',
      },
    },
  ],
}

export default {
  title: 'Components/DTTable',
  component: 'dt-table',
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['my-action'],
    },
  },
  args: {
    data: defaultData,
    config: defaultConfig,
  },
}

export const Default = {}

export const CollectionData = {
  args: {
    data: defaultCollection,
  },
}

const updatableCollection = new Collection(defaultData)

function addModel() {
  updatableCollection.add({
    id: updatableCollection.length + 1,
    name: 'New Model',
    bed: updatableCollection.length + 1,
    sector: 'Enfermaria B',
  })
}

function removeModel() {
  updatableCollection.remove(updatableCollection.last())
}

function setModels() {
  updatableCollection.set([
    {
      id: 1,
      name: 'Jim Jones',
      bed: 1,
      sector: 'Enfermaria B',
      registry: '2000',
    },
    {
      id: 2,
      name: 'João Silva',
      bed: 2,
      sector: 'Enfermaria A',
      registry: '2001',
      tags: ['tag a', 'tag b'],
    },
    {
      id: 99,
      name: 'Strange Model',
      bed: 2,
      sector: 'Enfermaria A',
      registry: '2001',
    },
  ])
}

function resetCollection() {
  updatableCollection.reset(defaultData)
}

export const CollectionUpdates = {
  args: {
    data: updatableCollection,
  },
  render({ data, config }) {
    return html`<div class="row">
        <div class="col">
          <button type="button" class="btn" @click=${resetCollection}>Reset</button>
        </div>
        <div class="col"><button type="button" class="btn" @click=${addModel}>Add</button></div>
        <div class="col">
          <button type="button" class="btn" @click=${removeModel}>Remove</button>
        </div>
        <div class="col"><button type="button" class="btn" @click=${setModels}>Set</button></div>
      </div>
      <dt-table .data=${data} .config=${config}></dt-table>`
  },
}

const actionConfig = { ...defaultConfig }

actionConfig.columns = [
  ...actionConfig.columns,
  {
    data: null,
    render() {
      return `<button class="btn btn-primary btn-sm" data-action="my-action">Action</button>`
    },
  },
]

export const Action = {
  args: {
    config: actionConfig,
  },
}
