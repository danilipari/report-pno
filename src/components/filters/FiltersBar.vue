<template>
  <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
    <span class="text-blue-500 font-medium">Filtri</span>

    <div v-if="isLoading" class="px-4 py-2 text-gray-500">
      Caricamento filtri...
    </div>

    <div v-if="error" class="px-4 py-2 text-red-500 bg-red-50 rounded-lg">
      {{ error }}
    </div>

    <div
      v-for="filterKey in filterKeys"
      :key="filterKey"
      class="relative"
    >
      <button
        @click="toggleDropdown(filterKey)"
        class="px-4 py-2 bg-white border-2 border-blue-300 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
      >
        {{ getDisplayName(filterKey) }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full max-h-[150px] overflow-y-auto">
        <button
          v-for="option in getUniqueOptions(filterKey)"
          :key="option.id + '_' + filterKey"
          @click="selectOption(filterKey, option.id)"
          class="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
          :class="{ 'bg-blue-100 text-blue-600': selectedFilters[filterKey] === option.id }"
        >
          {{ option.name }}
        </button>
      </div>
    </div>

    <button
      @click="resetAllFilters"
      class="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
      title="Reset filtri"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '../../stores/filters.store'

const filtersStore = useFiltersStore()
const { selectedFilters, availableFilters, filterKeys, isLoading, error } = storeToRefs(filtersStore)

const openDropdowns = ref<Record<string, boolean>>({})

const toggleDropdown = (filterKey: string) => {
  Object.keys(openDropdowns.value).forEach(key => {
    openDropdowns.value[key] = key === filterKey ? !openDropdowns.value[key] : false
  })
  openDropdowns.value[filterKey] = !openDropdowns.value[filterKey]
}

const selectOption = (filterKey: string, optionId: number) => {
  filtersStore.setFilter(filterKey, optionId)
  openDropdowns.value[filterKey] = false
}

const getUniqueOptions = (filterKey: string) => {
  const options = availableFilters.value[filterKey] || []
  const seen = new Set()

  return options.filter(option => {
    const key = `${option.id}-${option.name}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

const getDisplayName = (filterKey: string) => {
  const selectedOption = filtersStore.getSelectedOption(filterKey)
  if (selectedOption) {
    return selectedOption.name
  }

  const keyDisplayNames: Record<string, string> = {
    months: 'Mese corrente',
    operators: 'Tutti gli operatori'
  }

  return keyDisplayNames[filterKey] || `Seleziona ${filterKey}`
}

const resetAllFilters = () => {
  filtersStore.resetFilters()
  Object.keys(openDropdowns.value).forEach(key => {
    openDropdowns.value[key] = false
  })
}

const closeDropdowns = (event: MouseEvent) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    Object.keys(openDropdowns.value).forEach(key => {
      openDropdowns.value[key] = false
    })
  }
}

onMounted(async () => {
  document.addEventListener('click', closeDropdowns)
  await filtersStore.loadFilters()
  filterKeys.value.forEach(key => {
    openDropdowns.value[key] = false
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>