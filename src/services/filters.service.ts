import type { FiltersData } from '../types/filters.types'

const API_BASE_URL = '/api'

interface ApiResponse {
  status: string
  data: FiltersData
}

export class FiltersService {
  static async getFilters(): Promise<FiltersData> {
    try {
      const response = await fetch(`${API_BASE_URL}/report/filters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiResponse: ApiResponse = await response.json()

      if (apiResponse.status !== 'OK') {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      return apiResponse.data
    } catch (error) {
      console.error('Error fetching filters:', error)
      throw error
    }
  }
}