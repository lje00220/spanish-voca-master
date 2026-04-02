'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { Word } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'
import { cn } from '@/lib/utils'

interface QuizProps {
  words: Word[]
}

type AnswerState = 'idle' | 'correct' | 'wrong'

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function getChoices(words: Word[], correctWord: Word): string[] {
  const others = words.filter((w) => w.id !== correctWord.id)
  const wrong = shuffleArray(others)
    .slice(0, 3)
    .map((w) => w.korean)
  return shuffleArray([correctWord.korean, ...wrong])
}

export function Quiz({ words }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const { addWrongWord } = useVocabularyStore()

  const currentWord = words[currentIndex]

  const choices = useMemo(
    () => (currentWord ? getChoices(words, currentWord) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, words],
  )

  const handleSelect = (choice: string) => {
    if (answerState !== 'idle') return

    const isCorrect = choice === currentWord.korean
    setSelectedChoice(choice)
    setAnswerState(isCorrect ? 'correct' : 'wrong')

    if (isCorrect) {
      setScore((prev) => prev + 1)
    } else {
      addWrongWord(currentWord.id)
    }

    setTimeout(() => {
      if (currentIndex + 1 >= words.length) {
        setIsFinished(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
        setAnswerState('idle')
        setSelectedChoice(null)
      }
    }, 900)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setAnswerState('idle')
    setSelectedChoice(null)
    setIsFinished(false)
  }

  if (words.length < 4 && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">퀴즈를 시작하려면 단어가 4개 이상 필요합니다.</p>
      </div>
    )
  }

  if (isFinished) {
    const total = words.length
    const percent = Math.round((score / total) * 100)
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-8">
        <h2 className="text-2xl font-bold">퀴즈 완료!</h2>
        <Card className="w-full p-8 flex flex-col items-center gap-4">
          <p className="text-5xl font-bold text-primary">{percent}%</p>
          <p className="text-muted-foreground">
            {total}문제 중 <span className="font-semibold text-foreground">{score}개</span> 정답
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{score} 정답</Badge>
            <Badge variant="destructive">{total - score} 오답</Badge>
          </div>
        </Card>
        <Button className="w-full max-w-xs" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4 mr-2" />
          다시 풀기
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{currentIndex + 1}</span> / {words.length}
        </span>
        <Badge variant="secondary">점수 {score}</Badge>
      </div>

      {/* Question card */}
      <Card className="w-full p-8 flex flex-col items-center gap-2 border-2 border-primary/20">
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {currentWord.category}
        </span>
        <h2 className="text-4xl font-bold text-foreground mt-3">{currentWord.spanish}</h2>
        <p className="text-muted-foreground">{currentWord.pronunciation}</p>
      </Card>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice, index) => {
          const isSelected = selectedChoice === choice
          const isCorrectChoice = choice === currentWord.korean

          let variant: 'outline' | 'default' | 'destructive' = 'outline'
          if (answerState !== 'idle') {
            if (isCorrectChoice) variant = 'default'
            else if (isSelected) variant = 'destructive'
          }

          return (
            <Button
              key={`${index}-${choice}`}
              variant={variant}
              className={cn(
                'h-16 text-base font-medium whitespace-normal leading-tight relative',
                answerState !== 'idle' && !isSelected && !isCorrectChoice && 'opacity-40',
              )}
              onClick={() => handleSelect(choice)}
              disabled={answerState !== 'idle'}
            >
              {answerState !== 'idle' && isCorrectChoice && (
                <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary-foreground" />
              )}
              {answerState !== 'idle' && isSelected && !isCorrectChoice && (
                <XCircle className="absolute top-2 right-2 h-4 w-4" />
              )}
              {choice}
            </Button>
          )
        })}
      </div>

      {/* Feedback */}
      {answerState !== 'idle' && (
        <p
          className={cn(
            'text-center text-sm font-medium',
            answerState === 'correct' ? 'text-primary' : 'text-destructive',
          )}
        >
          {answerState === 'correct' ? '정답입니다!' : `오답 — 정답: ${currentWord.korean}`}
        </p>
      )}
    </div>
  )
}
