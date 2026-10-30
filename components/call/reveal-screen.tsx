'use client'

import { Bot, Flame, PhoneForwarded, PhoneOff, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Reveal } from '@/lib/types'
import { cn } from '@/lib/utils'

export function RevealScreen({
  reveal,
  streak,
  secondsToNext,
  onNext,
  onEnd,
}: {
  reveal: Reveal
  streak: number
  secondsToNext: number
  onNext: () => void
  onEnd: () => void
}) {
  const isHuman = reveal.actual === 'human'

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 py-8 text-center" aria-live="assertive">
      <div className="flex flex-col items-center gap-4">
        <span
          className={cn(
            'flex size-24 items-center justify-center rounded-full',
            isHuman ? 'bg-human/15 text-human' : 'bg-bot/15 text-bot',
          )}
        >
          {isHuman ? <UserRound className="size-12" aria-hidden /> : <Bot className="size-12" aria-hidden />}
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{reveal.partnerName} was</p>
          <h1
            className={cn(
              'text-6xl font-semibold tracking-tight sm:text-7xl',
              isHuman ? 'text-human' : 'text-bot',
            )}
          >
            {isHuman ? 'Human' : 'AI'}
          </h1>
        </div>
        <p
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium',
            reveal.correct ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive',
          )}
        >
          {reveal.correct ? 'You called it.' : `You said ${reveal.guess === 'human' ? 'human' : 'AI'}. Fooled.`}
        </p>
      </div>

      <p className="max-w-md text-pretty text-muted-foreground">{reveal.tell}</p>

      {streak >= 2 && (
        <p className="flex items-center gap-2 font-mono text-sm text-primary">
          <Flame className="size-4" aria-hidden />
          {streak} in a row
        </p>
      )}

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button size="lg" className="h-12" onClick={onNext}>
          <PhoneForwarded data-icon="inline-start" aria-hidden />
          Next caller in {secondsToNext}s — go now
        </Button>
        <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full bg-primary transition-[width] duration-1000 ease-linear"
            style={{ width: `${(secondsToNext / 6) * 100}%` }}
          />
        </div>
        <Button variant="ghost" onClick={onEnd}>
          <PhoneOff data-icon="inline-start" aria-hidden />
          Hang up for the night
        </Button>
      </div>
    </section>
  )
}
