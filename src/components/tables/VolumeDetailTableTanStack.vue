<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-6">Tabella di dettaglio volumi giornalieri sul mese (TanStack)</h2>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="header in table.getHeaderGroups()[0].headers"
              :key="header.id"
              class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300"
            >
              <div
                v-if="header.column.getCanSort()"
                @click="header.column.getToggleSortingHandler()?.($event)"
                class="cursor-pointer select-none flex items-center"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <span class="ml-1">
                  {{ header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕' }}
                </span>
              </div>
              <div v-else>
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-gray-50"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3 border border-gray-300 text-sm"
              :class="getCellClass(cell)"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState
} from '@tanstack/vue-table'

interface VolumeRow {
  date: string
  dailyTarget: number
  dailyRecharges: number
  dailyAmount: number
  dailyDelta: number
  progressiveTarget: number
  progressiveRecharges: number
  progressiveAmount: number
  progressiveDelta: number
}

const data = computed<VolumeRow[]>(() => [
  {
    date: '2025-06-01',
    dailyTarget: 995.80,
    dailyRecharges: 9,
    dailyAmount: 1861.71,
    dailyDelta: 87,
    progressiveTarget: 995.80,
    progressiveRecharges: 9,
    progressiveAmount: 1861.71,
    progressiveDelta: 87
  },
  {
    date: '2025-06-02',
    dailyTarget: 4653.60,
    dailyRecharges: 9,
    dailyAmount: 3062.29,
    dailyDelta: -34,
    progressiveTarget: 5649.40,
    progressiveRecharges: 18,
    progressiveAmount: 4924.00,
    progressiveDelta: -13
  },
  {
    date: '2025-06-03',
    dailyTarget: 4094.56,
    dailyRecharges: 9,
    dailyAmount: 4343.01,
    dailyDelta: 6,
    progressiveTarget: 9743.96,
    progressiveRecharges: 27,
    progressiveAmount: 9267.01,
    progressiveDelta: -5
  },
  {
    date: '2025-06-04',
    dailyTarget: 3651.26,
    dailyRecharges: 9,
    dailyAmount: 3895.59,
    dailyDelta: 7,
    progressiveTarget: 13395.21,
    progressiveRecharges: 36,
    progressiveAmount: 13162.60,
    progressiveDelta: -2
  },
  {
    date: '2025-06-05',
    dailyTarget: 3456.90,
    dailyRecharges: 9,
    dailyAmount: 2269.86,
    dailyDelta: -34,
    progressiveTarget: 16852.11,
    progressiveRecharges: 45,
    progressiveAmount: 15432.46,
    progressiveDelta: -8
  },
  {
    date: '2025-06-06',
    dailyTarget: 3177.38,
    dailyRecharges: 0,
    dailyAmount: 0.00,
    dailyDelta: -100,
    progressiveTarget: 20029.49,
    progressiveRecharges: 45,
    progressiveAmount: 15432.46,
    progressiveDelta: -23
  },
  {
    date: '2025-06-07',
    dailyTarget: 1808.16,
    dailyRecharges: 0,
    dailyAmount: 0.00,
    dailyDelta: -100,
    progressiveTarget: 21837.65,
    progressiveRecharges: 45,
    progressiveAmount: 15432.46,
    progressiveDelta: -29
  },
  {
    date: '2025-06-08',
    dailyTarget: 995.80,
    dailyRecharges: 0,
    dailyAmount: 0.00,
    dailyDelta: -100,
    progressiveTarget: 22833.45,
    progressiveRecharges: 45,
    progressiveAmount: 15432.46,
    progressiveDelta: -32
  }
])

const sorting = ref<SortingState>([])

const columnHelper = createColumnHelper<VolumeRow>()

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

const formatPercentage = (value: number) => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}%`
}

const getDeltaColorClass = (delta: number) => {
  if (delta > 0) {
    return 'bg-green-200 text-green-800 font-semibold text-center'
  } else if (delta < 0) {
    return 'bg-red-200 text-red-800 font-semibold text-center'
  }
  return 'bg-gray-200 text-gray-800 font-semibold text-center'
}

const getCellClass = (cell: any) => {
  const columnId = cell.column.id
  if (columnId === 'dailyDelta' || columnId === 'progressiveDelta') {
    const value = cell.getValue()
    return getDeltaColorClass(value)
  }
  if (columnId === 'dailyRecharges' || columnId === 'progressiveRecharges') {
    return 'text-center'
  }
  return ''
}

const columns = [
  columnHelper.accessor('date', {
    header: 'Data',
    cell: info => info.getValue()
  }),
  columnHelper.accessor('dailyTarget', {
    header: 'Obiettivo giornaliero',
    cell: info => formatCurrency(info.getValue())
  }),
  columnHelper.accessor('dailyRecharges', {
    header: 'Ricariche giornaliere',
    cell: info => info.getValue().toString()
  }),
  columnHelper.accessor('dailyAmount', {
    header: 'Importo giornaliero',
    cell: info => formatCurrency(info.getValue())
  }),
  columnHelper.accessor('dailyDelta', {
    header: 'Delta obiettivo giornaliero',
    cell: info => formatPercentage(info.getValue())
  }),
  columnHelper.accessor('progressiveTarget', {
    header: 'Target progressivo',
    cell: info => formatCurrency(info.getValue())
  }),
  columnHelper.accessor('progressiveRecharges', {
    header: 'Ricariche progressive',
    cell: info => info.getValue().toString()
  }),
  columnHelper.accessor('progressiveAmount', {
    header: 'Importo Progressivo',
    cell: info => formatCurrency(info.getValue())
  }),
  columnHelper.accessor('progressiveDelta', {
    header: 'Delta obiettivo progressivo',
    cell: info => formatPercentage(info.getValue())
  })
]

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    }
  },
  onSortingChange: updaterOrValue => {
    sorting.value = typeof updaterOrValue === 'function'
      ? updaterOrValue(sorting.value)
      : updaterOrValue
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel()
})
</script>