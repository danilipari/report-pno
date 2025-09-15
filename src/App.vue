<script setup lang="ts">
import { ref } from 'vue'
import ReportTest from './components/ReportTest.vue'
import ChartsDemo from './components/ChartsDemo.vue'
import VolumeDetailTable from './components/tables/VolumeDetailTable.vue'

const activeTab = ref('main')
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">
        PNO System
      </h1>

      <div v-if="activeTab === 'main'" class="space-y-8">
        <ChartsDemo />
        <VolumeDetailTable />
      </div>
      <ReportTest v-if="activeTab === 'reports'" />
    </div>
  </div>
</template>

<style scoped>
</style>
