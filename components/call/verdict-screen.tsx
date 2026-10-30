'use client'

import { useEffect } from 'react'
import { Bot, UserRound } from 'lucide-react'
import type { Guess, PublicPartner } from '@/lib/types'
import { cn } from '@/lib/utils'

export function VerdictScreen({
  partner,
  onGuess,
  busy,
}: {
  partner: PublicPartner
  onGuess: (guess: Guess) => void
  busy: boolean
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (busy) return
      if (e.key === 'ArrowLeft') onGuess('ai')
      if (e.key === 'ArrowRight') onGuess('human')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onGuess])

  const color = `oklch(0.78 0.14 ${partner.hue})`

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-10 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">Line closed</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">So. Who was that?</h1>
        <p className="text-muted-foreground">Trust your ear. Use the arrow keys if you&apos;re quick.</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <ChoiceButton
          kind="ai"
          label="AI"
          hint="← too smooth"
          icon={<Bot className="size-10" aria-hidden />}
          onClick={() => onGuess('ai')}
          disabled={busy}
        />

        <div className="order-first flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-8 py-6 sm:order-none">
          <span
            className="flex size-20 items-center justify-center rounded-full bg-background font-mono text-2xl font-semibold"
            style={{ color, boxShadow: `0 0 30px ${color.replace(')', ' / 35%)')}` }}
          >
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="text-center">
            <p className="text-lg font-semibold">{partner.name}</p>
            <p className="text-sm text-muted-foreground">{partner.vibe}</p>
          </div>
        </div>

        <ChoiceButton
          kind="human"
          label="Human"
          hint="messy enough →"
          icon={<UserRound className="size-10" aria-hidden />}
          onClick={() => onGuess('human')}
          disabled={busy}
        />
      </div>
    </section>
  )
}

function ChoiceButton({
  kind,
  label,
  hint,
  icon,
  onClick,
  disabled,
}: {
  kind: Guess
  label: string
  hint: string
  icon: React.ReactNode
  onClick: () => void
  disabled: boolean
}) {
  const isHuman = kind === 'human'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border-2 p-8 transition-all outline-none focus-visible:ring-4 disabled:opacity-60 active:scale-[0.98]',
        isHuman
          ? 'border-human/30 bg-human/5 text-human hover:border-human hover:bg-human/15 focus-visible:ring-human/40'
          : 'border-bot/30 bg-bot/5 text-bot hover:border-bot hover:bg-bot/15 focus-visible:ring-bot/40',
      )}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-3xl font-semibold tracking-tight">{label}</span>
      <span className="font-mono text-xs text-muted-foreground">{hint}</span>
    </button>
  )
}
