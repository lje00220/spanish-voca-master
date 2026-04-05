'use client'

import { useState } from 'react'
import { Flashcard } from '@/components/flashcard'
import { Quiz } from '@/components/quiz'
import { SavedWords } from '@/components/saved-words'
import { BottomNav, TabType } from '@/components/bottom-nav'

const TAB_TITLES: Record<TabType, string> = {
  flashcard: '플래시카드',
  quiz: '퀴즈',
  saved: '보관함',
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('flashcard')
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Da-Voca</span>
          <span className="text-sm font-medium text-muted-foreground">{TAB_TITLES[activeTab]}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 pb-24">
        {activeTab === 'flashcard' && <Flashcard />}
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'saved' && <SavedWords />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
