'use client'

import { useEffect, useState } from 'react'
import { Counter } from '@/components/counter'
import { cn } from '@/lib/utils'

// Placeholder until presence is wired to a backend: drifts gently so it reads as live.
const BASE = 1_248

export function ActivePlayers({ className }: { className?: string }) {
  const [count, setCount] = useState(BASE)

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((c) => Math.max(900, c + Math.round((Math.random() - 0.45) * 14)))
    }, 3500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className={cn('glass flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2.5 text-sm', className)} aria-live="polite">
      <span className="relative flex size-2.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-human/70" />
        <span className="relative size-2.5 rounded-full bg-human" />
      </span>
      <Counter value={count} className="font-semibold tabular-nums" />
      <span className="text-muted-foreground">in the game</span>
    </div>
  )
}
