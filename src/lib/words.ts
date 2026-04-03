export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface Word {
  id: string
  spanish: string
  korean: string
  pronunciation: string
  example: string
  category: string
  level: CEFRLevel
}
