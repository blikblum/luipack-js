import { Collection } from 'nextbone'
import { html } from './light-component.js'

import 'jquery'
import 'datatables.net'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'

import './dt-table.js'
import './dt-table.scss'

import './dt-table-filters.js'

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

function addModel() {
  defaultCollection.add({
    id: defaultCollection.length + 1,
    name: 'New Model',
    bed: defaultCollection.length + 1,
    sector: 'Enfermaria B',
  })
}

function removeModel() {
  defaultCollection.remove(defaultCollection.last())
}

function setModels() {
  defaultCollection.set([
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
  defaultCollection.reset(defaultData)
}

const defaultConfig = {
  pageLength: 30,
  columns: [
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
      name: 'sector',
      data: 'sector',
      render(sector) {
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
  title: 'Components/DTTableFilters',
  component: 'dt-table-filters',
  parameters: {
    layout: 'centered',
  },
  args: {
    data: defaultCollection,
    config: defaultConfig,
  },
  render({ data, config }) {
    return html`<div class="row">
        <div class="col mb-3">
          <button type="button" class="btn btn-primary" @click=${resetCollection}>Reset</button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-primary" @click=${addModel}>Add</button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-primary" @click=${removeModel}>Remove</button>
        </div>
        <div class="col">
          <button type="button" class="btn btn-primary" @click=${setModels}>Set</button>
        </div>
      </div>
      <dt-table-filters>
        <div class="row">
          <div class="col">
            <input class="form-control" placeholder="Filtrar pelo nome" data-field="name" />
          </div>
          <div class="col">
            <select class="form-select" data-name="sector" placeholder="Todos os setores"></select>
          </div>
          <div class="col">
            <select
              class="form-select"
              data-name="sector"
              placeholder="Todos os setores"
              multiple
            ></select>
          </div>
          <div class="col">
            <select class="form-select" data-field="tags" placeholder="Tags"></select>
          </div>
        </div>
      </dt-table-filters>
      <dt-table .data=${data} .config=${config}></dt-table>`
  },
}

export const Default = {}
