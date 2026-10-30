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
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-mono text-xs tracking-[0.3em] uppercase">Session over</p>
        <h1 className="text-6xl font-black tracking-[-0.05em] uppercase sm:text-8xl">{headline}</h1>
        <p className="text-muted-foreground">
          {results.length === 0 ? 'You left before anyone connected.' : `${correct} of ${results.length} called correctly tonight.`}
        </p>
      </div>

      <dl className="brut grid w-full max-w-2xl grid-cols-3 divide-x-2 divide-foreground brut-shadow">
        <Stat label="Tonight" value={accuracy} suffix="%" />
        <Stat label="All time" value={allTime} suffix="%" />
        <Stat label="Best streak" value={stats.bestStreak} hot={stats.bestStreak >= 3} />
      </dl>

      {results.length > 0 && (
        <ol className="flex w-full max-w-2xl flex-wrap justify-center gap-2">
          {[...results].reverse().map((r, i) => (
            <motion.li
              key={r.roundId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn('brut flex items-center gap-3 bg-background py-1.5 pr-3 pl-1.5 font-mono text-xs tracking-wide uppercase', !r.correct && 'border-dashed')}
            >
              <span className={cn('flex size-7 items-center justify-center', r.actual === 'human' ? 'bg-human text-human-foreground' : 'bg-bot text-bot-foreground')}>
                {r.actual === 'human' ? <UserRound className="size-4" aria-hidden /> : <Bot className="size-4" aria-hidden />}
              </span>
              <span className="font-bold">{r.partnerName}</span>
              {r.correct ? <Check className="size-4" aria-label="Correct" /> : <X className="size-4 text-destructive" aria-label="Wrong" />}
            </motion.li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={onBackToLobby}
        className="btn-brut flex h-14 items-center gap-3 bg-foreground px-6 text-lg font-black tracking-tight text-background uppercase outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-5" aria-hidden />
        Back to lobby
      </button>
    </section>
  )
}

function Stat({ label, value, suffix, hot }: { label: string; value: number; suffix?: string; hot?: boolean }) {
  return (
    <div className={cn('flex flex-col items-center gap-1 px-2 py-5', hot && 'bg-foreground text-background')}>
      <dd className="text-4xl font-black tracking-tighter tabular-nums sm:text-6xl">
        <Counter value={value} suffix={suffix} />
      </dd>
      <dt className={cn('font-mono text-[11px] tracking-[0.25em] uppercase', hot ? 'text-background/70' : 'text-muted-foreground')}>{label}</dt>
    </div>
  )
}
