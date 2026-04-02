import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { type ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Da-Voca - 스페인어 단어장',
  description: '플래시카드와 퀴즈로 스페인어 단어를 쉽게 암기하세요',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ko" className={`${geistSans.className} ${geistMono.className}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
