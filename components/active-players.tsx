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
      setCount((c) => {
        const jitter = (Math.random() - 0.5) * 24
        const pullToBase = (BASE - c) * 0.2
        const delta = Math.round(jitter + pullToBase)
        return c + (delta === 0 ? (Math.random() < 0.5 ? -1 : 1) : delta)
      })
    }, 2500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className={cn('flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase', className)} aria-live="polite">
      <span className="blink size-2.5 bg-human" aria-hidden />
      <span>
        <Counter value={count} className="font-bold tabular-nums" /> online
      </span>
    </div>
  )
}
