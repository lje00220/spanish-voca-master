'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, BookX, Trash2 } from 'lucide-react'
import { Word } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'

function WordList({
  words,
  onRemove,
  emptyMessage,
}: {
  words: Word[]
  onRemove: (id: string) => void
  emptyMessage: string
}) {
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {words.map((word) => (
        <Card key={word.id} className="p-4 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{word.spanish}</span>
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
      ))}
    </div>
  )
}

export function SavedWords() {
  const { getSavedWords, getWrongWords, toggleSaved, removeWrongWord, clearWrongWords } =
    useVocabularyStore()

  const savedWords = getSavedWords()
  const wrongWords = getWrongWords()

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="saved">
        <TabsList className="w-full mb-4">
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
