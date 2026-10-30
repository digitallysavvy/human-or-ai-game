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
    <section className="glass flex w-full max-w-3xl flex-col gap-5 rounded-2xl p-5 sm:p-6" aria-label="Your record">
      <div className="grid grid-cols-3 divide-x divide-border">
        <Stat label="Calls" value={stats.rounds} />
        <Stat label="Accuracy" value={accuracy} suffix="%" dim={stats.rounds === 0} />
        <Stat label="Best streak" value={stats.bestStreak} glow={stats.bestStreak >= 3} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-label="Recent calls">
          {stats.history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No calls yet. Scores save on this device.</p>
          ) : (
            stats.history.slice(0, 12).reverse().map((r) => (
              <span
                key={r.roundId}
                title={`${r.partnerName} was ${r.actual === 'human' ? 'human' : 'AI'} — you ${r.correct ? 'called it' : 'missed'}`}
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border transition-transform hover:scale-125',
                  r.actual === 'human' ? 'text-human' : 'text-bot',
                  r.correct ? 'border-current bg-current/15' : 'border-dashed border-current/50 opacity-60',
                )}
              >
                {r.actual === 'human' ? <UserRound className="size-3.5" aria-hidden /> : <Bot className="size-3.5" aria-hidden />}
              </span>
            ))
          )}
        </div>
        {stats.rounds > 0 && (
          <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={resetStats}>
            Reset
          </Button>
        )}
      </div>
    </section>
  )
}

function Stat({ label, value, suffix, dim, glow }: { label: string; value: number; suffix?: string; dim?: boolean; glow?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <Counter
        value={value}
        suffix={suffix}
        className={cn('text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl', dim && 'text-muted-foreground/50', glow && 'text-glow-primary text-primary')}
      />
      <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{label}</span>
    </div>
  )
}
