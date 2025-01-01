import { Collection } from 'nextbone'

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
