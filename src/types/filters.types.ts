export interface FilterOption {
  id: number
  name: string
}

export interface FiltersType {
  [key: string]: Array<{ id: number; name: string; }>
}

export type FiltersData = FiltersType;

export interface SelectedFilters {
  monthId: number | null
  operatorId: number | null
}

export const MONTHS: FilterOption[] = [
  { id: 1, name: 'Gennaio' },
  { id: 2, name: 'Febbraio' },
  { id: 3, name: 'Marzo' },
  { id: 4, name: 'Aprile' },
  { id: 5, name: 'Maggio' },
  { id: 6, name: 'Giugno' },
  { id: 7, name: 'Luglio' },
  { id: 8, name: 'Agosto' },
  { id: 9, name: 'Settembre' },
  { id: 10, name: 'Ottobre' },
  { id: 11, name: 'Novembre' },
  { id: 12, name: 'Dicembre' }
]

export const OPERATORS: FilterOption[] = [
  { id: 1, name: 'Dani Lipari' }
]