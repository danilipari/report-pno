import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Report {
  id: string
  title: string
  data: any[]
  createdAt: Date
  status: 'draft' | 'published' | 'archived'
}

export const useReportStore = defineStore('report', () => {
  const reports = ref<Report[]>([])
  const currentReport = ref<Report | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref({
    status: 'all',
    dateRange: { start: null as Date | null, end: null as Date | null }
  })

  const filteredReports = computed(() => {
    let result = [...reports.value]

    if (filters.value.status !== 'all') {
      result = result.filter(r => r.status === filters.value.status)
    }

    if (filters.value.dateRange.start) {
      result = result.filter(r =>
        new Date(r.createdAt) >= filters.value.dateRange.start!
      )
    }

    if (filters.value.dateRange.end) {
      result = result.filter(r =>
        new Date(r.createdAt) <= filters.value.dateRange.end!
      )
    }

    return result
  })

  const reportsByStatus = computed(() => {
    return (status: Report['status']) =>
      reports.value.filter(r => r.status === status)
  })

  const totalReports = computed(() => reports.value.length)

  async function fetchReports() {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      reports.value = [
        {
          id: '1',
          title: 'Q1 Sales Report',
          data: [],
          createdAt: new Date('2024-01-15'),
          status: 'published'
        },
        {
          id: '2',
          title: 'Marketing Analytics',
          data: [],
          createdAt: new Date('2024-02-20'),
          status: 'draft'
        },
        {
          id: '3',
          title: 'Q2 Performance',
          data: [],
          createdAt: new Date('2024-03-10'),
          status: 'published'
        }
      ]
    } catch (err) {
      error.value = 'Failed to fetch reports'
    } finally {
      loading.value = false
    }
  }

  async function fetchReportById(id: string) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const report = reports.value.find(r => r.id === id)

      if (report) {
        currentReport.value = report
      } else {
        throw new Error('Report not found')
      }
    } catch (err) {
      error.value = `Failed to fetch report: ${err}`
    } finally {
      loading.value = false
    }
  }

  async function createReport(reportData: Omit<Report, 'id' | 'createdAt'>) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const newReport: Report = {
        ...reportData,
        id: Date.now().toString(),
        createdAt: new Date()
      }

      reports.value.push(newReport)
      return newReport
    } catch (err) {
      error.value = 'Failed to create report'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateReport(id: string, updates: Partial<Report>) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 600))

      const index = reports.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reports.value[index] = { ...reports.value[index], ...updates }
        return reports.value[index]
      }
      throw new Error('Report not found')
    } catch (err) {
      error.value = 'Failed to update report'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteReport(id: string) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      reports.value = reports.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = 'Failed to delete report'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilter(key: string, value: any) {
    if (key === 'status') {
      filters.value.status = value
    } else if (key === 'dateRange') {
      filters.value.dateRange = value
    }
  }

  function clearFilters() {
    filters.value = {
      status: 'all',
      dateRange: { start: null, end: null }
    }
  }

  return {
    reports,
    currentReport,
    loading,
    error,
    filters,
    filteredReports,
    reportsByStatus,
    totalReports,
    fetchReports,
    fetchReportById,
    createReport,
    updateReport,
    deleteReport,
    setFilter,
    clearFilters
  }
})