'use client'

import { Bot, Check, PhoneCall, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStats } from '@/lib/local-store'
import type { RoundResult } from '@/lib/types'
import { cn } from '@/lib/utils'

export function SessionSummary({ results, onBackToLobby }: { results: RoundResult[]; onBackToLobby: () => void }) {
  const { stats } = useStats()
  const correct = results.filter((r) => r.correct).length
  const accuracy = results.length ? Math.round((correct / results.length) * 100) : 0

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Line closed</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {results.length === 0 ? 'Quiet night.' : accuracy >= 70 ? 'Sharp ear.' : accuracy >= 40 ? 'Not bad.' : 'They got you.'}
        </h1>
        <p className="text-muted-foreground">
          {results.length === 0
            ? 'You hung up before anyone picked up.'
            : `${correct} of ${results.length} called correctly this session.`}
        </p>
      </div>

      <dl className="grid w-full max-w-lg grid-cols-3 gap-3">
        <Stat label="This session" value={`${accuracy}%`} />
        <Stat label="All time" value={stats.rounds ? `${Math.round((stats.correct / stats.rounds) * 100)}%` : '—'} />
        <Stat label="Best streak" value={String(stats.bestStreak)} />
      </dl>

      {results.length > 0 && (
        <ol className="flex w-full max-w-lg flex-col divide-y rounded-2xl border bg-card">
          {results.map((r) => (
            <li key={r.roundId} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full',
                  r.actual === 'human' ? 'bg-human/15 text-human' : 'bg-bot/15 text-bot',
                )}
              >
                {r.actual === 'human' ? <UserRound className="size-4" aria-hidden /> : <Bot className="size-4" aria-hidden />}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="font-medium">{r.partnerName}</span>
                <span className="text-xs text-muted-foreground">
                  was {r.actual === 'human' ? 'human' : 'AI'} · you said {r.guess === 'human' ? 'human' : 'AI'}
                </span>
              </div>
              {r.correct ? (
                <Check className="size-4 text-human" aria-label="Correct" />
              ) : (
                <X className="size-4 text-destructive" aria-label="Wrong" />
              )}
            </li>
          ))}
        </ol>
      )}

      <Button size="lg" className="h-12 px-8" onClick={onBackToLobby}>
        <PhoneCall data-icon="inline-start" aria-hidden />
        Back to lobby
      </Button>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-card p-4 text-center">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-mono text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
