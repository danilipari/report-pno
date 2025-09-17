import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FiltersData } from '../types/filters.types'
import { FiltersService } from '../services/filters.service'

export const useFiltersStore = defineStore('filters', () => {
  const selectedFilters = ref<Record<string, number | null>>({})
  const availableFilters = ref<FiltersData>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getSelectedOption = (filterKey: string) => {
    const selectedId = selectedFilters.value[filterKey]
    if (selectedId === null) return null
    return availableFilters.value[filterKey]?.find(item => item.id === selectedId) || null
  }

  const filterKeys = computed(() => Object.keys(availableFilters.value))

  function setFilter(filterKey: string, id: number | null) {
    selectedFilters.value[filterKey] = id
  }

  async function loadFilters() {
    isLoading.value = true
    error.value = null

    try {
      const filtersData = await FiltersService.getFilters()
      availableFilters.value = filtersData

      Object.keys(filtersData).forEach(key => {
        if (selectedFilters.value[key] === undefined) {
          selectedFilters.value[key] = null
        }
      })

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Errore nel caricamento dei filtri'
      console.error('Error loading filters:', err)
    } finally {
      isLoading.value = false
    }
  }

  function resetFilters() {
    filterKeys.value.forEach(key => {
      selectedFilters.value[key] = null
    })
  }

  function getFilteredData() {
    const result: Record<string, any> = {}

    filterKeys.value.forEach(key => {
      const selectedId = selectedFilters.value[key]
      const selectedOption = getSelectedOption(key)

      result[key] = {
        id: selectedId,
        name: selectedOption?.name || 'N/A'
      }
    })

    return result
  }

  return {
    selectedFilters,
    availableFilters,
    filterKeys,
    isLoading,
    error,
    getSelectedOption,
    setFilter,
    loadFilters,
    resetFilters,
    getFilteredData
  }
})