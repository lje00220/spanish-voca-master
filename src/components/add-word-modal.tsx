'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Wand2 } from 'lucide-react'
import { CEFRLevel } from '@/lib/words'
import { useVocabularyStore } from '@/lib/vocabulary-store'
import { translateSingleWord, fetchWordDetail } from '@/lib/word-api'
import { LEVELS } from '@/components/level-set-select'
import { cn } from '@/lib/utils'

interface AddWordModalProps {
  open: boolean
  onClose: () => void
}

export function AddWordModal({ open, onClose }: AddWordModalProps) {
  const { addWord } = useVocabularyStore()
  const [spanish, setSpanish] = useState('')
  const [korean, setKorean] = useState('')
  const [pronunciation, setPronunciation] = useState('')
  const [example, setExample] = useState('')
  const [level, setLevel] = useState<CEFRLevel>('A1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAutoFill = async () => {
    if (!spanish.trim()) return
    setLoading(true)
    setError(null)
    try {
      const [translatedKorean, detail] = await Promise.all([
        translateSingleWord(spanish.trim()),
        fetchWordDetail(spanish.trim()),
      ])
      setKorean(translatedKorean)
      if (detail.pronunciation) setPronunciation(detail.pronunciation)
      if (detail.example) setExample(detail.example)
    } catch {
      setError('번역에 실패했습니다. 직접 입력해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!spanish.trim() || !korean.trim()) return
    addWord({
      id: `custom-${Date.now()}`,
      spanish: spanish.trim(),
      korean: korean.trim(),
      pronunciation: pronunciation.trim(),
      example: example.trim(),
      category: '',
      level,
    })
    handleClose()
  }

  const handleClose = () => {
    setSpanish('')
    setKorean('')
    setPronunciation('')
    setExample('')
    setLevel('A1')
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>단어 추가</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {/* 스페인어 + 자동 채우기 */}
          <div className="flex flex-col gap-1.5">
            <Label>스페인어</Label>
            <div className="flex gap-2">
              <Input
                placeholder="예: hablar"
                value={spanish}
                onChange={(e) => setSpanish(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleAutoFill()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAutoFill}
                disabled={!spanish.trim() || loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              </Button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* 한국어 */}
          <div className="flex flex-col gap-1.5">
            <Label>한국어</Label>
            <Input
              placeholder="번역 또는 직접 입력"
              value={korean}
              onChange={(e) => setKorean(e.target.value)}
            />
          </div>

          {/* 발음 */}
          <div className="flex flex-col gap-1.5">
            <Label>발음 <span className="text-muted-foreground text-xs">(선택)</span></Label>
            <Input
              placeholder="예: /aˈβlaɾ/"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
            />
          </div>

          {/* 예문 */}
          <div className="flex flex-col gap-1.5">
            <Label>예문 <span className="text-muted-foreground text-xs">(선택)</span></Label>
            <Input
              placeholder="예: Yo hablo español."
              value={example}
              onChange={(e) => setExample(e.target.value)}
            />
          </div>

          {/* 레벨 선택 */}
          <div className="flex flex-col gap-1.5">
            <Label>레벨</Label>
            <div className="flex gap-2">
              {LEVELS.map(({ level: lvl, text, bg }) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors',
                    level === lvl ? cn(bg, text) : 'bg-muted text-muted-foreground',
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 저장 버튼 */}
          <Button
            onClick={handleSave}
            disabled={!spanish.trim() || !korean.trim()}
            className="w-full mt-2"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
