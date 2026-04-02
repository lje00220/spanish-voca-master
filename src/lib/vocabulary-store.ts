'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Word, initialWords } from './words'

interface VocabularyState {
  words: Word[]
  savedWords: string[]
  wrongWords: string[]
  addWord: (word: Word) => void
  removeWord: (id: string) => void
  toggleSaved: (id: string) => void
  isSaved: (id: string) => boolean
  getSavedWords: () => Word[]
  addWrongWord: (id: string) => void
  removeWrongWord: (id: string) => void
  clearWrongWords: () => void
  getWrongWords: () => Word[]
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      words: initialWords,
      savedWords: [],
      wrongWords: [],
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
          wrongWords: state.wrongWords.includes(id)
            ? state.wrongWords
            : [...state.wrongWords, id],
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
    }),
    {
      name: 'vocabulary-storage',
    },
  ),
)
