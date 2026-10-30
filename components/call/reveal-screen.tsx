'use client'

import { motion } from 'motion/react'
import { ArrowRight, Bot, Flame, UserRound, X } from 'lucide-react'
import { Confetti } from '@/components/confetti'
import { Button } from '@/components/ui/button'
import type { Reveal } from '@/lib/types'
import { cn } from '@/lib/utils'

const CONFETTI_COLORS = ['oklch(0.17 0 0)', 'oklch(0.5 0.22 262)', 'oklch(0.58 0.23 28)']

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

      <div className="flex flex-col items-center gap-4">
        <p className="font-mono text-xs tracking-[0.3em] uppercase">{reveal.partnerName} was</p>
        <motion.div
          initial={{ scale: 2.2, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: isHuman ? -3 : 2, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 24, mass: 0.8 }}
          className={cn(
            'flex items-center gap-4 border-4 px-8 py-3 text-7xl font-black tracking-[-0.05em] uppercase sm:text-8xl',
            isHuman ? 'border-human bg-human text-human-foreground brut-shadow' : 'border-bot bg-bot text-bot-foreground brut-shadow',
          )}
        >
          {isHuman ? <UserRound className="size-14 sm:size-20" aria-hidden /> : <Bot className="size-14 sm:size-20" aria-hidden />}
          {isHuman ? 'Human' : 'AI'}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'border-2 px-4 py-1.5 font-mono text-sm font-bold tracking-[0.2em] uppercase',
            reveal.correct ? 'border-foreground bg-foreground text-background' : 'border-destructive text-destructive',
          )}
        >
          {reveal.correct ? 'You called it.' : `You said ${reveal.guess === 'human' ? 'human' : 'AI'}. Fooled.`}
        </motion.p>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="max-w-lg text-xl leading-snug font-bold tracking-tight text-pretty sm:text-2xl"
      >
        {reveal.tell}
      </motion.p>

      {streak >= 2 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, type: 'spring' }}
          className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.2em] uppercase"
        >
          <Flame className="size-4" aria-hidden />
          {streak} in a row
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex w-full max-w-sm flex-col items-center gap-4"
      >
        <button
          type="button"
          onClick={onNext}
          className="btn-brut relative flex h-14 w-full items-center justify-between overflow-hidden bg-foreground px-5 text-lg font-black tracking-tight text-background uppercase outline-none focus-visible:ring-4 focus-visible:ring-ring"
        >
          <span
            className="absolute inset-y-0 left-0 bg-background/20 transition-[width] duration-1000 ease-linear"
            style={{ width: `${((6 - secondsToNext) / 6) * 100}%` }}
            aria-hidden
          />
          <span className="relative">Next in {secondsToNext}s</span>
          <ArrowRight className="relative size-6" aria-hidden />
        </button>
        <Button variant="outline" onClick={onEnd}>
          <X data-icon="inline-start" aria-hidden />
          Done for tonight
        </Button>
      </motion.div>
    </section>
  )
}
