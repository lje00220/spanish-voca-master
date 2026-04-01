'use client'

import { Layers, Brain, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabType = 'flashcard' | 'quiz' | 'saved'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const navItems = [
  {
    id: 'flashcard' as const,
    label: '플래시카드',
    icon: Layers,
  },
  {
    id: 'quiz' as const,
    label: '퀴즈',
    icon: Brain,
  },
  {
    id: 'saved' as const,
    label: '보관함',
    icon: Bookmark,
  },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className={cn('h-6 w-6 mb-1 transition-all', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
