<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-6">Tabella di dettaglio volumi giornalieri sul mese</h2>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Data</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Obiettivo giornaliero</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Ricariche giornaliere</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Importo giornaliero</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Delta obiettivo giornaliero</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Target progressivo</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Ricariche progressive</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Importo Progressivo</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-700 border border-gray-300">Delta obiettivo progressivo</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in data"
            :key="row.date"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3 border border-gray-300 text-sm">{{ formatDate(row.date) }}</td>
            <td class="px-4 py-3 border border-gray-300 text-sm">{{ formatCurrency(row.dailyTarget) }}</td>
            <td class="px-4 py-3 border border-gray-300 text-sm text-center">{{ row.dailyRecharges }}</td>
            <td class="px-4 py-3 border border-gray-300 text-sm">{{ formatCurrency(row.dailyAmount) }}</td>
            <td
              class="px-4 py-3 border border-gray-300 text-sm text-center font-semibold"
              :class="getDeltaColorClass(row.dailyDelta)"
            >
              {{ formatPercentage(row.dailyDelta) }}
            </td>
            <td class="px-4 py-3 border border-gray-300 text-sm">{{ formatCurrency(row.progressiveTarget) }}</td>
            <td class="px-4 py-3 border border-gray-300 text-sm text-center">{{ row.progressiveRecharges }}</td>
            <td class="px-4 py-3 border border-gray-300 text-sm">{{ formatCurrency(row.progressiveAmount) }}</td>
            <td
              class="px-4 py-3 border border-gray-300 text-sm text-center font-semibold"
              :class="getDeltaColorClass(row.progressiveDelta)"
            >
              {{ formatPercentage(row.progressiveDelta) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const formatDate = (dateStr: string) => {
  return dateStr
}

const formatCurrency = (amount: number) => {
  return `€${amount.toLocaleString('it-IT', {
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
    return 'bg-green-200 text-green-800'
  } else if (delta < 0) {
    return 'bg-red-200 text-red-800'
  }
  return 'bg-gray-200 text-gray-800'
}
</script>