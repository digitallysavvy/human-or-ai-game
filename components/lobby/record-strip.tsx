'use client'

import { Bot, UserRound } from 'lucide-react'
import { Counter } from '@/components/counter'
import { Button } from '@/components/ui/button'
import { useStats } from '@/lib/local-store'
import { cn } from '@/lib/utils'

export function RecordStrip() {
  const { stats, resetStats } = useStats()
  const accuracy = stats.rounds ? Math.round((stats.correct / stats.rounds) * 100) : 0

  return (
    <section className="flex flex-col" aria-label="Your record">
      <div className="grid grid-cols-3 divide-x-2 divide-foreground border-b-2 border-foreground">
        <Stat label="Rounds" value={stats.rounds} />
        <Stat label="Accuracy" value={accuracy} suffix="%" dim={stats.rounds === 0} />
        <Stat label="Best streak" value={stats.bestStreak} hot={stats.bestStreak >= 3} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-1.5" aria-label="Recent rounds">
          {stats.history.length === 0 ? (
            <p className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">No rounds yet. Scores save on this device.</p>
          ) : (
            stats.history.slice(0, 12).reverse().map((r) => (
              <span
                key={r.roundId}
                title={`${r.partnerName} was ${r.actual === 'human' ? 'human' : 'AI'} — you ${r.correct ? 'called it' : 'missed'}`}
                className={cn(
                  'flex size-8 items-center justify-center border-2 transition-transform hover:-translate-y-0.5',
                  r.actual === 'human' ? 'border-human text-human' : 'border-bot text-bot',
                  r.correct ? (r.actual === 'human' ? 'bg-human text-human-foreground' : 'bg-bot text-bot-foreground') : 'border-dashed',
                )}
              >
                {r.actual === 'human' ? <UserRound className="size-4" aria-hidden /> : <Bot className="size-4" aria-hidden />}
              </span>
            ))
          )}
        </div>
        {stats.rounds > 0 && (
          <Button variant="outline" size="xs" onClick={resetStats}>
            Reset
          </Button>
        )}
      </div>
    </section>
  )
}

function Stat({ label, value, suffix, dim, hot }: { label: string; value: number; suffix?: string; dim?: boolean; hot?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-1 px-5 py-5 sm:px-8', hot && 'bg-foreground text-background')}>
      <span className={cn('font-mono text-[11px] tracking-[0.25em] uppercase', hot ? 'text-background/70' : 'text-muted-foreground')}>{label}</span>
      <Counter
        value={value}
        suffix={suffix}
        className={cn('text-4xl font-black tracking-tighter tabular-nums sm:text-6xl', dim && 'text-muted-foreground/50')}
      />
    </div>
  )
}
