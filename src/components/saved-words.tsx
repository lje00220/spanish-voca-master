'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, BookX, Trash2, Plus } from 'lucide-react'
import { Word, CEFRLevel } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'
import { AddWordModal } from '@/components/add-word-modal'
import { cn } from '@/lib/utils'

const LEVEL_BADGE: Record<CEFRLevel, { label: string; className: string }> = {
  A1: { label: 'A1', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  A2: { label: 'A2', className: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
  B1: { label: 'B1', className: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' },
  B2: { label: 'B2', className: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
  C1: { label: 'C1', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  C2: { label: 'C2', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
}

const FILTER_LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2']

function WordList({
  words,
  onRemove,
  emptyMessage,
}: {
  words: Word[]
  onRemove: (id: string) => void
  emptyMessage: string
}) {
  const [filter, setFilter] = useState<CEFRLevel | 'all'>('all')

  const filtered = filter === 'all' ? words : words.filter((w) => w.level === filter)

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 레벨 필터 */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              filter === lvl
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {lvl === 'all' ? '전체' : lvl}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">{filter} 단어가 없습니다.</p>
        </div>
      ) : (
        filtered.map((word) => {
          const badge = LEVEL_BADGE[word.level]
          return (
            <Card key={word.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{word.spanish}</span>
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full shrink-0', badge.className)}>
                    {badge.label}
                  </span>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {word.category}
                  </Badge>
                </div>
                <span className="text-muted-foreground text-sm">{word.korean}</span>
                <span className="text-muted-foreground text-xs">{word.pronunciation}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(word.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          )
        })
      )}
    </div>
  )
}

export function SavedWords() {
  const { getSavedWords, getWrongWords, toggleSaved, removeWrongWord, clearWrongWords } =
    useVocabularyStore()
  const [modalOpen, setModalOpen] = useState(false)

  const savedWords = getSavedWords()
  const wrongWords = getWrongWords()

  return (
    <div className="w-full max-w-md mx-auto">
      <AddWordModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Tabs defaultValue="saved">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex-1">

          <TabsTrigger value="saved" className="flex-1 gap-2">
            <Heart className="h-4 w-4" />
            북마크
            {savedWords.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                {savedWords.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="wrong" className="flex-1 gap-2">
            <BookX className="h-4 w-4" />
            오답 노트
            {wrongWords.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0">
                {wrongWords.length}
              </Badge>
            )}
          </TabsTrigger>
          </TabsList>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 ml-2 shrink-0"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="saved">
          <WordList
            words={savedWords}
            onRemove={toggleSaved}
            emptyMessage="북마크한 단어가 없습니다."
          />
        </TabsContent>

        <TabsContent value="wrong">
          {wrongWords.length > 0 && (
            <div className="flex justify-end mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground text-xs"
                onClick={clearWrongWords}
              >
                전체 지우기
              </Button>
            </div>
          )}
          <WordList
            words={wrongWords}
            onRemove={removeWrongWord}
            emptyMessage="오답 단어가 없습니다."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
