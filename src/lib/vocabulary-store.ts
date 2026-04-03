'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Word, CEFRLevel } from './words'
import cefrWords from '../data/cefr-words.json'

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
  setCurrentLevel: (level: CEFRLevel | null) => void
  setCurrentSet: (set: number | null) => void
  addWords: (words: Word[]) => void
  hasLevel: (level: CEFRLevel) => boolean
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
        set((state) => ({
          words: [...state.words, ...newWords],
        })),
      hasLevel: (level) => get().words.some((w) => w.level === level),
    }),
    {
      name: 'vocabulary-storage',
    },
  ),
)
