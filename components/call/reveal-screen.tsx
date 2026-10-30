'use client'

import { motion } from 'motion/react'
import { ArrowRight, Bot, Flame, UserRound, X } from 'lucide-react'
import { Confetti } from '@/components/confetti'
import { Button } from '@/components/ui/button'
import type { Reveal } from '@/lib/types'
import { cn } from '@/lib/utils'

const CONFETTI_COLORS = ['oklch(0.74 0.19 300)', 'oklch(0.84 0.13 200)', 'oklch(0.76 0.17 40)', 'oklch(0.97 0.006 290)']

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
    <section className={cn('flex flex-1 flex-col items-center justify-center gap-8 py-8 text-center', !reveal.correct && 'shake')} aria-live="assertive">
      {reveal.correct && <Confetti colors={CONFETTI_COLORS} />}

      <div className="flex flex-col items-center gap-3">
        <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">{reveal.partnerName} was</p>
        <motion.div
          initial={{ scale: 2.6, rotate: -18, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, rotate: isHuman ? -4 : 3, opacity: 1, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.9 }}
          className={cn(
            'flex items-center gap-4 rounded-2xl border-4 px-8 py-3 text-7xl font-bold tracking-[-0.04em] uppercase sm:text-8xl',
            isHuman ? 'border-human text-human glow-human' : 'border-bot text-bot glow-bot',
          )}
        >
          {isHuman ? <UserRound className="size-14 sm:size-20" aria-hidden /> : <Bot className="size-14 sm:size-20" aria-hidden />}
          {isHuman ? 'Human' : 'AI'}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-semibold',
            reveal.correct ? 'bg-primary text-primary-foreground' : 'bg-destructive/15 text-destructive',
          )}
        >
          {reveal.correct ? 'You called it.' : `You said ${reveal.guess === 'human' ? 'human' : 'AI'}. Fooled.`}
        </motion.p>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-lg font-serif text-xl leading-snug text-pretty text-muted-foreground italic sm:text-2xl"
      >
        {reveal.tell}
      </motion.p>

      {streak >= 2 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-glow-primary flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <Flame className="size-4" aria-hidden />
          {streak} in a row
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex w-full max-w-sm flex-col items-center gap-3"
      >
        <button
          type="button"
          onClick={onNext}
          className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-base font-semibold text-primary-foreground transition-transform outline-none hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-primary/40 active:scale-95"
        >
          <span
            className="absolute inset-y-0 left-0 bg-primary-foreground/15 transition-[width] duration-1000 ease-linear"
            style={{ width: `${((6 - secondsToNext) / 6) * 100}%` }}
            aria-hidden
          />
          <ArrowRight className="relative size-5" aria-hidden />
          <span className="relative">Next connection in {secondsToNext}s</span>
        </button>
        <Button variant="ghost" onClick={onEnd} className="text-muted-foreground">
          <X data-icon="inline-start" aria-hidden />
          Done for tonight
        </Button>
      </motion.div>
    </section>
  )
}
