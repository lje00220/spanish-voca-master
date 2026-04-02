'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Volume2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { Word } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'
import { cn } from '@/lib/utils'

interface FlashcardProps {
  words: Word[]
}

export function Flashcard({ words }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const { toggleSaved, isSaved } = useVocabularyStore()

  const currentWord = words[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.spanish)
      utterance.lang = 'es-ES'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">단어가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{currentIndex + 1}</span>
        <span>/</span>
        <span>{words.length}</span>
      </div>

      {/* Card */}
      <div
        className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-500 transform-style-preserve-3d',
            isFlipped && 'rotate-y-180',
          )}
        >
          {/* Front */}
          <Card className="absolute inset-0 backface-hidden bg-card border-2 border-primary/20 shadow-lg flex flex-col items-center justify-center p-6">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={(e) => {
                  e.stopPropagation()
                  speakWord()
                }}
              >
                <Volume2 className="h-5 w-5 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSaved(currentWord.id)
                }}
              >
                <Heart
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isSaved(currentWord.id)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground',
                  )}
                />
              </Button>
            </div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              {currentWord.category}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2 text-center">
              {currentWord.spanish}
            </h2>
            <p className="text-lg text-muted-foreground">{currentWord.pronunciation}</p>
            <p className="absolute bottom-6 text-sm text-muted-foreground">탭하여 뒤집기</p>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-primary to-primary/80 border-0 shadow-lg flex flex-col items-center justify-center p-6 text-primary-foreground">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              {currentWord.korean}
            </h2>
            <p className="text-lg opacity-90 mb-6">{currentWord.pronunciation}</p>
            <div className="bg-white/20 rounded-xl p-4 w-full">
              <p className="text-sm font-medium mb-1">예문</p>
              <p className="text-base">{currentWord.example}</p>
            </div>
            <p className="absolute bottom-6 text-sm opacity-70">탭하여 뒤집기</p>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => {
            setIsFlipped(false)
            setCurrentIndex(0)
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
