import { Collection } from 'nextbone'

import { addons } from '@storybook/preview-api'
import { STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from '@storybook/core-events'

import { html } from './light-component.js'

import 'jquery'
import 'datatables.net'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.css'

// required by searchpanes
import 'datatables.net-select-bs5'
import 'datatables.net-select-bs5/css/select.bootstrap5.css'

import 'datatables.net-searchpanes'
import 'datatables.net-searchpanes-bs5'
import 'datatables.net-searchpanes-bs5/css/searchPanes.bootstrap5.css'

import './dt-table.js'
import './dt-table.scss'

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

const altData = [
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
  updatableCollection.set(altData)
}

function resetCollection() {
  updatableCollection.reset(defaultData)
}

function renderCollectionUpdates({ data, config }) {
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
}

export const CollectionUpdates = {
  args: {
    data: updatableCollection,
  },
  render: renderCollectionUpdates,
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

const searchPanesConfig = {
  ...defaultConfig,
  layout: {
    top1: 'searchPanes',
  },
}

export const SearchPanes = {
  args: {
    data: updatableCollection,
    config: searchPanesConfig,
  },
  render: renderCollectionUpdates,
}

function setDataNoRender(storyId, data) {
  const storyStoreArgs = global.__STORYBOOK_STORY_STORE__.args
  storyStoreArgs.update(storyId, {
    data,
  })
  addons.getChannel().emit(STORY_ARGS_UPDATED, {
    storyId,
    args: storyStoreArgs.get(storyId),
  })
}

function setData(storyId, data) {
  addons.getChannel().emit(UPDATE_STORY_ARGS, {
    storyId,
    updatedArgs: { data },
  })
}

const altCollection = new Collection(altData)

function renderSwapData({ data, config }, { id }) {
  return html`<div class="row">
      <div class="col">
        <button type="button" class="btn" @click=${() => setData(id, defaultCollection)}>
          Collection1
        </button>
      </div>
      <div class="col">
        <button type="button" class="btn" @click=${() => setData(id, altCollection)}>
          Collection2
        </button>
      </div>
      <div class="col">
        <button type="button" class="btn" @click=${() => setData(id, defaultData)}>Data1</button>
      </div>
      <div class="col">
        <button type="button" class="btn" @click=${() => setData(id, altData)}>Data2</button>
      </div>
    </div>
    <dt-table .data=${data} .config=${config}></dt-table>`
}

export const SwapData = {
  args: {
    data: updatableCollection,
  },
  render: renderSwapData,
}
