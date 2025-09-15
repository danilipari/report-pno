<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Pinia Store Test</h2>

    <div class="space-y-4">
      <div v-if="reportStore.loading" class="text-blue-600">
        Loading...
      </div>

      <div v-if="reportStore.error" class="text-red-600 p-3 bg-red-50 rounded">
        Error: {{ reportStore.error }}
      </div>

      <div class="flex gap-2">
        <button
          @click="reportStore.fetchReports()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fetch Reports
        </button>

        <button
          @click="handleCreateReport"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Report
        </button>

        <select
          v-model="filterStatus"
          @change="reportStore.setFilter('status', filterStatus)"
          class="px-4 py-2 border rounded"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="p-3 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Total Reports</div>
          <div class="text-xl font-bold">{{ reportStore.totalReports }}</div>
        </div>
        <div class="p-3 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Filtered Count</div>
          <div class="text-xl font-bold">{{ reportStore.filteredReports.length }}</div>
        </div>
        <div class="p-3 bg-gray-50 rounded">
          <div class="text-sm text-gray-600">Published</div>
          <div class="text-xl font-bold">
            {{ reportStore.reportsByStatus('published').length }}
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="font-semibold">Reports:</h3>
        <div
          v-for="report in reportStore.filteredReports"
          :key="report.id"
          class="p-3 border rounded hover:bg-gray-50 flex justify-between items-center"
        >
          <div>
            <div class="font-medium">{{ report.title }}</div>
            <div class="text-sm text-gray-600">
              Status: {{ report.status }} | Created: {{ formatDate(report.createdAt) }}
            </div>
          </div>
          <button
            @click="reportStore.deleteReport(report.id)"
            class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useReportStore } from '../stores/report'

const reportStore = useReportStore()
const filterStatus = ref('all')

const handleCreateReport = async () => {
  const newReport = {
    title: `New Report ${Date.now()}`,
    data: [],
    status: 'draft' as const
  }
  await reportStore.createReport(newReport)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}
</script>