import { Word, CEFRLevel } from './words'

const LINGVA_BASE = 'https://lingva.ml/api/v1'
const WIKTIONARY_API = 'https://en.wiktionary.org/w/api.php'
const SET_SIZE = 20

/**
 * 빈출 순위 → CEFR 레벨 매핑
 */
const LEVEL_RANGES: Record<string, { start: number; end: number }> = {
  A1: { start: 1, end: 200 },
  A2: { start: 201, end: 400 },
  B1: { start: 401, end: 700 },
  B2: { start: 701, end: 1000 },
}

// 학습 가치 없는 기능어 필터링
// 관사, 전치사, 접속사, 대명사 등 순수 기능어만 제외
// 부사(muy, aquí), 접속사(porque, entonces) 등 학습 가치 있는 건 포함
const SKIP_WORDS = new Set([
  'que', 'de', 'a', 'la', 'el', 'y', 'en', 'lo', 'un', 'por',
  'me', 'una', 'te', 'los', 'se', 'con', 'las', 'su', 'tu',
  'del', 'al', 'le', 'nos', 'ha', 'o', 'he',
  'sus', 'les', 'mi', 'mí', 'ti', 'ni', 'mis', 'tus',
  'ese', 'eso', 'esta', 'este', 'esto', 'esa',
  'estos', 'esos', 'estas', 'esas', 'unos', 'unas',
  'otro', 'otra', 'ud', 'mas',
  'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'ustedes', 'alguna', 'algún', 'ellos', 'ella', 'él',
  'han', 'hemos', 'ah', 'eh', 'oh', 'hey', 'ok',
  'sr', 'sra',
])

// Wiktionary 빈출 리스트 캐시 (한번 fetch하면 재사용)
let cachedWords: { word: string; rank: number }[] | null = null

/**
 * Wiktionary 빈출 리스트 fetch + 파싱 (캐시됨)
 */
async function getFrequencyWords(): Promise<{ word: string; rank: number }[]> {
  if (cachedWords) return cachedWords

  const res = await fetch(
    `${WIKTIONARY_API}?action=parse&page=Wiktionary:Frequency_lists/Spanish1000&prop=wikitext&format=json&origin=*`,
  )

  if (!res.ok) {
    throw new Error(`Wiktionary fetch failed: HTTP ${res.status}`)
  }

  const data = await res.json()
  const wikitext: string = data.parse.wikitext['*']

  const results: { word: string; rank: number }[] = []
  const lines = wikitext.split('\n')
  let currentRank = 0

  for (const line of lines) {
    const rankMatch = line.match(/^\|(\d+)\./)
    if (rankMatch) {
      currentRank = parseInt(rankMatch[1])
      continue
    }

    if (currentRank > 0) {
      const wordMatch = line.match(/^\|\[\[([^#]+)#Spanish\|([^\]]+)\]\]/)
      if (wordMatch) {
        const word = wordMatch[2].toLowerCase()
        if (!SKIP_WORDS.has(word)) {
          results.push({ word, rank: currentRank })
        }
        currentRank = 0
      }
    }
  }

  cachedWords = results
  return results
}

/**
 * 특정 레벨의 단어 목록 가져오기 (번역 없이)
 */
async function getLevelWords(level: CEFRLevel): Promise<{ word: string; rank: number }[]> {
  const range = LEVEL_RANGES[level]
  if (!range) return []

  const allWords = await getFrequencyWords()
  return allWords.filter((w) => w.rank >= range.start && w.rank <= range.end)
}

/**
 * Lingva Translate API로 번역
 */
async function translateWord(spanish: string): Promise<string> {
  const res = await fetch(
    `${LINGVA_BASE}/es/ko/${encodeURIComponent(spanish)}`,
  )

  if (!res.ok) {
    throw new Error(`Translation failed: HTTP ${res.status}`)
  }

  const data = await res.json()
  return data.translation ?? spanish
}

/**
 * 세트 단위(20개)로 단어를 가져와 번역
 */
export async function fetchSet(
  level: CEFRLevel,
  setIndex: number,
  onProgress?: (current: number, total: number) => void,
): Promise<Word[]> {
  const levelWords = await getLevelWords(level)
  const start = setIndex * SET_SIZE
  const setWords = levelWords.slice(start, start + SET_SIZE)

  if (setWords.length === 0) return []

  const results: Word[] = []

  for (let i = 0; i < setWords.length; i++) {
    const { word, rank } = setWords[i]

    try {
      const korean = await translateWord(word)
      results.push({
        id: `${level}-${rank}`,
        spanish: word.charAt(0).toUpperCase() + word.slice(1),
        korean,
        pronunciation: '',
        example: '',
        category: '',
        level,
      })
    } catch {
      results.push({
        id: `${level}-${rank}`,
        spanish: word.charAt(0).toUpperCase() + word.slice(1),
        korean: '(번역 실패)',
        pronunciation: '',
        example: '',
        category: '',
        level,
      })
    }

    onProgress?.(i + 1, setWords.length)

    if (i < setWords.length - 1) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  return results
}

/**
 * 특정 레벨의 세트 수 (비동기 — Wiktionary fetch 필요)
 */
export async function getSetCount(level: CEFRLevel): Promise<number> {
  const levelWords = await getLevelWords(level)
  return Math.floor(levelWords.length / SET_SIZE)
}

/**
 * 레벨에 가져올 수 있는 예상 단어 수
 */
export function getEstimatedWordCount(level: CEFRLevel): number {
  const range = LEVEL_RANGES[level]
  if (!range) return 0
  return Math.round((range.end - range.start + 1) * 0.5)
}
