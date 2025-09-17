<script setup lang="ts">
import { ref } from 'vue'
import ChartsDemo from './components/ChartsDemo.vue'
import VolumeDetailTableTanStack from './components/tables/VolumeDetailTableTanStack.vue'
import ReportTest from './components/ReportTest.vue'

const activeTab = ref('charts')
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class=" mx-auto px-[6%] py-12">

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
          Charts
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
          Tables
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
          Store
        </button>
      </div>

      <div v-if="activeTab === 'charts'" class="space-y-8">
        <ChartsDemo />
        <VolumeDetailTableTanStack />
      </div>
      <ReportTest v-if="activeTab === 'reports'" />
    </div>
  </div>
</template>

<style scoped>
</style>
