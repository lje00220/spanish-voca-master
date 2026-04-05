'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval'
import { Word, CEFRLevel } from './words'
import cefrWords from '../data/cefr-words.json'

const idbStorage = createJSONStorage(() => ({
  getItem: (name: string) => idbGet<string>(name).then((v) => v ?? null),
  setItem: (name: string, value: string) => idbSet(name, value),
  removeItem: (name: string) => idbDel(name),
}))

const SET_SIZE = 20

interface VocabularyState {
  words: Word[]
  savedWords: string[]
  wrongWords: string[]
  currentLevel: CEFRLevel | null
  currentSet: number | null
  addWord: (word: Word) => void
  removeWord: (id: string) => void
  toggleSaved: (id: string) => void
  isSaved: (id: string) => boolean
  getSavedWords: () => Word[]
  addWrongWord: (id: string) => void
  removeWrongWord: (id: string) => void
  clearWrongWords: () => void
  getWrongWords: () => Word[]
  getWordsByLevel: (level: CEFRLevel) => Word[]
  getSetWords: (level: CEFRLevel, setIndex: number) => Word[]
  getSetCount: (level: CEFRLevel) => number
  updateWord: (id: string, patch: Partial<Pick<Word, 'pronunciation' | 'example' | 'korean' | 'category'>>) => void
  setCurrentLevel: (level: CEFRLevel | null) => void
  setCurrentSet: (set: number | null) => void
  addWords: (words: Word[]) => void
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      words: cefrWords as Word[],
      savedWords: [],
      wrongWords: [],
      currentLevel: null,
      currentSet: null,
      addWord: (word) =>
        set((state) => ({
          words: [...state.words, word],
        })),
      removeWord: (id) =>
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
          savedWords: state.savedWords.filter((savedId) => savedId !== id),
          wrongWords: state.wrongWords.filter((wrongId) => wrongId !== id),
        })),
      toggleSaved: (id) =>
        set((state) => ({
          savedWords: state.savedWords.includes(id)
            ? state.savedWords.filter((savedId) => savedId !== id)
            : [...state.savedWords, id],
        })),
      isSaved: (id) => get().savedWords.includes(id),
      getSavedWords: () => {
        const state = get()
        return state.words.filter((w) => state.savedWords.includes(w.id))
      },
      addWrongWord: (id) =>
        set((state) => ({
          wrongWords: state.wrongWords.includes(id) ? state.wrongWords : [...state.wrongWords, id],
        })),
      removeWrongWord: (id) =>
        set((state) => ({
          wrongWords: state.wrongWords.filter((wrongId) => wrongId !== id),
        })),
      clearWrongWords: () => set({ wrongWords: [] }),
      getWrongWords: () => {
        const state = get()
        return state.words.filter((w) => state.wrongWords.includes(w.id))
      },
      getWordsByLevel: (level) => {
        return get().words.filter((w) => w.level === level)
      },
      getSetWords: (level, setIndex) => {
        const levelWords = get().words.filter((w) => w.level === level)
        // setIndex가 있는 단어(API)는 필터링, 없는 단어(A1 정적)는 위치 기반
        const hasSetIndex = levelWords.some((w) => w.setIndex !== undefined)
        if (hasSetIndex) {
          return levelWords.filter((w) => w.setIndex === setIndex)
        }
        const start = setIndex * SET_SIZE
        return levelWords.slice(start, start + SET_SIZE)
      },
      getSetCount: (level) => {
        const levelWords = get().words.filter((w) => w.level === level)
        return Math.floor(levelWords.length / SET_SIZE)
      },
      setCurrentLevel: (level) => set({ currentLevel: level, currentSet: null }),
      setCurrentSet: (setNum) => set({ currentSet: setNum }),
      addWords: (newWords) =>
        set((state) => {
          const existingIds = new Set(state.words.map((w) => w.id))
          const unique = newWords.filter((w) => !existingIds.has(w.id))
          return { words: [...state.words, ...unique] }
        }),
      updateWord: (id, patch) =>
        set((state) => ({
          words: state.words.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),
    }),
    {
      name: 'vocabulary-storage',
      storage: idbStorage,
      version: 1,
      migrate: (persistedState, fromVersion) => {
        if (fromVersion === 0) {
          const state = persistedState as Partial<VocabularyState>
          if (state.words) {
            state.words = state.words.map((w) => ({ ...w, level: w.level ?? ('A1' as CEFRLevel) }))
          }
        }
        return persistedState as VocabularyState
      },
    },
  ),
)
