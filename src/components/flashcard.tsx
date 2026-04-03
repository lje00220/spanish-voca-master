'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Heart,
  Volume2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowLeft,
  Download,
  Loader2,
} from 'lucide-react'
import { Word, CEFRLevel } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'
import { fetchSet, getSetCount, getEstimatedWordCount } from '@/lib/word-api'
import { cn } from '@/lib/utils'

const LEVELS: { level: CEFRLevel; label: string; bg: string; text: string }[] = [
  {
    level: 'A1',
    label: '입문',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    level: 'A2',
    label: '초급',
    bg: 'bg-sky-50 dark:bg-sky-950',
    text: 'text-sky-700 dark:text-sky-300',
  },
  {
    level: 'B1',
    label: '중급',
    bg: 'bg-violet-50 dark:bg-violet-950',
    text: 'text-violet-700 dark:text-violet-300',
  },
  {
    level: 'B2',
    label: '중상급',
    bg: 'bg-rose-50 dark:bg-rose-950',
    text: 'text-rose-700 dark:text-rose-300',
  },
]

// 레벨 선택 화면
function LevelSelect({ onSelect }: { onSelect: (level: CEFRLevel) => void }) {
  const { getWordsByLevel } = useVocabularyStore()

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-bold text-center mb-2">레벨을 선택하세요</h2>
      {LEVELS.map(({ level, label, bg, text }) => {
        const wordCount = getWordsByLevel(level).length
        const hasWords = wordCount > 0
        const estimatedCount = getEstimatedWordCount(level)

        return (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={cn(
              'flex items-center gap-4 p-5 rounded-2xl transition-all cursor-pointer',
              hasWords
                ? cn(bg, 'hover:scale-[1.02] hover:shadow-md')
                : 'bg-muted/40 hover:bg-muted/60 hover:scale-[1.02]',
            )}
          >
            <span
              className={cn('text-2xl font-extrabold', hasWords ? text : 'text-muted-foreground')}
            >
              {level}
            </span>
            <div className="flex-1 text-left">
              <p className={cn('font-semibold', hasWords ? text : 'text-muted-foreground')}>
                {label}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasWords ? `${wordCount}개 단어` : `~${estimatedCount}개 불러오기 가능`}
              </p>
            </div>
            {!hasWords && <Download className="h-4 w-4 text-muted-foreground" />}
          </button>
        )
      })}
    </div>
  )
}

// 세트 선택 화면 (A1: 로컬 데이터 / A2~B2: 동적 세트)
function SetSelect({
  level,
  onSelect,
  onBack,
}: {
  level: CEFRLevel
  onSelect: (setIndex: number) => void
  onBack: () => void
}) {
  const store = useVocabularyStore()
  const [apiSetCount, setApiSetCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const localSetCount = store.getSetCount(level)
  const hasLocalData = store.hasLevel(level)

  // A2~B2: Wiktionary에서 세트 수 가져오기
  useEffect(() => {
    if (!hasLocalData) {
      setLoading(true)
      getSetCount(level)
        .then(setApiSetCount)
        .finally(() => setLoading(false))
    }
  }, [level, hasLocalData])

  const totalSets = hasLocalData ? localSetCount : (apiSetCount ?? 0)

  // 이미 다운로드된 세트 수 계산
  const downloadedSetCount = hasLocalData ? localSetCount : 0

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-bold">{level} 세트 선택</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {Array.from({ length: totalSets }, (_, i) => {
            const isDownloaded = i < downloadedSetCount
            const setWords = isDownloaded ? store.getSetWords(level, i) : null
            const startNum = i * 20 + 1
            const endNum = startNum + (setWords?.length ?? 20) - 1

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer',
                  isDownloaded
                    ? 'bg-muted/50 hover:bg-muted hover:scale-[1.01]'
                    : 'bg-muted/30 hover:bg-muted/50 hover:scale-[1.01]',
                )}
              >
                <span className="text-lg font-bold text-primary w-8">{i + 1}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">
                    {startNum}번 ~ {endNum}번
                  </p>
                </div>
                {isDownloaded ? (
                  <span className="text-xs text-muted-foreground">{setWords?.length}개</span>
                ) : (
                  <Download className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// 세트 다운로드 화면
function SetLoader({
  level,
  setIndex,
  onComplete,
  onBack,
}: {
  level: CEFRLevel
  setIndex: number
  onComplete: (words: Word[]) => void
  onBack: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError] = useState<string | null>(null)

  const handleLoad = async () => {
    setLoading(true)
    setError(null)

    try {
      const words = await fetchSet(level, setIndex, (current, total) => {
        setProgress({ current, total })
      })
      onComplete(words)
    } catch {
      setError('단어를 불러오는 데 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 자동 시작
  useEffect(() => {
    handleLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center gap-2 w-full">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack} disabled={loading}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-bold">
          {level} · 세트 {setIndex + 1}
        </h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 w-full py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            번역 중... {progress.current}/{progress.total}
          </p>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%',
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">약 10초 소요</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm text-destructive text-center">{error}</p>
          <Button onClick={handleLoad} variant="outline">
            다시 시도
          </Button>
        </div>
      ) : null}
    </div>
  )
}

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
