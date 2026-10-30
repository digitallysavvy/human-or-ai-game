'use client'

import { Bot, Check, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStats } from '@/lib/local-store'
import { cn } from '@/lib/utils'

export function StatsPanel() {
  const { stats, resetStats } = useStats()
  const accuracy = stats.rounds ? Math.round((stats.correct / stats.rounds) * 100) : null

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Your record</h2>
        <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Saved on this device</span>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Calls" value={String(stats.rounds)} />
        <Stat label="Accuracy" value={accuracy === null ? '—' : `${accuracy}%`} />
        <Stat label="Best streak" value={String(stats.bestStreak)} accent={stats.bestStreak >= 3} />
      </dl>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium text-muted-foreground">Recent calls</h3>
        {stats.history.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            No calls yet. Your first caller is waiting.
          </p>
        ) : (
          <ul className="flex flex-col divide-y rounded-lg border">
            {stats.history.slice(0, 6).map((r) => (
              <li key={r.roundId} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full',
                    r.actual === 'human' ? 'bg-human/15 text-human' : 'bg-bot/15 text-bot',
                  )}
                  aria-label={r.actual === 'human' ? 'Human' : 'AI'}
                >
                  {r.actual === 'human' ? <UserRound className="size-3.5" /> : <Bot className="size-3.5" />}
                </span>
                <span className="flex-1 truncate">{r.partnerName}</span>
                <span className="text-xs text-muted-foreground">you said {r.guess === 'human' ? 'human' : 'AI'}</span>
                {r.correct ? (
                  <Check className="size-4 text-human" aria-label="Correct" />
                ) : (
                  <X className="size-4 text-destructive" aria-label="Wrong" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {stats.rounds > 0 && (
        <Button variant="ghost" size="sm" className="self-start text-muted-foreground" onClick={resetStats}>
          Reset record
        </Button>
      )}
    </aside>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn('font-mono text-2xl font-semibold tabular-nums', accent && 'text-primary')}>{value}</dd>
    </div>
  )
}
