'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'
import { Word, CEFRLevel } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'
import { fetchSet, getSetCount, getEstimatedWordCount } from '@/lib/word-api'
import { cn } from '@/lib/utils'

export const LEVELS: { level: CEFRLevel; label: string; bg: string; text: string }[] = [
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

export function LevelSelect({ onSelect }: { onSelect: (level: CEFRLevel) => void }) {
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

export function SetSelect({
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
  const isStatic = level === 'A1'

  useEffect(() => {
    if (!isStatic) {
      setLoading(true)
      getSetCount(level)
        .then(setApiSetCount)
        .finally(() => setLoading(false))
    }
  }, [level, isStatic])

  const totalSets = isStatic ? localSetCount : (apiSetCount ?? 0)

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
            const setWords = store.getSetWords(level, i)
            const isDownloaded = setWords.length > 0
            const startNum = i * 20 + 1
            const endNum = startNum + (setWords?.length || 20) - 1

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

export function SetLoader({
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
  const cancelledRef = useRef(false)

  const handleLoad = async () => {
    setLoading(true)
    setError(null)

    try {
      const words = await fetchSet(level, setIndex, (current, total) => {
        if (!cancelledRef.current) setProgress({ current, total })
      })
      if (!cancelledRef.current) onComplete(words)
    } catch {
      if (!cancelledRef.current) setError('단어를 불러오는 데 실패했습니다. 다시 시도해주세요.')
    } finally {
      if (!cancelledRef.current) setLoading(false)
    }
  }

  useEffect(() => {
    handleLoad()
    return () => {
      cancelledRef.current = true
    }
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
