<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Gauge Charts</h2>

    <div class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-4 bg-gray-50 rounded-lg flex justify-center items-center">
            <GaugeChart
            :value="(2269.86 / 3456.90) * 100"
            :min="0"
            :max="100"
            label="%"
            suffix="€"
            :displayMin="0"
            :displayMax="3456.90"
            color="#60a5fa"
            backgroundColor="#dbeafe"
            />
        </div>

        <div class="p-4 bg-gray-50 rounded-lg flex justify-center items-center">
          <GaugeChart
            :value="(15432.46 / 93000) * 100"
            :min="0"
            :max="100"
            label="%"
            suffix="€"
            :displayMin="0"
            :displayMax="93000"
            color="#60a5fa"
            backgroundColor="#dbeafe"
          />
        </div>

        <div class="p-4 bg-gray-50 rounded-lg flex justify-center items-center">
          <GaugeChart
            :value="(-829.10 / 16852.11) * 100"
            :min="0"
            :max="100"
            label="%"
            suffix="€"
            :displayMin="0"
            :displayMax="16852.11"
            color="#fca5a5"
            backgroundColor="#fee2e2"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div class="p-4 bg-gray-50 rounded-lg">
        <AreaProjectionChart />
      </div>
      <div class="p-4 bg-gray-50 rounded-lg">
        <MixedChart />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GaugeChart from './charts/GaugeChart.vue'
import AreaProjectionChart from './charts/AreaProjectionChart.vue'
import MixedChart from './charts/MixedChart.vue'

const cpuUsage = ref(45)
const memoryUsage = ref(60)
const diskUsage = ref(75)
const networkUsage = ref(30)

let interval: number | undefined

const updateRealTimeValues = () => {
  cpuUsage.value = 40 + Math.random() * 40
  memoryUsage.value = 50 + Math.random() * 30
  diskUsage.value = 60 + Math.random() * 30
  networkUsage.value = 20 + Math.random() * 60
}

onMounted(() => {
  interval = setInterval(updateRealTimeValues, 3000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>