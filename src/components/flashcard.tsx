'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Volume2, ChevronLeft, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react'
import { Word, CEFRLevel } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'
import { LevelSelect, SetSelect, SetLoader } from '@/components/level-set-select'
import { cn } from '@/lib/utils'

// 플래시카드 학습 화면
function FlashcardStudy({
  words,
  onBack,
  level,
  setIndex,
}: {
  words: Word[]
  onBack: () => void
  level: CEFRLevel
  setIndex: number
}) {
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
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {level} · 세트 {setIndex + 1}
        </span>
        <div className="w-8" />
      </div>

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
                    isSaved(currentWord.id) ? 'fill-primary text-primary' : 'text-muted-foreground',
                  )}
                />
              </Button>
            </div>
            {currentWord.category && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                {currentWord.category}
              </span>
            )}
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
            {currentWord.example && (
              <div className="bg-white/20 rounded-xl p-4 w-full">
                <p className="text-sm font-medium mb-1">예문</p>
                <p className="text-base">{currentWord.example}</p>
              </div>
            )}
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

// 메인 플래시카드 컴포넌트
export function Flashcard() {
  const { currentLevel, currentSet, setCurrentLevel, setCurrentSet, getSetWords, addWords } =
    useVocabularyStore()

  // 세트 학습 중
  if (currentLevel && currentSet !== null) {
    const localWords = getSetWords(currentLevel, currentSet)

    // 이미 다운로드된 세트 → 바로 학습
    if (localWords.length > 0) {
      return (
        <FlashcardStudy
          words={localWords}
          level={currentLevel}
          setIndex={currentSet}
          onBack={() => setCurrentSet(null)}
        />
      )
    }

    // 아직 안 받은 세트 → 다운로드 후 학습
    return (
      <SetLoader
        level={currentLevel}
        setIndex={currentSet}
        onBack={() => setCurrentSet(null)}
        onComplete={(words) => {
          addWords(words)
        }}
      />
    )
  }

  // 레벨 선택됨 → 세트 선택
  if (currentLevel) {
    return (
      <SetSelect
        level={currentLevel}
        onSelect={(setIndex) => setCurrentSet(setIndex)}
        onBack={() => setCurrentLevel(null)}
      />
    )
  }

  // 레벨 선택
  return <LevelSelect onSelect={(level) => setCurrentLevel(level)} />
}
