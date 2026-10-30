'use client'

import { motion } from 'motion/react'
import { ArrowLeft, Bot, Check, UserRound, X } from 'lucide-react'
import { Counter } from '@/components/counter'
import { useStats } from '@/lib/local-store'
import type { RoundResult } from '@/lib/types'
import { cn } from '@/lib/utils'

export function SessionSummary({ results, onBackToLobby }: { results: RoundResult[]; onBackToLobby: () => void }) {
  const { stats } = useStats()
  const correct = results.filter((r) => r.correct).length
  const accuracy = results.length ? Math.round((correct / results.length) * 100) : 0
  const allTime = stats.rounds ? Math.round((stats.correct / stats.rounds) * 100) : 0
  const headline =
    results.length === 0 ? 'Quiet night.' : accuracy >= 70 ? 'Sharp ear.' : accuracy >= 40 ? 'Not bad.' : 'They got you.'

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-10 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs tracking-[0.28em] text-primary uppercase">Line closed</p>
        <h1 className="font-serif text-6xl tracking-tight italic sm:text-8xl">{headline}</h1>
        <p className="text-muted-foreground">
          {results.length === 0 ? 'You left before anyone connected.' : `${correct} of ${results.length} called correctly tonight.`}
        </p>
      </div>

      <dl className="glass grid w-full max-w-2xl grid-cols-3 divide-x divide-border rounded-2xl p-6">
        <Stat label="Tonight" value={accuracy} suffix="%" />
        <Stat label="All time" value={allTime} suffix="%" />
        <Stat label="Best streak" value={stats.bestStreak} glow={stats.bestStreak >= 3} />
      </dl>

      {results.length > 0 && (
        <ol className="flex w-full max-w-2xl flex-wrap justify-center gap-3">
          {[...results].reverse().map((r, i) => (
            <motion.li
              key={r.roundId}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'glass flex items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5 text-sm',
                r.correct ? '' : 'opacity-70',
              )}
            >
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full',
                  r.actual === 'human' ? 'bg-human/20 text-human' : 'bg-bot/20 text-bot',
                )}
              >
                {r.actual === 'human' ? <UserRound className="size-4" aria-hidden /> : <Bot className="size-4" aria-hidden />}
              </span>
              <span className="font-medium">{r.partnerName}</span>
              {r.correct ? <Check className="size-4 text-human" aria-label="Correct" /> : <X className="size-4 text-destructive" aria-label="Wrong" />}
            </motion.li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={onBackToLobby}
        className="flex h-14 items-center gap-3 rounded-full bg-primary pr-8 pl-3 text-base font-semibold text-primary-foreground glow-primary transition-transform outline-none hover:scale-[1.03] focus-visible:ring-4 focus-visible:ring-primary/40 active:scale-95"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15">
          <ArrowLeft className="size-4" aria-hidden />
        </span>
        Back to lobby
      </button>
    </section>
  )
}

function Stat({ label, value, suffix, glow }: { label: string; value: number; suffix?: string; glow?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <dd className={cn('text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl', glow && 'text-glow-primary text-primary')}>
        <Counter value={value} suffix={suffix} />
      </dd>
      <dt className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{label}</dt>
    </div>
  )
}
