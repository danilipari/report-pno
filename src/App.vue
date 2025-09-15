<script setup lang="ts">
import { ref } from 'vue'
import ChartsDemo from './components/ChartsDemo.vue'
import VolumeDetailTable from './components/tables/VolumeDetailTable.vue'
import ReportTest from './components/ReportTest.vue'

const activeTab = ref('charts')
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">
        PNO System
      </h1>

      <div v-if="false" class="mb-6 flex justify-center gap-2">
        <button
          @click="activeTab = 'charts'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'charts'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          D3.js Charts
        </button>
        <button
          @click="activeTab = 'tables'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'tables'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          TanStack Tables
        </button>
        <button
          @click="activeTab = 'reports'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          Pinia Store
        </button>
      </div>

      <div v-if="activeTab === 'charts'" class="space-y-8">
        <ChartsDemo />
        <VolumeDetailTable />
      </div>
      <ReportTest v-if="activeTab === 'reports'" />
    </div>
  </div>
</template>

<style scoped>
</style>
